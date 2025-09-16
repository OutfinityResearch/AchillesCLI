const fs = require('fs/promises');
const path = require('path');
const { callLLM } = require("./LLMClient.js");
const { retryLLMForJson } = require("./LLMClientHelper.js");
const {constructPrompt} = require("./AgentUtil.js")
const prompts = require("./prompts/RouterAgent.js")
const SUBAGENT_DIR = path.join(__dirname, 'subagents');
const SPECS_DIR = path.join(__dirname, 'specs');
/**
 * The RouterAgent operates in a development context, designed for creating and testing new subagents.
 * It can analyze a user's request and decide whether to use an existing subagent or generate a new one.
 */
class RouterAgent {
    constructor() {
        this.subagents = {}; // Holds instantiated subagents
        this.subagentSpecs = {}; // Holds natural language specs for each agent
        this.context = null; // Holds the plan being worked on.
        this.pendingConfirmation = false; // True when waiting for y/n from the user.
        this.isProjectAnalyzed = false; // Flag to ensure project analysis runs only once.
    }

    /**
     * Initializes the agent by loading subagents and roles from the filesystem.
     * This should be called after the agent is instantiated.
     */
    async initialize() {
        console.log('Initializing RouterAgent...');
        await this.loadSubagents();
        // await this.loadRoles(); // To be implemented
        console.log(`Found ${Object.keys(this.subagents).length} subagents.`);
        console.log('Initialization complete. Agent is ready.');
    }

    /**
     * Scans the current directory for project files and constructs an initial plan.
     */
    async constructContextFromFiles() {
        console.log("Scanning for 'requirements' directory to initialize context...");
        let reqDirPath;
        try {
            const entries = await fs.readdir(process.cwd());
            const reqDirName = entries.find(entry => entry.toLowerCase() === 'requirements');
            if (reqDirName) {
                reqDirPath = path.join(process.cwd(), reqDirName);
            }
        } catch (error) {
            console.log("Could not scan current directory. Skipping initial plan construction.");
            return;
        }

        if (!reqDirPath) {
            console.log("No 'requirements' directory found. Skipping initial plan construction.");
            return;
        }

        const allFiles = await this._getAllProjectFiles(reqDirPath);

        if (allFiles.length === 0) {
            console.log("'requirements' directory is empty. No plan to construct.");
            return;
        }

        const MAX_CHUNK_SIZE = 16000; // Approx. 4k tokens
        let chunkContent = "";
        let tempPlan = null;
        let chunkIndex = 0;

        console.log(`Reading and analyzing ${allFiles.length} files from '${path.basename(reqDirPath)}' directory...`);
        try {
            for (const file of allFiles) {
                try {
                    const content = await fs.readFile(file, 'utf-8');
                    const fileBlock = `--- FILE: ${path.relative(process.cwd(), file)} ---\n${content}\n\n`;

                    if (chunkContent.length + fileBlock.length > MAX_CHUNK_SIZE && chunkContent) {
                        // Process the current chunk before it gets too large
                        tempPlan = await this._processChunk(chunkContent, tempPlan, ++chunkIndex);
                        chunkContent = ""; // Reset for the next chunk
                    }
                    chunkContent += fileBlock;
                } catch (readError) {
                    console.warn(`Warning: Could not read file ${file}. Skipping. Error: ${readError.message}`);
                }
            }

            // Process the final remaining chunk
            if (chunkContent) {
                tempPlan = await this._processChunk(chunkContent, tempPlan, ++chunkIndex);
            }
        } catch (error) { /* The _processChunk method will log the final error */ return; }

        if (tempPlan) {
            this.context = tempPlan;
            console.log("Successfully constructed an initial project plan from the requirements directory.");
        }
    }

