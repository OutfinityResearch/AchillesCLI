const fs = require('fs/promises');
const path = require('path');
const { callLLM } = require('../LLMClient.js');
const { retryLLMForJson } = require('../LLMClientHelper.js');

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
     * @param {string} task The user's input/task.
     * @param {Array<object>} chatHistory The full conversation history.
     * @param {object|null} currentPlan The existing plan to modify, if any.
     * @returns {Promise<string>} A JSON string containing the plan and a summary for the user.
     */
    async execute(task, chatHistory, currentPlan = null) {
        if (currentPlan) {
            return await this.modifyPlan(task, currentPlan);
        } else {
            return await this.createPlan(task, chatHistory);
        }
    }

    /**
     * Modifies an existing project plan based on user input.
     * @param {string} task The user's modification request.
     * @param {object} currentPlan The existing plan to modify.
     * @returns {Promise<string>} A JSON string with the updated plan and a summary of changes.
     */
    async modifyPlan(task, currentPlan) {
        const systemPrompt = `
You are the "Project Architect Agent". Your goal is to modify an existing project plan based on a user's request.

You will be given the current plan and a modification request. You MUST return a delta of the changes.
When modifying, you must trace the dependencies and identify all affected files.

Your response MUST be a JSON object with a single key, "delta". The "delta" object must have the following keys:
- "add": An object with "requirements" and "specifications" arrays for any new files.
- "modify": An object with "requirements" and "specifications" arrays for any modified files.
- "delete": An object with "requirements" and "specifications" arrays containing the paths of any deleted files.
- "changeSummary": A natural language summary of the changes you have made.

Current Plan:
\`\`\`json
${JSON.stringify(currentPlan, null, 2)}
\`\`\`

Based on the user's request, what is the delta of changes?`;

        const history = [{ role: 'system', message: systemPrompt }];
        const prompt = `User's modification request: "${task}"`;

        try {
            let delta;
            try {
                const responseText = await callLLM(history, prompt);
                const result = JSON.parse(responseText);
                delta = result.delta;
            } catch (error) {
                console.warn(`Initial LLM call failed for plan modification. Error: ${error.message}`);
                const result = await retryLLMForJson(history, prompt, error);
                delta = result.delta;
            }

            // Apply the delta to create the new plan
            const newPlan = this.applyDelta(currentPlan, delta);

            const plansAreDifferent = JSON.stringify(currentPlan) !== JSON.stringify(newPlan);
            let summary;
            if (plansAreDifferent) {
                summary = delta.changeSummary ? `${delta.changeSummary}\n\nDo you want to apply these changes? (y/n)` : "An update was made. Do you want to apply the changes? (y/n)";
            } else {
                summary = "No changes were detected in the plan.";
            }

            return JSON.stringify({ plan: newPlan, summary, pendingConfirmation: plansAreDifferent });

        } catch (e) {
            console.error(`[SpecsAgent] Error processing modification after multiple retries: ${e.message}`);
            return JSON.stringify({ plan: currentPlan, summary: "I had trouble modifying the plan. The current plan remains unchanged. Please try again.", pendingConfirmation: false });
        }
    }

    /**
     * Creates a new project plan from scratch.
     * @param {string} task The user's initial request.
     * @param {Array<object>} chatHistory The conversation history.
     * @returns {Promise<string>} A JSON string with the new plan and a summary.
     */
    async createPlan(task, chatHistory) {
        const systemPrompt = `
You are the "Project Architect Agent". Your goal is to create and maintain a detailed project plan as a dependency graph.

**Analyze the user's request and the conversation history.**
- If the history contains an existing plan (in a system message), you MUST treat the user's request as a modification to that plan. When modifying, you must trace the dependencies and update any affected files.
- If there is no existing plan, generate a new one from scratch.

The plan should include:
1.  **Requirement Files**: High-level project needs.
2.  **Specification Files**: '.specs' files that describe what a future code file will do.
3.  **Dependency Links**: Requirements should link to the specs that implement them.

Your response MUST be a JSON object with a single key, "plan".
The "plan" object must have the following keys:
- "requirements": An array of objects. Each object must have "path" (string), "content" (string), and "dependencies" (an array of file paths it depends on).
- "specifications": An array of objects. Each object must have "path" (string), "content" (string), and "dependencies" (an array of file paths it depends on).
- "changeSummary": A natural language summary of the changes you have made to the plan.
DO NOT respond with anything else except the valid json.

Example:
{
  "plan": {
    "requirements": [
      {
        "path": "requirements/auth.txt",
        "content": "1. Users must be able to log in with email and password.",
        "dependencies": ["src/auth/login.js.specs"]
      }
    ],
    "specifications": [
      {
        "path": "src/auth/login.js.specs",
        "content": "This file will contain the logic for the user login flow.",
        "dependencies": ["requirements/auth.txt"]
      }
    ],
    "changeSummary": "I have created an initial plan with an authentication requirement and a corresponding specification for the login logic."
  }
}
        `;
        const history = [{ role: 'system', message: systemPrompt }, ...chatHistory.slice(0, -1)];
        const prompt = chatHistory[chatHistory.length - 1].message;

        try {
            let plan;
            try {
                const responseText = await callLLM(history, prompt);
                const result = JSON.parse(responseText);
                plan = result.plan;
            } catch (error) {
                console.warn(`Initial LLM call failed for plan generation. Error: ${error.message}`);
                const result = await retryLLMForJson(history, prompt, error);
                plan = result.plan;
            }

            const { requirements, specifications, changeSummary } = plan;

            let planSummary = "Here is the proposed plan:\n\n";

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
        for (const modFile of [...modifyReqs, ...modifySpecs]) {
            const collection = modFile.type === 'requirement' ? newPlan.requirements : newPlan.specifications;
            const index = collection.findIndex(f => f.path === modFile.path);
            if (index !== -1) {
                collection[index] = modFile; // Replace the old file with the modified one
            }
        }

        // Handle Additions
        newPlan.requirements.push(...(delta.add?.requirements || []));
        newPlan.specifications.push(...(delta.add?.specifications || []));

        return newPlan;
    }
}

module.exports = SpecsAgent;