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

        const { folderStructure, contents } = plan;

        try {
            // 1. Combine all files to be created into a single list
            const allFiles = [...contents];
            if (folderStructure && folderStructure.filePath) {
                allFiles.push(folderStructure);
            }

            // 2. Create all the files
            for (const file of allFiles) {
                const filePath = path.resolve(process.cwd(), file.filePath);
                await fs.mkdir(path.dirname(filePath), { recursive: true });
                await fs.writeFile(filePath, file.content);
                console.log(`   - ✅ Created ${file.filePath}`);
            }

            // 3. If a folder structure file exists, parse it and create the directories
            if (folderStructure && folderStructure.content) {
                console.log(`\nProcessing folder structure from ${folderStructure.filePath}...`);
                const systemPrompt = `
You are a file structure expert. Your task is to read a natural language description of a project's folder structure and convert it into a valid JSON array of directory paths.
Only include directories, not files mentioned in the structure.

The output MUST be a JSON object with a single key "directories", which is an array of strings.
Example input:
- src
  - components
  - utils
- public

Example output:
{"directories": ["src", "src/components", "src/utils", "public"]}

Natural language structure to parse:
\`\`\`
${folderStructure.content}
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

            return "All files and directories have been created successfully.";
        } catch (error) {
            return `An error occurred during plan execution: ${error.message}`;
        }
    }
}

module.exports = PlanExecutor;