    /**
     * Helper method to process a single chunk of file content with the LLM.
     * @param {string} chunk The string content of the chunk.
     * @param {object|null} currentPlan The plan from the previous chunk, if any.
     * @param {number} chunkIndex The index of the current chunk.
     * @returns {Promise<object>} The updated plan.
     */
    async _processChunk(chunk, currentPlan, chunkIndex) {
        const isFirstChunk = currentPlan === null;
        console.log(`   - Analyzing file content chunk ${chunkIndex}...`);

        const systemPrompt = isFirstChunk
            ? prompts.initPlanPrompt
            : constructPrompt(prompts.initUpdatePlan, { currentPlan: JSON.stringify(currentPlan) });

        const prompt = `File content chunk:\n\n${chunk}\n\nBased on this, ${isFirstChunk ? 'create' : 'refine'} the plan. Your response MUST be a valid JSON object.`;

        try {
            let resultPlan;
            try {
                const responseText = await callLLM([{ role: 'system', message: systemPrompt }], prompt);
                resultPlan = JSON.parse(responseText).plan;
            } catch (error) {
                console.warn(`Initial LLM call failed for chunk ${chunkIndex}. Error: ${error.message}`);
                const result = await retryLLMForJson([{ role: 'system', message: systemPrompt }], prompt, error);
                resultPlan = result.plan;
            }
            console.log(`   - Chunk ${chunkIndex} processed successfully.`);
            return resultPlan;
        } catch (retryError) {
            console.error(`Failed to process chunk ${chunkIndex} after retries. Aborting plan construction.`);
            // Re-throw the error to stop the entire constructPlanFromFiles process
            throw retryError;
        }
    }

    /**
     * Loads subagents and their specifications from the subagents/ directory.
     */
    async loadSubagents() {
        try {
            await fs.mkdir(SUBAGENT_DIR, { recursive: true });
            const files = await fs.readdir(SUBAGENT_DIR);
            const agentFiles = files.filter(file => file.endsWith('.js'));

            for (const file of agentFiles) {
                const agentName = path.basename(file, '.js');
                const specPath = path.join(SPECS_DIR, "subagents", `${agentName}.js.specs`);
                const agentPath = path.join(SUBAGENT_DIR, file);

                try {
                    const specContent = await fs.readFile(specPath, 'utf-8');
                    const AgentClass = require(agentPath);
                    this.subagents[agentName] = new AgentClass();
                    this.subagentSpecs[agentName] = specContent.trim();
                } catch (error) {
                    console.warn(`Warning: Could not load agent '${agentName}'. Missing spec file or error in agent file.`, error);
                }
            }
        } catch (error) {
            console.error('Error loading subagents:', error);
        }
    }

    /**
     * Recursively gets all file paths in a directory, ignoring common patterns.
     * @param {string} dirPath The directory to scan.
     * @param {Array<string>} [arrayOfFiles] Used for recursion.
     * @returns {Promise<Array<string>>} A list of file paths.
     */
    async _getAllProjectFiles(dirPath, arrayOfFiles = []) {
        const ignore = new Set(['node_modules', '.git', '.vscode', 'DS_Store']);
        try {
            const files = await fs.readdir(dirPath);

            for (const file of files) {
                if (ignore.has(path.basename(file))) continue;

                const fullPath = path.join(dirPath, file);
                if ((await fs.stat(fullPath)).isDirectory()) {
                    await this._getAllProjectFiles(fullPath, arrayOfFiles);
                } else {
                    arrayOfFiles.push(fullPath);
                }
            }
        } catch (error) { /* Ignore errors from reading restricted directories */ }
        return arrayOfFiles;
    }

