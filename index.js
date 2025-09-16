const readline = require('readline');
const os = require('os');
const RouterAgent = require('./RouterAgent.js');
const { cancelRequests } = require('./LLMClient.js');
const {
    theme,
    displayIntro,
    startThinkingAnimation,
    stopThinkingAnimation,
    stripAnsi,
} = require('./AgentUtil.js');

// Check for required environment variables
const requiredEnv = ['LLM_API_KEY'];
const missingEnv = requiredEnv.filter(v => !process.env[v]);

if (missingEnv.length > 0) {
    console.error(`${theme.error}Error: Missing required environment variables: ${missingEnv.join(', ')}${theme.reset}`);
    console.error(`Please set them in your environment or in the run.sh script.`);
    process.exit(1);
}

// The persistoClient is part of the agent's dependencies.
// For now, we'll pass null as a placeholder.
const persistoClient = null;
const agent = new RouterAgent(persistoClient);

const chatState = {
    isGenerating: false,
    justHandledCommand: false, // Flag to prevent 'enter' leak from menus
};

/**
 * Displays a status line with the current working directory and LLM config.
 */
function displayStatusLine() {
    const terminalWidth = process.stdout.columns || 80;
    let cwd = process.cwd();
    const homeDir = os.homedir();
    if (cwd.startsWith(homeDir)) {
        cwd = '~' + cwd.substring(homeDir.length);
    }
    const leftText = ` ${theme.secondary}${cwd}${theme.reset}`;
    const rightText = `${theme.secondary}${process.env.LLM_PROVIDER} | ${process.env.LLM_MODEL}${theme.reset} `;
    const spaceCount = Math.max(0, terminalWidth - stripAnsi(leftText).length - stripAnsi(rightText).length);
    const statusLine = `${leftText}${' '.repeat(spaceCount)}${rightText}`;
    console.log(statusLine);
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

/**
 * Sets up global event listeners for keypresses and process exit.
 */
function setupEventListeners() {
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
    }

    process.stdin.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'c') {
            process.exit();
        }
        if (chatState.isGenerating && key.name === 'escape') {
            cancelRequests();
        }
    });

    rl.on('close', () => process.exit(0));

    process.on('exit', () => {
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(false);
        }
        console.log('\nExiting AchillesCLI. Goodbye!');
    });
}

/**
 * The main chat loop.
 */
async function startChat() {
    displayStatusLine();
    rl.question('> ', async (userInput) => {
        if (userInput.toLowerCase() === 'exit') {
            rl.close();
            return;
        }

        chatState.isGenerating = true;
        startThinkingAnimation('Thinking...');

        try {
            const aiResponse = await agent.handleTask(userInput);

            if (aiResponse === undefined) { // Cancelled
                console.log('\nGeneration stopped.');
            } else if (aiResponse) {
                console.log(`\n${theme.primary}${aiResponse}${theme.reset}\n`);
            }
        } catch (error) {
            console.error(`\n${theme.error}An error occurred: ${error.message}${theme.reset}\n`);
        } finally {
            chatState.isGenerating = false;
            stopThinkingAnimation();
        }

        startChat(); // Continue the conversation
    });
}

/**
 * Main application entry point.
 */
async function main() {
    setupEventListeners();
    displayIntro();
    await agent.initialize(); // Initialize the RouterAgent (loads subagents, etc.)
    startChat();
}

main();