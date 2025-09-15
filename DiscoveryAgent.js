const fs = require('fs/promises');
const path = require('path');
const { callLLM } = require("./LLMClient.js");
const { retryLLMForJson } = require("./LLMClientHelper.js");

const SUBAGENT_DIR = path.join(__dirname, 'subagents');
const SPECS_DIR = path.join(__dirname, 'specs');
/**
 * The DiscoveryAgent operates in a development context, designed for creating and testing new subagents.
 * It can analyze a user's request and decide whether to use an existing subagent or generate a new one.
 */
class DiscoveryAgent {
    constructor() {
        this.subagents = {}; // Holds instantiated subagents
        this.subagentSpecs = {}; // Holds natural language specs for each agent
        this.currentPlan = null; // Holds the plan being worked on.
        this.pendingConfirmation = false; // True when waiting for y/n from the user.
        this.isProjectAnalyzed = false; // Flag to ensure project analysis runs only once.
    }

    /**
     * Initializes the agent by loading subagents and roles from the filesystem.
     * This should be called after the agent is instantiated.
     */
    async initialize() {
        console.log('Initializing DiscoveryAgent...');
        await this.loadSubagents();
        // await this.loadRoles(); // To be implemented
        console.log(`Found ${Object.keys(this.subagents).length} subagents.`);
        console.log('Initialization complete. Agent is ready.');
    }

    /**
     * Scans the current directory for project files and constructs an initial plan.
     */
    async constructPlanFromFiles() {
        console.log("Scanning project directory for existing files...");
        const allFiles = await this._getAllProjectFiles(process.cwd());

        if (allFiles.length === 0) {
            console.log("No project files found to construct a plan from.");
            return;
        }

        let fullContent = "";

        console.log("Reading project files...");
        for (const file of allFiles) {
            try {
                const content = await fs.readFile(file, 'utf-8');
                // Add a separator with the file path to give the LLM context for each piece of content.
                fullContent += `--- FILE: ${path.relative(process.cwd(), file)} ---\n${content}\n\n`;
            } catch (error) {
                // This can happen with binary files or files with restricted permissions.
                console.warn(`Warning: Could not read file ${file}. Skipping. Error: ${error.message}`);
            }
        }

        if (!fullContent.trim()) {
            console.log("Project files are empty. No plan constructed.");
            return;
        }

        // Chunking logic to handle large amounts of file content
        const MAX_CHUNK_SIZE = 16000; // Approx. 4k tokens
        const chunks = [];
        for (let i = 0; i < fullContent.length; i += MAX_CHUNK_SIZE) {
            chunks.push(fullContent.substring(i, i + MAX_CHUNK_SIZE));
        }

        console.log(`Analyzing ${allFiles.length} files in ${chunks.length} chunk(s)...`);

        let tempPlan = null;

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const isFirstChunk = i === 0;
            const isLastChunk = i === chunks.length - 1;

            const systemPrompt = isFirstChunk
                ? `You are a Project Architect. Analyze the following project files and create an initial project plan. Your response MUST be a valid JSON object with a single key, "plan". The "plan" object must have "requirements" and "specifications" keys, which are arrays of objects. Each object in the arrays must have "path", "content", and "dependencies". Classify files as 'requirements' if they describe high-level needs and 'specifications' if they describe what a code file will do.`
                : `You are a Project Architect. Refine the existing project plan based on the additional file content provided. The current plan is: ${JSON.stringify(tempPlan)}`;

            const prompt = `File content chunk ${i + 1}/${chunks.length}:\n\n${chunk}\n\nBased on this, ${isFirstChunk ? 'create' : 'refine'} the plan. Your response MUST be a valid JSON object.`;

            try {
                const responseText = await callLLM([{ role: 'system', message: systemPrompt }], prompt);
                tempPlan = JSON.parse(responseText).plan; // Assuming the LLM returns { "plan": ... }
                console.log(`   - Chunk ${i + 1}/${chunks.length} processed.`);
            } catch (error) {
                console.error(`Error processing chunk ${i + 1}: ${error.message}. Attempting to retry...`);
                try {
                    const result = await retryLLMForJson([{ role: 'system', message: systemPrompt }], prompt, error);
                    tempPlan = result.plan;
                } catch (retryError) {
                    console.error(`Failed to process chunk ${i + 1} after retries. Aborting plan construction.`);
                    return;
                }
            }
        }

