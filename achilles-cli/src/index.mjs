#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { Writable } from 'node:stream';
import { fileURLToPath } from 'node:url';
import { realpathSync } from 'node:fs';
import { MainAgent, discoverSkillsFromRoot } from 'achillesAgentLib/MainAgent';
import { LLMAgent } from 'achillesAgentLib/LLMAgents';
import { IOServices } from 'achillesAgentLib';
import { HistoryManager } from './repl/HistoryManager.mjs';
import { CommandSelector, showCommandSelector, showSkillSelector, buildCommandList } from './ui/CommandSelector.mjs';
import { SlashCommandHandler } from './repl/SlashCommandHandler.mjs';
import { REPLSession } from './repl/REPLSession.mjs';
import { summarizeResult, formatSlashResult } from './ui/ResultFormatter.mjs';
import { printHelp as printREPLHelp, showHistory, searchHistory } from './ui/HelpPrinter.mjs';
import { UIContext } from './ui/UIContext.mjs';
import { createProvider, getProviderNames } from './ui/providers/index.mjs';
import { BUILT_IN_SKILLS } from './lib/constants.mjs';
import { buildOrchestratorSystemPrompt } from './prompts/orchestrator-prompt.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to built-in skills bundled with this module
const builtInSkillsDir = path.join(__dirname, 'skills');

// Path to bash command skills (bundled with this repo)
const bashSkillsDir = path.join(__dirname, '../../bash-skills/skills');

// Re-export classes and functions for library usage
export {
    // Core agent (from achillesAgentLib)
    MainAgent,
    LLMAgent,
    // REPL components
    REPLSession,
    SlashCommandHandler,
    // UI components
    CommandSelector,
    showCommandSelector,
    showSkillSelector,
    buildCommandList,
    // History
    HistoryManager,
    // Repository management
    // Utilities
    summarizeResult,
    formatSlashResult,
    printREPLHelp,
    showHistory,
    searchHistory,
    // Constants
    builtInSkillsDir,
    BUILT_IN_SKILLS,
};

