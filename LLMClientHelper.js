const { callLLM } = require('./LLMClient.js');

/**
 * Retries an LLM call that is expected to return JSON. This is called after an initial attempt has failed.
 * @param {Array<object>} history The conversation history (without the last user prompt).
 * @param {string} prompt The last user prompt.
 * @param {Error} initialError The error from the first attempt.
 * @param {number} maxRetries The maximum number of retry attempts.
 * @returns {Promise<object>} The parsed JSON object from the LLM's response.
 * @throws {Error} If all retry attempts fail.
 */
async function retryLLMForJson(history, prompt, initialError, maxRetries = 2) {
    // Check if the initial error is due to request abortion (ESC pressed)
    if (initialError.name === 'AbortError' || initialError.message.includes('aborted')) {
        console.log('Request was aborted by user. Cancelling retries.');
        throw initialError; // Don't retry if the request was intentionally aborted
    }

    let lastError = null;
    // Create a mutable copy of the context for the retry attempts
    const retryHistory = [...history];
    // Add the initial error to the context for the first retry
    retryHistory.push({ role: 'system', message: `Your previous response was not valid JSON. Please correct it. The error was: ${initialError.message}` });

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Retrying... (Attempt ${attempt}/${maxRetries})`);
            const responseText = await callLLM(retryHistory, prompt);
            return JSON.parse(responseText); // Success!
        } catch (error) {
            lastError = error;

            // Check if this retry attempt was aborted (ESC pressed during retry)
            if (error.name === 'AbortError' || error.message.includes('aborted')) {
                console.log('Request was aborted by user during retry. Cancelling remaining retries.');
                throw error; // Stop retrying if the request was intentionally aborted
            }

            console.warn(`Retry attempt ${attempt} failed: ${error.message}`);

            if (attempt < maxRetries) {
                // Add a correction message for the subsequent retry attempt.
                retryHistory.push({ role: 'system', message: `Your response was still not valid JSON. Please try again. The error was: ${error.message}` });
            }
        }
    }

    throw new Error(`Failed to get valid JSON after ${maxRetries + 1} total attempts. Last error: ${lastError.message}`);
}

module.exports = { retryLLMForJson };