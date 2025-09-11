const { callLLM } = require("./LLMClient.js");

// Import subagent classes
const GitAgent = require('./subagents/GitAgent.js');
const NodeAgent = require('./subagents/NodeAgent.js');
const GeneralAgent = require('./subagents/GeneralAgent.js');
const PlanningAgent = require('./PlanningAgent.js');

class Coordinator {
    constructor() {
        // In a real application, you might pass a logger instance here
        this.subagents = {
            GitAgent: new GitAgent(),
            NodeAgent: new NodeAgent(),
            GeneralAgent: new GeneralAgent(),
        };
        // The PlanningAgent has access to the subagents to inform its planning
        this.planningAgent = new PlanningAgent(this.subagents);
    }

    /**
     * Analyzes the user's prompt and routes it to the most appropriate subagent.
     * @param {string} prompt The user's input.
     * @param {AbortSignal} signal The signal to abort the LLM call.
     * @returns {Promise<{agent: object, agentName: string}>} The chosen agent instance and its name.
     */
    async routeToAgent(prompt, signal) {
        const agentDescriptions = Object.values(this.subagents)
            .map(agent => `- ${agent.name}: ${agent.description}`)
            .join('\n');

        const systemPrompt = `You are an expert coordinator agent. Your job is to route user requests to the correct specialized subagent.
Here are the available subagents:
${agentDescriptions}

Based on the user's request, respond with ONLY the name of the most appropriate agent in a JSON format.
Example: {"agent": "GitAgent"}`;

        const routingHistory = [
            { role: 'system', message: systemPrompt },
            { role: 'human', message: `User request: "${prompt}"` }
        ];

        const responseJson = await callLLM(routingHistory, signal);
        let choice;
        try {
            choice = JSON.parse(responseJson);
        } catch (e) {
            console.log(`Error: Could not parse routing response from LLM.`);
            throw new Error("Failed to parse agent routing response.");
        }

        const agentName = choice.agent;
        const agent = this.subagents[agentName];

        if (!agent) {
            console.log(`Error: LLM chose an unknown agent: ${agentName}. Defaulting to GeneralAgent.`);
            return { agent: this.subagents.GeneralAgent, agentName: 'GeneralAgent' };
        }

        return { agent, agentName };
    }

    /**
     * Determines if a task is simple (single-step) or complex (multi-step).
     * @param {string} prompt The user's input.
     * @param {AbortSignal} signal The signal to abort the LLM call.
     * @returns {Promise<boolean>} True if the task is complex and requires planning.
     */
    async needsPlanning(prompt, signal) {
        const systemPrompt = `You are a task complexity analyzer. Your job is to determine if a user's request can be solved in a single step or if it requires multiple steps.
Respond with ONLY a JSON object with a single key "requires_planning" and a boolean value.

Example for a simple task: {"requires_planning": false}
Example for a complex task: {"requires_planning": true}

User request: "${prompt}"`;

        const responseJson = await callLLM([{ role: 'system', message: systemPrompt }], signal);
        try {
            const result = JSON.parse(responseJson);
            return result.requires_planning === true;
        } catch (e) {
            console.log(`Warning: Could not determine task complexity. Assuming simple task.`);
            return false; // Default to simple execution on failure
        }
    }

    /**
     * Main orchestration logic. It routes the request and executes the chosen agent.
     * @param {string} prompt The user's input.
     * @param {Array<object>} chatHistory The full conversation history.
     * @param {AbortSignal} signal The signal to abort the LLM call.
     * @returns {Promise<string>} The final response from the executed subagent.
     */
    async orchestrate(prompt, chatHistory, signal) {
        const isComplex = await this.needsPlanning(prompt, signal);

        if (!isComplex) {
            // --- Simple Task Execution ---
            console.log(`\nExecuting simple task...`);
            const { agent, agentName } = await this.routeToAgent(prompt, signal);
            console.log(`\nRouting to: ${agentName}...`);
            return agent.execute(prompt, chatHistory, signal);
        } else {
            // --- Complex Task Execution with Planning ---
            console.log(`\nComplex task detected. Creating a plan...`);
            let plan = await this.planningAgent.createPlan(prompt, signal);

            if (!plan || plan.length === 0) {
                return `The planning agent could not create a plan for this task.`;
            }

            console.log(`\nPlan Created:`);
            plan.forEach(step => console.log(`  Step ${step.step}: ${step.task}`));

            for (let i = 0; i < plan.length; i++) {
                const step = plan[i];
                console.log(`\nExecuting Step ${step.step}: ${step.task}...`);

                try {
                    const { agent, agentName } = await this.routeToAgent(step.task, signal);
                    console.log(`\nRouting to: ${agentName}...`);
                    const stepResult = await agent.execute(step.task, chatHistory, signal);
                    console.log(`\nStep ${step.step} completed.`);
                    // Add step result to history for context in subsequent steps
                    chatHistory.push({ role: 'system', message: `Result of step ${step.step}: ${stepResult}` });
                } catch (error) {
                    console.log(`\nStep ${step.step} failed: ${error.message}`);
                    console.log(`\nAttempting to adjust the plan...`);

                    const newPlan = await this.planningAgent.adjustPlan(plan, step, error.message, signal);
                    if (!newPlan || newPlan.length === 0) {
                        return `The planning agent could not recover from the failure. Aborting task.`;
                    }

                    console.log(`\nPlan Adjusted:`);
                    newPlan.forEach(s => console.log(`  Step ${s.step}: ${s.task}`));

                    plan = newPlan;
                    i = -1; // Reset loop to start from the beginning of the new plan
                }
            }

            return `All steps completed successfully.`;
        }
    }
}

module.exports = Coordinator;