// CLI entry point when run directly
async function main() {
    const args = process.argv.slice(2);

    // Parse options
    let workingDir = process.cwd();
    let prompt = null;
    let verbose = false;
    let debug = false;
    let mode = 'deep';
    let renderMarkdown = true;
    let uiStyle = process.env.ACHILLES_CLI_UI || 'claude-code'; // Default UI style
    let skipBashPermissions = false; // Skip bash command permission prompts
    const cliSkillRoots = []; // Skill roots from --skill-root flags

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--dir' || arg === '-d') {
            workingDir = path.resolve(args[i + 1] || process.cwd());
            i += 1;
        } else if (arg === '--skill-root' || arg === '-r') {
            const rootPath = args[i + 1];
            if (rootPath && !rootPath.startsWith('-')) {
                cliSkillRoots.push(path.resolve(rootPath));
                i += 1;
            }
        } else if (arg.startsWith('--skill-root=')) {
            const rootPath = arg.split('=')[1];
            if (rootPath) {
                cliSkillRoots.push(path.resolve(rootPath));
            }
        } else if (arg === '--help' || arg === '-h') {
            printHelp();
            process.exit(0);
        } else if (arg === '--verbose' || arg === '-v') {
            verbose = true;
        } else if (arg === '--debug') {
            debug = true;
        } else if (arg === '--fast') {
            mode = 'fast';
        } else if (arg === '--deep') {
            mode = 'deep';
        } else if (arg === '--no-markdown' || arg === '--raw') {
            renderMarkdown = false;
        } else if (arg === '--ui-minimal') {
            uiStyle = 'minimal';
        } else if (arg === '--ui-claude-code') {
            uiStyle = 'claude-code';
        } else if (arg === '--ui' || arg === '--ui-style') {
            uiStyle = args[i + 1] || 'claude-code';
            i += 1;
        } else if (arg.startsWith('--ui=') || arg.startsWith('--ui-style=')) {
            uiStyle = arg.split('=')[1] || 'claude-code';
        } else if (arg === '--version') {
            console.log('achilles-cli v3.0.0');
            process.exit(0);
        } else if (arg === '--skip-permissions') {
            skipBashPermissions = true;
        } else if (!arg.startsWith('-')) {
            // Collect remaining args as the prompt
            prompt = args.slice(i).join(' ');
            break;
        }
    }

    // Configure logger based on verbose flag
    const noop = () => {};
    const achillesDebug = /^(1|true|yes|on)$/i.test(process.env.ACHILLES_DEBUG || '');
    const debugLog = achillesDebug ? (msg) => console.log(`[DEBUG] ${msg}`) : noop;
    const infoLog = verbose ? (msg) => console.log(`[INFO] ${msg}`) : noop;
    const logger = {
        debug: debugLog,
        info: infoLog,
        log: infoLog,
        warn: (msg) => console.warn(`[WARN] ${msg}`),
        error: (msg) => console.error(`[ERROR] ${msg}`),
    };

    // User skills directory (do not create automatically)
    const skillsDir = path.join(workingDir, 'skills');

    const nodeModulesSkillRoots = collectNodeModulesSkillRoots(__dirname, logger);
    const webchatRuntime = !prompt && isWebchatRuntime();

    // Merge all skill roots: built-in + bash-skills + CLI flags + node_modules skills
    const allSkillRoots = [
        { path: builtInSkillsDir, isInternal: true },
        // Add bash-skills if the directory exists
        ...(fs.existsSync(bashSkillsDir) ? [{ path: bashSkillsDir, isInternal: true }] : []),
        ...cliSkillRoots.map((skillRoot) => ({ path: skillRoot, isInternal: false })),
        ...nodeModulesSkillRoots.map((skillRoot) => ({ path: skillRoot, isInternal: false })),
    ];

    if (verbose && (cliSkillRoots.length > 0 || nodeModulesSkillRoots.length > 0)) {
        logger.log(`Additional skill roots: ${[...cliSkillRoots, ...nodeModulesSkillRoots].join(', ')}`);
    }

    // Initialize MainAgent with all skill roots
    const agent = new MainAgent({
        startDir: workingDir,
        llmAgentOptions: {
            name: 'achilles-cli-agent',
        },
        logger,
    });

    registerSkillRoots(agent, allSkillRoots, logger);

    // Set up I/O (LLMAgent API fallback to global IOServices)
    const inputReader = createCliInputReader();
    const outputWriter = webchatRuntime
        ? createSilentOutputWriter()
        : createCliOutputWriter();
    if (typeof agent.llmAgent?.setInputReader === 'function') {
        agent.llmAgent.setInputReader(inputReader);
    } else {
        IOServices.setInputReader(inputReader);
    }
    if (typeof agent.llmAgent?.setOutputWriter === 'function') {
        agent.llmAgent.setOutputWriter(outputWriter);
    } else {
        IOServices.setOutputWriter(outputWriter);
    }

    // Initialize UI provider based on selected style
    try {
        const uiProvider = createProvider(uiStyle);
        UIContext.setProvider(uiProvider);
        if (verbose) {
            logger.log(`UI style: ${uiStyle}`);
        }
    } catch (error) {
        console.error(`Error: Invalid UI style '${uiStyle}'. Available: ${getProviderNames().join(', ')}`);
        process.exit(1);
    }

    if (prompt) {
        // Single-shot mode: execute prompt and exit
        try {
            if (verbose) {
                console.log(`Processing: "${prompt}"\n`);
            }
            // Create context for skill execution
            const context = {
                workingDir,
                skillsDir,
                skilledAgent: agent,
                llmAgent: agent.llmAgent,
                logger,
                skipBashPermissions,
            };

            let result = await agent.executePrompt(prompt, {
                context,
                mode,
                systemPrompt: buildOrchestratorSystemPrompt(),
            });

            // Format result
            if (typeof result === 'string') {
                try {
                    const parsed = JSON.parse(result);
                    if (parsed && (parsed.executions || parsed.type === 'orchestrator')) {
                        result = debug ? JSON.stringify(parsed, null, 2) : summarizeResult(parsed);
                    }
                } catch {
                    // Not JSON, use as-is
                }
            } else if (!debug) {
                result = summarizeResult(result);
            } else {
                result = JSON.stringify(result, null, 2);
            }

            console.log(result);
        } catch (error) {
            console.error('Error:', error.message);
            if (verbose) {
                console.error(error.stack);
            }
            process.exit(1);
        }
    } else if (webchatRuntime) {
        // Webchat mode: simple stdin → process → stdout loop (no REPL, no banner, no prompt)
        await runWebchatInteractive(agent, {
            workingDir,
            skillsDir,
            skipBashPermissions,
            debug,
            renderMarkdown,
        });
    } else {
        // REPL mode
        const session = new REPLSession(agent, {
            workingDir,
            skillsDir,
            builtInSkillsDir,
            debug,
            renderMarkdown,
            skipBashPermissions,
        });
        await session.start();
    }
}

function isWebchatRuntime() {
    if (hasSsoEnvironment()) {
        return true;
    }
    return process.argv.some((arg) => typeof arg === 'string' && (
        arg.startsWith('--sso-user=')
        || arg.startsWith('--sso-user-id=')
        || arg.startsWith('--sso-email=')
        || arg.startsWith('--sso-roles=')
        || arg.startsWith('--sso-session-id=')
    ));
}

