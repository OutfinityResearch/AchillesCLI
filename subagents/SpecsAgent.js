const { callLLM } = require('../LLMClient.js');
const { retryLLMForJson } = require('../LLMClientHelper.js');
const fs = require('fs/promises');
const path = require('path');
const {constructPrompt} = require("../AgentUtil.js")
const prompts = require("../prompts/SpecsAgent.js")
/**
 * An agent specialized in helping the user define and create project requirement
 * and specification documents.
 */
class SpecsAgent {
    constructor() {
        this.name = 'SpecsAgent';
    }

    /**
     * Generates a plan for project requirements and folder structure.
     * This method acts as a dispatcher, deciding whether to create a new plan or modify an existing one.
     * @param {string} userInput The user's input.
     * @param {object|null} context The existing plan to modify, if any.
     * @returns {Promise<string>} A JSON string containing the plan and a summary for the user.
     */
    async execute(userInput, context = null) {
        if (context) {
            return await this.modifyPlan(userInput, context);
        } else {
            return await this.createPlan(userInput);
        }
    }

    /**
     * Modifies an existing project plan based on user input.
     * @param {string} userInput The user's modification request.
     * @param {object} context The existing plan to modify.
     * @returns {Promise<string>} A JSON string with the updated plan and a summary of changes.
     */
    async modifyPlan(userInput, context) {
        const systemPrompt = constructPrompt(prompts.modifyPlanPrompt, { context: JSON.stringify(context) });

        const history = [{ role: 'system', message: systemPrompt }];
        const prompt = `User's modification request: "${userInput}"`;

        try {
            let delta;
            let result;
            try {
                const responseText = await callLLM(history, prompt);
                result = JSON.parse(responseText);
            } catch (error) {
                console.warn(`Initial LLM call failed for plan modification. Error: ${error.message}`);
                result = await retryLLMForJson(history, prompt, error);
            }

            // Check if the LLM needs more information before providing a delta
            if (result.requireInfo && Array.isArray(result.files) && result.files.length > 0) {
                console.log(`\nAgent requires more information. Reading ${result.files.length} additional files...`);

                let additionalContent = "";
                for (const filePath of result.files) {
                    try {
                        const fullPath = path.resolve(process.cwd(), filePath);
                        const content = await fs.readFile(fullPath, 'utf-8');
                        additionalContent += `--- FILE: ${filePath} ---\n${content}\n\n`;
                        console.log(`   - Read ${filePath}`);
                    } catch (e) {
                        console.warn(`   - Warning: Could not read requested file: ${filePath}`);
                        additionalContent += `--- FILE: ${filePath} ---\n[Error: Could not read file content]\n\n`;
                    }
                }

                // Create a temporary history for the follow-up call
                const tempHistory = [
                    ...history, // Original system prompt
                    { role: 'human', message: prompt }, // Original user request
                    { role: 'ai', message: JSON.stringify(result) }, // LLM's request for info
                    { role: 'system', message: `Here is the content of the files you requested:\n\n${additionalContent}` } // The new info
                ];
                const followUpPrompt = "Now, based on all the information provided, please provide the JSON response with the 'delta' of changes.";

                // Second call to get the delta
                const responseText = await callLLM(tempHistory, followUpPrompt);
                const finalResult = JSON.parse(responseText);
                delta = finalResult.delta;
            } else {
                // The first response contained the delta directly
                delta = result.delta;
            }

            // Apply the delta to create the new plan
            const newPlan = this.applyDelta(context, delta);

            const plansAreDifferent = JSON.stringify(context) !== JSON.stringify(newPlan);
            let summary;
            if (plansAreDifferent) {
                summary = delta.changeSummary ? `${delta.changeSummary}\n` : 'Here are the proposed changes:\n';

                const addedFiles = (delta.add?.requirements || []).concat(delta.add?.specifications || []);
                if (addedFiles.length > 0) {
                    summary += "\n**Files to be Added:**\n";
                    addedFiles.forEach(file => { summary += `- ${file.path}\n`; });
                }

                const modifiedFiles = (delta.modify?.requirements || []).concat(delta.modify?.specifications || []);
                if (modifiedFiles.length > 0) {
                    summary += "\n**Files to be Modified:**\n";
                    modifiedFiles.forEach(file => { summary += `- ${file.path}\n`; });
                }

                const deletedFiles = (delta.delete?.requirements || []).concat(delta.delete?.specifications || []);
                if (deletedFiles.length > 0) {
                    summary += "\n**Files to be Deleted:**\n";
                    deletedFiles.forEach(path => { summary += `- ${path}\n`; });
                }

                summary += "\nDo you want to apply these changes? (y/n)";
            } else {
                summary = "No changes were detected in the plan.";
            }

            return JSON.stringify({ plan: newPlan, summary, pendingConfirmation: plansAreDifferent });

        } catch (e) {
            console.error(`[SpecsAgent] Error processing modification after multiple retries: ${e.message}`);
            return JSON.stringify({ plan: context, summary: "I had trouble modifying the plan. The current plan remains unchanged. Please try again.", pendingConfirmation: false });
        }
    }

