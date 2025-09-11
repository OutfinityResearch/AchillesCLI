const { callLLM } = require('../LLMClient.js');

/**
 * A general-purpose agent for conversational tasks and answering questions.
 * It uses the LLM to generate responses without executing any code or using tools.
 */
class GenericAgent {
    constructor() {
        this.name = 'GenericAgent';
    }

    /**
     * Executes a general conversational task by calling the LLM.
     * @param {string} task The user's input/task.
     * @param {Array<object>} chatHistory The full conversation history.
     * @param {AbortSignal} signal The signal to abort the LLM call.
     * @returns {Promise<string>} The LLM's response.
     */
    async execute(task, chatHistory, signal) {
        // The chatHistory already contains the latest user prompt.
        // We can add a system prompt to guide the LLM's behavior for this specific agent.
        const systemPrompt = {
            role: 'system',
            message: 'You are a helpful general-purpose AI assistant. The user is asking a general question. Answer them directly and concisely.'
        };

        return await callLLM([systemPrompt, ...chatHistory], signal);
    }
}

module.exports = GenericAgent;