function hasSsoEnvironment() {
    return [
        'SSO_USER',
        'SSO_USER_ID',
        'SSO_EMAIL',
        'SSO_ROLES',
        'SSO_SESSION_ID',
    ].some((key) => {
        const value = process.env[key];
        return typeof value === 'string' && value.trim().length > 0;
    });
}

async function runWebchatInteractive(agent, options) {
    const { workingDir, skillsDir, skipBashPermissions, debug, renderMarkdown } = options;

    const rlOutput = new Writable({ write(_chunk, _encoding, callback) { callback(); } });
    const rl = readline.createInterface({
        input: process.stdin,
        output: rlOutput,
        terminal: false,
    });

    let isClosing = false;
    let pendingLines = [];
    let flushTimer = null;
    let processingChain = Promise.resolve();

    const flushPendingLines = () => {
        if (flushTimer) {
            clearTimeout(flushTimer);
            flushTimer = null;
        }
        if (pendingLines.length === 0) {
            return;
        }

        const message = pendingLines.join('\n').trim();
        pendingLines = [];

        if (!message) {
            return;
        }
        if (message === 'exit' || message === 'quit' || message === ':q') {
            isClosing = true;
            rl.close();
            return;
        }

        processingChain = processingChain.then(async () => {
            try {
                const context = {
                    workingDir,
                    skillsDir,
                    skilledAgent: agent,
                    llmAgent: agent.llmAgent,
                    skipBashPermissions,
                };

                let result = await agent.executePrompt(message, {
                    context,
                    systemPrompt: buildOrchestratorSystemPrompt(),
                });

                if (typeof result === 'string') {
                    try {
                        const parsed = JSON.parse(result);
                        if (parsed && (parsed.executions || parsed.type === 'orchestrator')) {
                            result = debug ? JSON.stringify(parsed, null, 2) : summarizeResult(parsed);
                        }
                    } catch {
                        // Not JSON, use as-is
                    }
                } else if (!debug) {
                    result = summarizeResult(result);
                } else {
                    result = JSON.stringify(result, null, 2);
                }

                process.stdout.write(`${result}\n`);
            } catch (error) {
                process.stdout.write(`[error] ${error.message}\n`);
            }
        });
    };

    const scheduleFlush = () => {
        if (flushTimer) {
            clearTimeout(flushTimer);
        }
        flushTimer = setTimeout(() => {
            flushPendingLines();
        }, 150);
    };

    rl.on('line', (line) => {
        pendingLines.push(line);
        scheduleFlush();
    });

    rl.on('close', () => {
        isClosing = true;
        flushPendingLines();
    });

    await new Promise((resolve) => rl.once('close', resolve));
    await processingChain;
}

function createCliInputReader() {
    return {
        read: async (prompt = '> ') => {
            if (!process.stdin.isTTY) {
                throw new Error('Interactive input requested but stdin is not a TTY.');
            }

            return new Promise((resolve) => {
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout,
                });

                let done = false;
                const finalize = (answer = '') => {
                    if (done) return;
                    done = true;
                    rl.close();
                    resolve(answer);
                };

                rl.on('SIGINT', () => finalize(''));
                rl.question(prompt, (answer) => finalize(answer));
            });
        },
    };
}

function createCliOutputWriter() {
    return {
        write: async (message) => {
            if (message === null || message === undefined) {
                return;
            }
            const text = typeof message === 'string'
                ? message
                : JSON.stringify(message, null, 2);
            console.log(text);
        },
    };
}

function createSilentOutputWriter() {
    return {
        write: async () => {},
        writeError: async () => {},
    };
}