        if (tempPlan) {
            this.currentPlan = tempPlan;
            console.log("Successfully constructed an initial project plan from existing files.");
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
     * @param {AbortSignal} signal The signal to abort the LLM call.
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

        const systemPrompt = `You are a coordinator for AchillesCLI, an AI assistant whose primary purpose is to help users generate JavaScript projects, including creating specifications and requirements.

Your task is to determine if the user's request is related to this purpose.
- If the request IS related to the JavaScript project, requirements, or specifications, select the most suitable subagent from the list below based on its description.
- If the request is NOT related to the JavaScript project (e.g., asking to cure cancer, write a poem, etc.), you must not select any agent.

Here are the available subagents:
${agentDescriptions}

Respond with a JSON object containing one key:
- "agent": The name of the most suitable agent if the task is relevant. If the task is not related to JavaScript project generation or no agent is suitable, set this to null.

Example for a suitable agent: {"agent": "SpecsAgent"}
Example for an unsuitable task: {"agent": null}`;

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
     * @param {Array<object>} chatHistory The full conversation history.
     * @returns {Promise<string>} The final response from the executed subagent.
     */
    async handleTask(userPrompt, chatHistory) {
        // On the first user request, analyze the project files to build initial context.
        if (!this.isProjectAnalyzed) {
            await this.constructPlanFromFiles();
            this.isProjectAnalyzed = true;
        }

        // 1. If we are waiting for a y/n confirmation.
        if (this.pendingConfirmation) {
            const userResponse = userPrompt.toLowerCase().trim();

            if (userResponse === 'y' || userResponse === 'yes') {
                const planExecutor = this.subagents['PlanExecutor'];
                const executionResult = await planExecutor.execute(this.currentPlan, chatHistory);
                this.pendingConfirmation = false;
                return executionResult;
            } else if (userResponse === 'n' || userResponse === 'no') {
                this.pendingConfirmation = false;
                return "Plan creation cancelled.";
            } else {
                // This is a modification request.
                console.log(`\nRequest to modify existing plan...`);
                const reqAgent = this.subagents['SpecsAgent'];
                // The last message in chatHistory is the user's modification request.
                // We add a system message before it with the current plan context.
                const modificationHistory = chatHistory.slice(0, -1);
                modificationHistory.push({ role: 'system', message: `The user is requesting a modification to the following plan: ${JSON.stringify(this.currentPlan)}` });
                modificationHistory.push(chatHistory[chatHistory.length - 1]);

                const responseString = await reqAgent.execute(userPrompt, modificationHistory, this.currentPlan);
                const { plan, summary, pendingConfirmation } = JSON.parse(responseString);
                this.currentPlan = plan; // Update the current plan
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
                const responseString = await agentToExecute.execute(userPrompt, chatHistory);
                const { plan, summary, pendingConfirmation } = JSON.parse(responseString);
                this.currentPlan = plan; // Store the plan
                this.pendingConfirmation = pendingConfirmation; // Set flag to wait for y/n
                return summary;
            }

            // Standard execution for other agents
            console.log(`\nExecuting agent: ${agentNameToActivate}...`);
            return await agentToExecute.execute(userPrompt, chatHistory);
        }

        // 3. If no suitable agent could be found, inform the user.
        if (agentNameToActivate) {
            console.log(`\nRouter suggested an unknown agent: '${agentNameToActivate}'.`);
        } else {
            console.log(`\nRouter determined no existing subagent is suitable.`);
        }
        const systemPrompt = {
            role: 'system',
            message: "You are AchillesCLI, an AI assistant specialized in helping users generate JavaScript projects. The user has made a request that is outside of this scope. Politely inform the user that you cannot fulfill their request and briefly state your purpose (generating JS projects, specs, and requirements)."
        };

        // Use the LLM to generate a user-friendly message.
        try {
            return await callLLM([systemPrompt, ...chatHistory.slice(0, -1)], userPrompt);
        } catch (error) {
            console.error(`\nAn error occurred while generating fallback message: ${error.message}\n`);
            return null;
        }
    }
}

module.exports = DiscoveryAgent;