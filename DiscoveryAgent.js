const fs = require('fs/promises');
const path = require('path');
const { callLLM } = require("./LLMClient.js");

const SUBAGENT_DIR = path.join(__dirname, 'subagents');

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
                const specPath = path.join(SUBAGENT_DIR, `${agentName}.js.specs`);
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
    async routeToAgent(task, signal) {
        if (Object.keys(this.subagentSpecs).length === 0) {
            console.log("No subagents found to route to.");
            return null;
        }

        const agentDescriptions = Object.entries(this.subagentSpecs)
            .map(([name, spec]) => `- ${name}: ${spec}`)
            .join('\n');

        const systemPrompt = `You are an expert coordinator agent. Your job is to route user requests to the correct specialized subagent.
Here are the available subagents:
${agentDescriptions}

Based on the user's request, respond with ONLY the name of the most appropriate agent in a JSON format. If no agent is suitable, respond with {"agent": null}.
Example: {"agent": "GitAgent"}`;

        const routingHistory = [
            { role: 'system', message: systemPrompt },
            { role: 'human', message: `User request: "${task}"` }
        ];

        const responseJson = await callLLM(routingHistory, signal);
        try {
            const choice = JSON.parse(responseJson);
            return choice.agent || null;
        } catch (e) {
            console.log(`Error: Could not parse routing response from LLM.`);
            return null;
        }
    }

    /**
     * Performs an LLM-powered code review of a subagent's source code against a task.
     * @param {string} agentName The name of the agent to review.
     * @param {string} task The user's task description.
     * @param {AbortSignal} signal The signal to abort the LLM call.
     * @returns {Promise<boolean>} True if the agent is suitable, false otherwise.
     */
    async reviewSubagent(agentName, task, signal) {
        console.log(`\nPerforming LLM code review for ${agentName}...`);
        const agentPath = path.join(SUBAGENT_DIR, `${agentName}.js`);
        try {
            const agentCode = await fs.readFile(agentPath, 'utf-8');
            const systemPrompt = `You are a code reviewer. Your task is to determine if the provided script is suitable for completing the user's request.
Respond with ONLY a JSON object with a single key "suitable" and a boolean value.

User request: "${task}"

Agent source code:
\`\`\`javascript
${agentCode}
\`\`\`

Is this agent suitable for the request?`;

            const responseJson = await callLLM([{ role: 'system', message: systemPrompt }], signal);
            const result = JSON.parse(responseJson);
            return result.suitable === true;
        } catch (e) {
            console.log(`Warning: Could not determine agent suitability. Assuming not suitable. Error: ${e.message}`);
            return false;
        }
    }

    /**
     * Generates a new subagent using the LLM.
     * @param {string} task The user's task description.
     * @param {AbortSignal} signal The signal to abort the LLM call.
     * @returns {Promise<string|null>} The name of the newly generated agent, or null on failure.
     */
    async generateSubagent(task, signal) {
        console.log(`\nGenerating a new subagent for task: "${task}"`);
        // In a real implementation, this would be a much more sophisticated prompt.
        const systemPrompt = `You are a JavaScript code generation expert. Based on the user's task, create a new subagent.
The subagent must be a class that exports itself. It needs a 'name' property and an 'execute' method.
The 'execute' method should take (task, chatHistory, signal) as arguments.

Respond with ONLY a JSON object with three keys: "agentName", "agentCode", and "agentSpec".
'agentName' should be a concise PascalCase name for the agent.
'agentCode' should be the full JavaScript code for the agent class.
'agentSpec' should be a one-sentence natural language description of what the agent does.

User Task: "${task}"`;

        const responseJson = await callLLM([{ role: 'system', message: systemPrompt }], signal);
        try {
            const { agentName, agentCode, agentSpec } = JSON.parse(responseJson);

            const agentPath = path.join(SUBAGENT_DIR, `${agentName}.js`);
            const specPath = path.join(SUBAGENT_DIR, `${agentName}.js.specs`);

            await fs.writeFile(agentPath, agentCode);
            await fs.writeFile(specPath, agentSpec);

            console.log(`\nNew subagent "${agentName}" created successfully.`);

            // Load the new agent dynamically
            const AgentClass = require(agentPath);
            this.subagents[agentName] = new AgentClass();
            this.subagentSpecs[agentName] = agentSpec;

            return agentName;
        } catch (e) {
            console.error(`Error: Failed to generate or save new subagent. ${e.message}`);
            return null;
        }
    }

    /**
     * Main task handling logic. It routes the request, reviews or generates a subagent, and executes it.
     * @param {string} task The user's input.
     * @param {Array<object>} chatHistory The full conversation history.
     * @param {AbortSignal} signal The signal to abort the LLM call.
     * @returns {Promise<string>} The final response from the executed subagent.
     */
    async handleTask(task, chatHistory, signal) {
        let agentName = await this.routeToAgent(task, signal);
        let agentToExecute;

        if (agentName && this.subagents[agentName]) {
            console.log(`\nFound suitable agent: ${agentName}.`);
            const isSuitable = await this.reviewSubagent(agentName, task, signal);

            if (isSuitable) {
                console.log(`\nCode review passed. Executing ${agentName}...`);
                agentToExecute = this.subagents[agentName];
            } else {
                console.log(`\nCode review failed for ${agentName}. Attempting to generate a new agent.`);
                agentName = null; // Clear agent name to trigger generation
            }
        }

        if (!agentToExecute) {
            if (agentName) {
                 console.log(`\nNo suitable agent found. Attempting to generate a new one.`);
            }
            const newAgentName = await this.generateSubagent(task, signal);
            if (newAgentName && this.subagents[newAgentName]) {
                agentToExecute = this.subagents[newAgentName];
                agentName = newAgentName;
            } else {
                return "Failed to find or create a suitable agent for your task.";
            }
        }

        console.log(`\nExecuting task with ${agentName}...`);
        return agentToExecute.execute(task, chatHistory, signal);
    }
}

module.exports = DiscoveryAgent;