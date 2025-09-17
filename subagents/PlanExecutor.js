const fs = require('fs/promises');
const path = require('path');
const { callLLM } = require('../LLMClient.js');
const { retryLLMForJson } = require('../LLMClientHelper.js');

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
     * @returns {Promise<string>} A status message indicating success or failure.
     */
    async execute(plan) {
        console.log("\nExecuting the plan...");
        if (!plan || (!plan.requirements && !plan.specifications)) {
            return "The plan is empty. Nothing to execute.";
        }

        const { requirements, specifications } = plan;

        try {
            const allFiles = (requirements || []).concat(specifications || []);

            if (allFiles.length === 0) {
                return "The plan contains no files to create.";
            }

            // Create all the files
            for (const file of allFiles) {
                // Sanitize the path to ensure it's always relative and prevent writing to the root directory.
                const safeRelativePath = file.path.startsWith('/') ? file.path.substring(1) : file.path;
                const filePath = path.resolve(process.cwd(), safeRelativePath);
                await fs.mkdir(path.dirname(filePath), { recursive: true });
                file.content += "\nDependencies: " + JSON.stringify(file.dependencies);
                await fs.writeFile(filePath, file.content);
                console.log(`   - ✅ Created ${file.path}`);
            }

            return "All plan files have been created successfully.";
        } catch (error) {
            return `An error occurred during plan execution: ${error.message}`;
        }
    }
}

module.exports = PlanExecutor;