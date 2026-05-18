/**
 * Unified bash command skill - executes any command with tiered permissions
 */
import { parseCommandLine } from './parser.mjs';
import { classifyRisk, RISK_LEVELS } from './riskClassifier.mjs';
import { executeWithTieredPermission } from './permissions.mjs';
import { expandGlobsInArgs } from './globExpander.mjs';

function parsePrompt(prompt) {
    if (typeof prompt !== 'string') {
        return prompt?.command || '';
    }
    const trimmed = prompt.trim();
    if (!trimmed) {
        return '';
    }
    try {
        const parsed = JSON.parse(trimmed);
        if (parsed && typeof parsed === 'object' && typeof parsed.command === 'string') {
            return parsed.command;
        }
    } catch {
        // Plain command text.
    }
    return prompt;
}

export async function action(invocation = {}) {
    const prompt = parsePrompt(invocation.promptText);
    // Parse the command line
    const { command, args, raw } = parseCommandLine(prompt);

    if (!command) {
        return 'Error: No command provided. Usage: bash <command> [args...]';
    }

    // Classify the risk level (before glob expansion for safety)
    const risk = classifyRisk(command, args, raw);

    // Block dangerous patterns entirely
    if (risk.level === RISK_LEVELS.BLOCKED) {
        return `BLOCKED: ${risk.reason}\nThis command pattern is not allowed for safety.`;
    }

    // Expand glob patterns in arguments (*, ?, [], */)
    // This is needed because shell: false doesn't do glob expansion
    const expandedArgs = expandGlobsInArgs(args);

    // Execute with appropriate permission tier
    const context = invocation.context || {};
    const permissionAgent = {
        ...invocation,
        promptReader: invocation.promptReader
            || (typeof invocation.llmAgent?.inputReader?.read === 'function'
                ? (promptText) => invocation.llmAgent.inputReader.read(promptText)
                : null),
    };
    const result = await executeWithTieredPermission(
        command,
        expandedArgs,
        permissionAgent,
        { context, risk }
    );

    if (result.denied) {
        return `Execution denied: ${result.reason}`;
    }

    if (!result.success) {
        return `Error: ${result.error}`;
    }

    return result.output || '(no output)';
}

export default action;