function printHelp() {
    console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║                         Achilles CLI v3.0                            ║
║        Manage, generate, and test skill definition files              ║
╚══════════════════════════════════════════════════════════════════════╝

USAGE:
  achilles-cli [options] [prompt]

OPTIONS:
  -d, --dir <path>       Working directory containing skills (default: cwd)
  -r, --skill-root <path>  Add additional skill root (can be used multiple times)
  -v, --verbose          Enable verbose logging
  --debug                Show full JSON output (orchestrator plans, executions)
  --fast                 Use fast LLM mode (cheaper, quicker)
  --deep                 Use deep LLM mode (default, more capable)
  --no-markdown          Disable markdown rendering in output (use /raw to toggle)
  --skip-permissions     Skip bash command permission prompts (use with caution)
  --ui <style>           UI style: claude-code (default), minimal
  --ui-minimal           Use minimal UI (no colors, simple prompts)
  --ui-claude-code       Use Claude Code style UI (boxed input, animations)
  -h, --help             Show this help message
  --version              Show version

MODES:
  REPL Mode          Run without a prompt to enter interactive mode
  Single-shot Mode   Pass a prompt as arguments to execute and exit

HISTORY:
  Command history is stored per working directory in .achilles-cli-history
  Use ↑/↓ arrows to navigate history, "history" command to view/search

BUILT-IN SKILLS:
  list-skills        List all registered skills
  read-skill         Read a skill definition file
  write-skill        Create or update a skill file
  delete-skill       Remove a skill directory
  validate-skill     Validate skill against schema
  get-template       Get blank template for skill type
  update-section     Update a specific section
  preview-changes    Show diff before applying
  generate-code      Generate .mjs from tskill
  test-code          Test generated code
  skill-refiner      Iterative improvement loop

SKILL TYPES:
  tskill   Database table (fields, validators, presenters)
  cskill   Code skill (LLM-generated code execution)
  cgskill  Code generation (text/code or module)
  oskill   Orchestrator (routes to other skills)
  mskill   MCP tool integration

EXTERNAL SKILLS:
  Skills can be installed via npm and discovered in node_modules.

  You can also add session-only skill roots:
    achilles-cli -r /path/to/skills -r /another/path

EXAMPLES:
  # Start interactive REPL
  achilles-cli
  achilles-cli --dir /path/to/project

  # Single-shot commands
  achilles-cli "list all skills"
  achilles-cli "read the equipment skill"
  achilles-cli "create a tskill called inventory for tracking stock"
  achilles-cli "validate the area skill"
  achilles-cli "generate code for equipment"
  achilles-cli "test the generated code for equipment"
  achilles-cli "refine equipment until all tests pass"
  achilles-cli --fast "list skills"

  # With additional skill roots
  achilles-cli -r ~/shared-skills "list all skills"

ENVIRONMENT:
  ANTHROPIC_API_KEY    API key for Claude (required)
  OPENAI_API_KEY       Alternative: API key for OpenAI
  ACHILLES_CLI_UI     Default UI style (claude-code, minimal)

For more information, see the README.md in the AchillesCliAgent directory.
`);
}

/**
 * Check if this module is being run directly (cross-platform safe)
 */
function isRunDirectly() {
    try {
        const scriptPath = realpathSync(process.argv[1]);
        const modulePath = realpathSync(fileURLToPath(import.meta.url));
        return scriptPath === modulePath;
    } catch {
        // Fallback for edge cases
        return import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'));
    }
}

function collectNodeModulesSkillRoots(baseDir, logger) {
    const nodeModulesDir = path.join(baseDir, '..', 'node_modules');
    if (!fs.existsSync(nodeModulesDir)) {
        return [];
    }

    let entries = [];
    try {
        entries = fs.readdirSync(nodeModulesDir, { withFileTypes: true });
    } catch (error) {
        logger?.warn?.(`Failed to read node_modules: ${error.message}`);
        return [];
    }

    const roots = [];
    for (const entry of entries) {
        if (!entry.isDirectory()) {
            continue;
        }
        if (entry.name.startsWith('@')) {
            continue;
        }

        const packageDir = path.join(nodeModulesDir, entry.name);
        const skillRoots = [
            path.join(packageDir, 'skills'),
            path.join(packageDir, 'src', 'skills'),
        ];
        for (const skillRoot of skillRoots) {
            if (fs.existsSync(skillRoot)) {
                roots.push(skillRoot);
            }
        }
    }

    return roots;
}

function registerSkillRoots(agent, skillRoots, logger) {
    if (!agent || !Array.isArray(skillRoots) || skillRoots.length === 0) {
        return;
    }

    const seen = new Set();
    for (const root of skillRoots) {
        const skillRoot = root?.path;
        if (!skillRoot || seen.has(skillRoot)) {
            continue;
        }
        seen.add(skillRoot);

        if (!fs.existsSync(skillRoot)) {
            continue;
        }

        let discovered = [];
        try {
            discovered = discoverSkillsFromRoot(skillRoot, { logger });
        } catch (error) {
            logger?.warn?.(`Failed to discover skills from ${skillRoot}: ${error.message}`);
            continue;
        }

        for (const skillRecord of discovered) {
            skillRecord.isInternal = Boolean(root.isInternal);
            agent._registerSkill(skillRecord);
        }
    }
}

// Run if executed directly
if (isRunDirectly()) {
    main().catch((error) => {
        console.error('Fatal error:', error.message);
        process.exit(1);
    });
}
