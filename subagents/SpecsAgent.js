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
                // Check if the error is due to request abortion (ESC pressed)
                if (error.name === 'AbortError' || error.message.includes('aborted')) {
                    throw error; // Re-throw abort errors immediately
                }
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
        try {
            // --- Step 1: Generate Main SRS Document ---
            console.log("   - Generating main SRS document...");
            const srsTemplate = prompts.SRSDocumentTemplate;
            const srsSystemPrompt = `You are a Project Architect. Based on the user's request, create a SRS Document based on the Template given below.
            Add missing pieces of information that the user left out based on how the standard is for that sort of project.
            Your response MUST be the full SRS Document content`;
            const srsHistory = [{ role: 'system', message: srsSystemPrompt }];
            const srsPrompt = `User Request: "${userInput}"\n\nSRS Template:\n${srsTemplate}`;

            let mainSRS;
            try {
                const srsResponseText = await callLLM(srsHistory, srsPrompt);
                mainSRS = {
                    path: 'requirements/Project Main SRS.txt',
                    content: srsResponseText
                };
            } catch (error) {
                if (error.name === 'AbortError' || error.message.includes('aborted')) {
                    throw error; // Re-throw abort errors immediately
                }
                console.warn(`Initial LLM call failed for SRS generation. Error: ${error.message}`);
            }

            // --- Step 2: Generate Detailed Feature Documents based on the Main SRS ---
            console.log("   - Generating detailed feature documents based on SRS...");
            const featureSystemPrompt = `You are a Project Architect. You have been given a main SRS document. Your task is to create a separate, detailed requirement file for each major feature listed in the SRS document's "System Features" section. 
            Use the "Individual Feature Specification Template" from the SRS for each file. Your response MUST be a valid JSON object with two keys: "featureFiles" (an array of file objects, each with "path" and "content") and "changeSummary" (a brief summary of the plan you created).`;
            const featureHistory = [{ role: 'system', message: featureSystemPrompt }];
            const featurePrompt = `Main SRS Document Content:\n\n${mainSRS.content}`;

            let finalResult;
            try {
                const featureResponseText = await callLLM(featureHistory, featurePrompt);
                finalResult = JSON.parse(featureResponseText);
            } catch (error) {
                if (error.name === 'AbortError' || error.message.includes('aborted')) throw error;
                console.warn(`Initial LLM call failed for detailed feature generation. Error: ${error.message}`);
                finalResult = await retryLLMForJson(featureHistory, featurePrompt, error);
            }

            const allRequirements = [mainSRS, ...(finalResult.featureFiles || [])];

            // --- Step 3: Generate .specs files based on all requirements ---
            console.log("   - Generating .specs files based on all requirements...");
            const specsSystemPrompt = constructPrompt(prompts.createSpecsPrompt, { requirements: JSON.stringify(allRequirements) })
            const specsHistory = [{ role: 'system', message: specsSystemPrompt }];
            let specsResult;
            try {
                const specsResponseText = await callLLM(specsHistory);
                specsResult = JSON.parse(specsResponseText);
            } catch (error) {
                if (error.name === 'AbortError' || error.message.includes('aborted')) throw error;
                console.warn(`Initial LLM call failed for .specs generation. Error: ${error.message}`);
                specsResult = await retryLLMForJson(specsHistory, specsPrompt, error);
            }

            // Update the requirements with the new dependencies returned by the LLM
            const updatedRequirements = allRequirements.map(req => {
                if (specsResult.requirementDependencies && specsResult.requirementDependencies[req.path]) {
                    return { ...req, dependencies: specsResult.requirementDependencies[req.path] };
                }
                return req;
            });

            const plan = {
                requirements: updatedRequirements,
                specifications: specsResult.specifications || [],
            };

            let planSummary = `${finalResult.changeSummary}\n\n`;

            // Add requirement files to summary
            if (plan.requirements && plan.requirements.length > 0) {
                plan.requirements.forEach(file => {
                    planSummary += `📄 **${file.path}**\n\`\`\`\n${file.content}\n\`\`\`\n\n`;
                });
            }

            planSummary += "Do you want to create these files? (y/n)";

            // Return a structured object as a JSON string for the DiscoveryAgent to parse
            return JSON.stringify({ plan, summary: planSummary, pendingConfirmation: true });
        } catch (e) {
            console.error(`[SpecsAgent] Error during plan creation after multiple retries: ${e.message}`);
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