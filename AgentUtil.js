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
module.exports = {
    displayIntro,
    startThinkingAnimation,
    stopThinkingAnimation,
    theme,
    BOX_CHARS,
    stripAnsi,
    constructPrompt
};