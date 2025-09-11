const fs = require('fs/promises');
const path = require('path');
const { callLLM } = require("./LLMClient.js");

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
    async routeToAgent(task, signal) {
        if (Object.keys(this.subagentSpecs).length === 0) {
            console.log("No subagents found to route to.");
            return null;
        }

        const agentDescriptions = Object.entries(this.subagentSpecs)
            .map(([name, spec]) => `- ${name}: ${spec}`)
            .join('\n');

        const systemPrompt = `You are an expert coordinator agent. Your job is to analyze the user's request and select the *most suitable* specialized subagent from the list below. Your selection must be based *solely* on the subagent's natural language description (specification).
Here are the available subagents:
${agentDescriptions}

Respond with a JSON object containing one key:
- "agent": The name of the most suitable agent. If no agent is suitable based on its description, set this to null.

Example for a suitable agent: {"agent": "GitAgent"}
Example for no suitable agent: {"agent": null}`;

        const routingHistory = [
            { role: 'system', message: systemPrompt },
            { role: 'human', message: `User request: "${task}"` }
        ];

        const responseJson = await callLLM(routingHistory, signal);
        console.log(`LLM Routing Response: ${responseJson}`); // For debugging and transparency
        try {
            const choice = JSON.parse(responseJson);
            return choice.agent; // This can be null if no agent was found
        } catch (e) {
            console.log(`Error: Could not parse routing response from LLM.`);
            return null;
        }
    }

    /**
     * Generates a new subagent using the LLM.
     * @param {string} task The user's task description.
     * @param {AbortSignal} signal The signal to abort the LLM call.
     * @returns {Promise<string|null>} The name of the newly generated agent, or null on failure.
     */
    async generateSubagent(task, signal) {
        const topicPrompt = `You are a topic analysis expert. Your job is to analyze the user's task and identify the main technical topic or domain it relates to.
 Respond with ONLY a VALID JSON object with a single key "topic". The topic should be a single, concise word in PascalCase (e.g., "FileSystem", "Git", "Docker", "HttpRequest").
 User Task: "${task}"`;
        const topicResponseJson = await callLLM([{ role: 'system', message: topicPrompt }], signal);
        let topic;
        try {
            const topicResponse = JSON.parse(topicResponseJson);
            if (topicResponse.topic) {
                topic = topicResponse.topic;
                console.log(`Topic identified: ${topic}`);
            }
        } catch (e) {
            console.warn(`Could not determine a specific topic.`);
            return null;
        }

        console.log(`\nGenerating a new subagent for task: "${task}"`);
        // In a real implementation, this would be a much more sophisticated prompt.
        const systemPrompt = `You are a JavaScript code generation expert. Based on this topic: ${topic}, create a new subagent.
The subagent code must follow the following template:

'''
const { callLLM } = require('../LLMClient.js');

/**
 * A general-purpose agent for conversational tasks and answering questions.
 * It uses the LLM to generate responses without executing any code or using tools.
 */
class GenericAgent {
    constructor() {
        this.name = 'GenericAgent';
    }
    async execute(task, chatHistory, signal) {
        // The chatHistory already contains the latest user prompt.
        // We can add a system prompt to guide the LLM's behavior for this specific agent.
        const systemPrompt = {
            role: 'system',
            message: 'You are a helpful general-purpose AI assistant.'
        };

        return await callLLM([systemPrompt, ...chatHistory], signal);
    }
}

module.exports = GenericAgent;
'''

Respond with ONLY a JSON object with three keys: "agentName", "agentCode", and "agentSpec".
'agentName' should be a concise PascalCase name for the agent.
'agentCode' should be the full JavaScript code for the agent class.
'agentSpec' should be a natural language description of what the agent does.

User Task: "${task}"`;

        const responseJson = await callLLM([{ role: 'system', message: systemPrompt }], signal);
        try {
            const { agentName, agentCode, agentSpec } = JSON.parse(responseJson);

            const agentPath = path.join(SUBAGENT_DIR, `${agentName}.js`);
            const specDirPath = path.join(SPECS_DIR, 'subagents');
            const specPath = path.join(specDirPath, `${agentName}.js.specs`);

            // Ensure the spec directory exists before writing the file
            await fs.mkdir(specDirPath, { recursive: true });
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

        if (agentName === null) {
            console.log(`\nRouter determined no existing subagent is suitable. Attempting to generate a new one.`);
        } else if (this.subagents[agentName]) { // Check if the suggested agent actually exists
            console.log(`\nFound suitable agent: ${agentName}.`);
            agentToExecute = this.subagents[agentName];
        }
        // If agentName was not null but this.subagents[agentName] was false,
        // it means the LLM suggested an agent name that doesn't exist.
        else {
            console.log(`\nRouter suggested unknown agent '${agentName}'. Attempting to generate a new one.`);
            agentName = null; // Treat as if no agent was found
        }

        if (!agentToExecute) {
            const newAgentName = await this.generateSubagent(task, signal);
            if (newAgentName && this.subagents[newAgentName]) {
                agentToExecute = this.subagents[newAgentName];
                agentName = newAgentName;
            } else {
                console.log("\nFailed to find or create a suitable agent for your task. using GenericAgent instead.");
                agentName = "GenericAgent";
                agentToExecute = this.subagents[agentName];
            }
        }

        console.log(`\nExecuting task with ${agentName}...`);
        return agentToExecute.execute(task, chatHistory, signal);
    }
}

module.exports = DiscoveryAgent;