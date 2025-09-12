const fs = require('fs/promises');
const path = require('path');
const { callLLM } = require('../LLMClient.js');

/**
 * An agent specialized in helping the user define and create project requirement
 * and specification documents.
 */
class ReqSpecsAgent {
    constructor() {
        this.name = 'ReqSpecsAgent';
    }

    /**
     * Generates a plan for project requirements and folder structure.
     * @param {string} task The user's input/task.
     * @param {Array<object>} chatHistory The full conversation history.
     * @param {AbortSignal} signal The signal to abort the LLM call.
     * @returns {Promise<string>} A JSON string containing the plan and a summary for the user.
     */
    async execute(task, chatHistory, signal) {
        const systemPrompt = `
You are the "Requirements and Specifications Agent". Your goal is to generate a complete plan for a new JavaScript project based on the user's request.

The plan should include:
1.  **Requirement Files**: Text files with short names (e.g., UI-UX, Security, Features). They must contain a numbered list of bullet points.
2.  **Folder Structure**: A text file outlining the project's directory structure.

Your response MUST be a JSON object containing a single key, "plan", which is an array of objects, where each object has "filePath" and "content" keys. DO NOT respond with anything else except the valid json.
Example: {"plan": [{"filePath": "docs/README.md", "content": "# Project Title"}, {"filePath": "src/index.js", "content": "console.log('hello')"}]}
`;
        const responseJson = await callLLM([{ role: 'system', message: systemPrompt }, ...chatHistory], signal);

        try {
            const { plan } = JSON.parse(responseJson);
            let planSummary = "Here is the proposed plan:\n\n";
            plan.forEach(file => {
                planSummary += `📄 **${file.filePath}**\n\`\`\`\n${file.content}\n\`\`\`\n\n`;
            });
            planSummary += "Do you want to create these files? (y/n)";

            // Return a structured object as a JSON string for the DiscoveryAgent to parse
            return JSON.stringify({ plan, summary: planSummary });
        } catch (e) {
            console.error(`[ReqSpecsAgent] Error processing action: ${e.message}. LLM response was: ${responseJson}`);
            return JSON.stringify({ plan: [], summary: "I had trouble generating a valid plan. Could you please rephrase your request?" });
        }
    }
}

module.exports = ReqSpecsAgent;