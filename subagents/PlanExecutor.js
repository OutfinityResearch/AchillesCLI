const fs = require('fs/promises');
const path = require('path');
const { callLLM } = require('../LLMClient.js');

/**
 * An agent that executes a file creation plan.
 */
class PlanExecutor {
    constructor() {
        this.name = 'PlanExecutor';
    }

    /**
     * Receives a plan and creates the specified files and directories.
     * @param {Array<object>} plan An array of objects, each with 'filePath' and 'content'.
     * @param {Array<object>} chatHistory The full conversation history (not used by this agent).
     * @param {AbortSignal} signal The signal to abort the LLM call.
     * @returns {Promise<string>} A status message indicating success or failure.
     */
    async execute(plan, chatHistory, signal) {
        console.log("\nExecuting the plan...");
        if (!plan || plan.length === 0) {
            return "The plan is empty. Nothing to execute.";
        }

        try {
            // First pass: create all files from the plan
            for (const file of plan) {
                const filePath = path.resolve(process.cwd(), file.filePath);
                await fs.mkdir(path.dirname(filePath), { recursive: true });
                await fs.writeFile(filePath, file.content);
                console.log(`   - ✅ Created ${file.filePath}`);
            }

            // Second pass: Ask LLM to identify and then process the folder structure file
            const findStructureFilePrompt = `
You are a plan analysis expert. Given a JSON array representing a project plan, your task is to identify which file is intended to describe the project's folder structure.
The plan is an array of objects, each with "filePath" and "content". Look for a file whose content describes a tree-like structure of directories.

Respond with ONLY a JSON object with a single key "structureFilePath". The value should be the exact filePath of the structure file from the plan. If no such file is found, the value should be null.

Project Plan:
\`\`\`json
${JSON.stringify(plan, null, 2)}
\`\`\`
`;
            const structureFileResponseJson = await callLLM([{ role: 'system', message: findStructureFilePrompt }], signal);
            let structureFilePath = null;
            try {
                const result = JSON.parse(structureFileResponseJson);
                structureFilePath = result.structureFilePath;
            } catch (e) {
                console.warn(`Could not identify folder structure file from LLM response: ${structureFileResponseJson}. Skipping additional folder creation.`);
            }

            if (structureFilePath) {
                const folderStructureFile = plan.find(file => file.filePath === structureFilePath);
                if (folderStructureFile) {
                    console.log(`\nProcessing folder structure from ${folderStructureFile.filePath}...`);

                    const systemPrompt = `
You are a file structure expert. Your task is to read a natural language description of a project's folder structure and convert it into a valid JSON array of directory paths.
Only include directories, not files mentioned in the structure.

The output MUST be a JSON object with a single key "directories", which is an array of strings.
Example input:
- src
  - components
    - Button.js
  - utils
- public
  - index.html

Example output:
{"directories": ["src", "src/components", "src/utils", "public"]}

Natural language structure to parse:
\`\`\`
${folderStructureFile.content}
\`\`\`
`;
                    const responseJson = await callLLM([{ role: 'system', message: systemPrompt }], signal);
                    const { directories } = JSON.parse(responseJson);

                    if (directories && directories.length > 0) {
                        console.log("   - Creating additional directories from structure file...");
                        for (const dir of directories) {
                            const dirPath = path.resolve(process.cwd(), dir);
                            await fs.mkdir(dirPath, { recursive: true });
                            console.log(`     - ✅ Created directory ${dir}`);
                        }
                    }
                }
            }

            return "All files and directories have been created successfully.";
        } catch (error) {
            return `An error occurred during plan execution: ${error.message}`;
        }
    }
}

module.exports = PlanExecutor;