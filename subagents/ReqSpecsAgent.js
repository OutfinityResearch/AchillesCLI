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
3.  **.specs Files**: For each code file (e.g., 'index.js') you imagine for the project, create a corresponding '.specs' file (e.g., 'index.js.specs') that describes what the code will do in natural language.

Your response MUST be a JSON object with a single key, "plan".
The "plan" object must have two keys: "folderStructure" and "contents".
- "folderStructure": An object with "filePath" and "content" for the single file describing the project's directory structure.
- "contents": An array of objects, where each object has "filePath" and "content". This array should include BOTH the requirement files AND the .specs files.
DO NOT respond with anything else except the valid json.
Example:
{
  "plan": {
    "folderStructure": {
      "filePath": "docs/folder-structure.txt",
      "content": "- src\\n  - components\\n    - Button.js\\n- public"
    },
    "contents": [
      { "filePath": "requirements/ui-ux.txt", "content": "1. The app will have a dark mode." },
      { "filePath": "src/components/Button.js.specs", "content": "This file will contain a reusable Button component for the UI." }
    ]
  }
}
`;
        const responseJson = await callLLM([{ role: 'system', message: systemPrompt }, ...chatHistory], signal);

        try {
            const { plan } = JSON.parse(responseJson);
            const { folderStructure, contents } = plan;

            let planSummary = "Here is the proposed plan:\n\n";

            // Add folder structure file to summary
            if (folderStructure && folderStructure.filePath) {
                planSummary += `📄 **${folderStructure.filePath}**\n\`\`\`\n${folderStructure.content}\n\`\`\`\n\n`;
            }

            // Add content files to summary
            contents.forEach(file => {
                planSummary += `📄 **${file.filePath}**\n\`\`\`\n${file.content}\n\`\`\`\n\n`;
            });

            planSummary += "Do you want to create these files? (y/n)";

            // Return a structured object as a JSON string for the DiscoveryAgent to parse
            return JSON.stringify({ plan, summary: planSummary });
        } catch (e) {
            console.error(`[ReqSpecsAgent] Error processing action: ${e.message}. LLM response was: ${responseJson}`);
            return JSON.stringify({ plan: {}, summary: "I had trouble generating a valid plan. Could you please rephrase your request?" });
        }
    }
}

module.exports = ReqSpecsAgent;