    /**
     * Analyzes the user's prompt and routes it to the most appropriate subagent.
     * @param {string} task The user's task.
     * @returns {Promise<string|null>} The name of the most appropriate agent, or null.
     */
    async routeToAgent(task) {
        if (Object.keys(this.subagentSpecs).length === 0) {
            console.log("No subagents found to route to.");
            return null;
        }

        const agentDescriptions = Object.entries(this.subagentSpecs)
            .map(([name, spec]) => `- ${name}: ${spec}`)
            .join('\n');

        const systemPrompt = constructPrompt(prompts.routeToAgentPrompt, { agentDescriptions });

        const history = [
            { role: 'system', message: systemPrompt },
        ];
        const prompt = `User request: "${task}"`;

        try {
            const responseText = await callLLM(history, prompt);
            const choice = JSON.parse(responseText);
            return choice.agent; // This can be null if no agent was found
        } catch (error) {
            console.warn(`Initial LLM call failed for routing. Error: ${error.message}`);
            // In the catch block, we now trigger the retry mechanism.
            try {
                const choice = await retryLLMForJson(history, prompt, error);
                return choice.agent;
            } catch (retryError) {
                console.error(`Error: Could not get a valid routing response from LLM after multiple retries. ${retryError.message}`);
                return null;
            }
        }
    }

    /**
     * Main task handling logic. It routes the request, reviews or generates a subagent, and executes it.
     * @param {string} userPrompt The user's input.
     * @returns {Promise<string>} The final response from the executed subagent.
     */
    async handleTask(userPrompt) {
        // On the first user request, analyze the project files to build initial context.
        if (!this.isProjectAnalyzed) {
            await this.constructContextFromFiles();
            this.isProjectAnalyzed = true;
        }

        // 1. If we are waiting for a y/n confirmation.
        if (this.pendingConfirmation) {
            const userResponse = userPrompt.toLowerCase().trim();

            if (userResponse === 'y' || userResponse === 'yes') {
                const planExecutor = this.subagents['PlanExecutor'];
                const executionResult = await planExecutor.execute(this.context);
                this.context = null;
                this.pendingConfirmation = false;
                return executionResult;
            } else if (userResponse === 'n' || userResponse === 'no') {
                this.context = null;
                this.pendingConfirmation = false;
                return "Plan creation cancelled.";
            } else {
                // This is a modification request.
                console.log(`\nRequest to modify existing plan...`);
                const reqAgent = this.subagents['SpecsAgent'];
                const responseString = await reqAgent.execute(userPrompt, this.context);
                const { plan, summary, pendingConfirmation } = JSON.parse(responseString);
                this.context = plan; // Update the current plan
                this.pendingConfirmation = pendingConfirmation;
                return summary; // Return the new summary
            }
        }

        // 2. If no confirmation is pending, route to find an agent.
        const agentNameToActivate = await this.routeToAgent(userPrompt);

        if (agentNameToActivate && this.subagents[agentNameToActivate]) {
            const agentToExecute = this.subagents[agentNameToActivate];

            // Special handling for the requirements generation workflow
            if (agentNameToActivate === 'SpecsAgent') {
                console.log(`\nActivating agent: ${agentNameToActivate}...`);
                const responseString = await agentToExecute.execute(userPrompt);
                const { plan, summary, pendingConfirmation } = JSON.parse(responseString);
                this.context = plan; // Store the plan
                this.pendingConfirmation = pendingConfirmation; // Set flag to wait for y/n
                return summary;
            }

            // Standard execution for other agents
            console.log(`\nExecuting agent: ${agentNameToActivate}...`);
            return await agentToExecute.execute(userPrompt);
        }

        // 3. If no suitable agent could be found, inform the user.
        if (agentNameToActivate) {
            console.log(`\nRouter suggested an unknown agent: '${agentNameToActivate}'.`);
        } else {
            console.log(`\nRouter determined no existing subagent is suitable.`);
        }
        const systemPrompt = {
            role: 'system',
            message: constructPrompt(prompts.outsideScopePrompt)
        };

        // Use the LLM to generate a user-friendly message.
        try {
            return await callLLM([systemPrompt], userPrompt);
        } catch (error) {
            console.error(`\nAn error occurred while generating fallback message: ${error.message}\n`);
            return null;
        }
    }
}

module.exports = RouterAgent;