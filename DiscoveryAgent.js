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
    /**
     * @param {object} persistoClient - An abstraction layer for the database.
     */
    constructor(persistoClient) {
        this.persistoClient = persistoClient;
        this.subagents = {}; // Holds instantiated subagents
        this.subagentSpecs = {}; // Holds natural language specs for each agent
        this.roles = {}; // Holds available roles and their descriptions
        this.currentUserRole = 'default'; // The current user's role for the session
        this.currentPlan = null; // Holds the plan being worked on.
        this.pendingConfirmation = false; // True when waiting for y/n from the user.
    }

    /**
     * Initializes the agent by loading subagents and roles from the filesystem.
     * This should be called after the agent is instantiated.
     */
    async initialize() {
        await this.loadSubagents();
        // await this.loadRoles(); // To be implemented
        console.log('DiscoveryAgent initialized.');
        console.log(`Found ${Object.keys(this.subagents).length} subagents.`);
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
        // 1. If we are waiting for a y/n confirmation.
        if (this.pendingConfirmation) {
            const userResponse = userPrompt.toLowerCase().trim();

            if (userResponse === 'y' || userResponse === 'yes') {
                const planExecutor = this.subagents['PlanExecutor'];
                const executionResult = await planExecutor.execute(this.currentPlan, chatHistory);
                this.currentPlan = null;
                this.pendingConfirmation = false;
                return executionResult;
            } else if (userResponse === 'n' || userResponse === 'no') {
                this.currentPlan = null;
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