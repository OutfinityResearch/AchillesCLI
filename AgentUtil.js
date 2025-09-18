const fs = require('fs/promises');
const path = require('path');

const theme = {
    reset: "\x1b[0m",
    secondary: "\x1b[90m", // gray
    text: "\x1b[37m",      // white
    primary: "\x1b[94m",   // light blue
    warning: "\x1b[33m",   // yellow
    success: "\x1b[32m",   // green
    error: "\x1b[31m",     // red
};

// Constants for file reading animation
const BOX_CHARS = {
    TL: '╭', TR: '╮', BL: '╰', BR: '╯', H: '─', V: '│'
};

let animationInterval = null;
let startTime = null;

/**
 * Displays a console loading indicator with a cancel hint.
 * @param {string} text The text to display.
 */
function startThinkingAnimation(text = 'Thinking...') {
    const frames = ['.  ', '.. ', '...'];
    let frameIndex = 0;
    const hintMessage = `${theme.secondary}(Press Esc to cancel)${theme.reset}`;
    startTime = Date.now();

    // Start the animation interval
    animationInterval = setInterval(() => {
        frameIndex = (frameIndex + 1) % frames.length;
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const thinkingText = `${theme.warning}${text}${frames[frameIndex]} (${elapsed}s)${theme.reset}`;
        process.stdout.write(`\x1b[2K\x1b[0G${thinkingText}  ${hintMessage}`);
    }, 300);
}

/**
 * Hides the console loading indicator.
 */
function stopThinkingAnimation() {
    if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
        process.stdout.write(`\x1b[2K\x1b[0G`); // Clear the line
    }
}

/**
 * Strips ANSI escape codes from a string to get its visible length.
 * @param {string} str The string to strip.
 * @returns {string} The string without ANSI codes.
 */
const stripAnsi = (str) => str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');

/**
 * Displays the application intro screen in the console.
 */
const displayIntro = (log) => {
    const achillesArt = [
// Hidden Lines
        '|_|   |______\\____/|___||_| \\_||_|\\_\\ /_/'
    ];

    console.log(`${theme.primary}${achillesArt.join('\n')}${theme.reset}`);
    console.log('');
    console.log(`Welcome to AchillesCLI, your AI-powered command-line assistant.`);
    console.log('');
};
/**
 * Simple template renderer
 * Replaces ${varName} placeholders in a string with provided values.
 *
 * @param {string} promptTemplate - The template string containing placeholders.
 * @param {object} data - Key-value pairs for replacement.
 * @returns {string} - The rendered string.
 */
function constructPrompt(promptTemplate, data = {}) {
    return promptTemplate.replace(/\$\$(\w+)/g, (_, key) => {
        return key in data ? data[key] : "";
    });
}

/**
 * Receives a plan and creates the specified files and directories.
 * @param {object} plan The project plan object.
 * @returns {Promise<string>} A status message indicating success or failure.
 */
async function createFiles(plan) {
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

module.exports = {
    displayIntro,
    startThinkingAnimation,
    stopThinkingAnimation,
    theme,
    BOX_CHARS,
    stripAnsi,
    constructPrompt,
    createFiles
};