    /**
     * Creates a new project plan from scratch.
     * @param {string} userInput The user's initial request.
     * @returns {Promise<string>} A JSON string with the new plan and a summary.
     */
    async createPlan(userInput) {
        const systemPrompt = prompts.createPlanPrompt;
        const history = [{ role: 'system', message: systemPrompt }];
        try {
            let plan;
            try {
                const responseText = await callLLM(history, userInput);
                const result = JSON.parse(responseText);
                plan = result.plan;
            } catch (error) {
                console.warn(`Initial LLM call failed for plan generation. Error: ${error.message}`);
                const result = await retryLLMForJson(history, prompt, error);
                plan = result.plan;
            }

            const { requirements, specifications, changeSummary } = plan;

            let planSummary = `${changeSummary}\n\n`;

            // Add requirement files to summary
            if (requirements && requirements.length > 0) {
                requirements.forEach(file => {
                    planSummary += `📄 **${file.path}**\n\`\`\`\n${file.content}\n\`\`\`\n\n`;
                });
            }

            // Add specification files to summary
            if (specifications && specifications.length > 0) {
                specifications.forEach(file => {
                    planSummary += `📄 **${file.path}**\n\`\`\`\n${file.content}\n\`\`\`\n\n`;
                });
            }

            planSummary += "Do you want to create these files? (y/n)";

            // Return a structured object as a JSON string for the DiscoveryAgent to parse
            return JSON.stringify({ plan, summary: planSummary, pendingConfirmation: true });
        } catch (e) {
            console.error(`[ReqSpecsAgent] Error processing action after multiple retries: ${e.message}`);
            return JSON.stringify({ plan: {}, summary: "I had trouble generating a valid plan. Could you please rephrase your request?", pendingConfirmation: false });
        }
    }

    /**
     * Applies a delta of changes to a plan object to produce a new plan.
     * @param {object} originalPlan The plan to modify.
     * @param {object} delta The delta object with add, modify, and delete instructions.
     * @returns {object} The new, updated plan.
     */
    applyDelta(originalPlan, delta) {
        const newPlan = JSON.parse(JSON.stringify(originalPlan)); // Deep copy

        // Handle Deletions
        const deleteReqs = new Set(delta.delete?.requirements || []);
        const deleteSpecs = new Set(delta.delete?.specifications || []);
        newPlan.requirements = newPlan.requirements.filter(r => !deleteReqs.has(r.path));
        newPlan.specifications = newPlan.specifications.filter(s => !deleteSpecs.has(s.path));

        // Handle Modifications
        const modifyReqs = delta.modify?.requirements || [];
        const modifySpecs = delta.modify?.specifications || [];
        for (const modFile of modifyReqs) {
            const index = newPlan.requirements.findIndex(f => f.path === modFile.path);
            if (index !== -1) {
                newPlan.requirements[index] = modFile; // Replace the old file with the modified one
            }
        }
        for (const modFile of modifySpecs) {
            const index = newPlan.specifications.findIndex(f => f.path === modFile.path);
            if (index !== -1) {
                newPlan.specifications[index] = modFile; // Replace the old file with the modified one
            }
        }

        // Handle Additions
        newPlan.requirements.push(...(delta.add?.requirements || []));
        newPlan.specifications.push(...(delta.add?.specifications || []));

        return newPlan;
    }
}

module.exports = SpecsAgent;