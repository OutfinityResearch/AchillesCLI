#!/usr/bin/env node

import { discoverSkills } from 'achillesAgentLib/MainAgent';
import { buildSlashCommandCatalog } from '../repl/SlashCommandHandler.mjs';

const OPTIONAL_SKILL_ARG_COMMANDS = new Set(['/test', '/run-tests']);

function readStdin() {
    return new Promise((resolve) => {
        if (process.stdin.isTTY) {
            resolve('');
            return;
        }

        let data = '';
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', (chunk) => {
            data += chunk;
        });
        process.stdin.on('end', () => resolve(data));
        process.stdin.on('error', () => resolve(data));
    });
}

function parsePayload(raw) {
    const text = String(raw || '').trim();
    if (!text) {
        return {};
    }
    try {
        return JSON.parse(text);
    } catch {
        return {};
    }
}

function extractInput(payload) {
    if (!payload || typeof payload !== 'object') {
        return {};
    }
    if (payload.input && typeof payload.input === 'object' && !Array.isArray(payload.input)) {
        return payload.input;
    }
    if (payload.arguments && typeof payload.arguments === 'object' && !Array.isArray(payload.arguments)) {
        return payload.arguments;
    }
    if (payload.params?.arguments && typeof payload.params.arguments === 'object' && !Array.isArray(payload.params.arguments)) {
        return payload.params.arguments;
    }
    return {};
}

function buildSkillCompletions(dir) {
    const skills = discoverSkills(dir || process.cwd(), { logger: { debug() {}, warn() {}, info() {}, log() {}, error() {} } });
    const names = new Set();
    for (const skill of skills) {
        const name = String(skill?.shortName || skill?.name || '').trim();
        if (name) {
            names.add(name);
        }
    }
    return Array.from(names)
        .sort((a, b) => a.localeCompare(b))
        .map((name) => ({
            value: name,
            label: name,
            description: '',
        }));
}

function commandUsesSkillArgument(command) {
    return Boolean(command?.needsSkillArg) || OPTIONAL_SKILL_ARG_COMMANDS.has(command?.name);
}

function buildArgCompletions(command, skillCompletions) {
    if (!commandUsesSkillArgument(command)) {
        return [];
    }
    if (command?.name === '/run-tests') {
        return [
            { value: 'all', label: 'all', description: 'Run all tests' },
            ...skillCompletions,
        ];
    }
    return skillCompletions;
}

function toAutocompleteCatalog(options = {}) {
    const skillCompletions = buildSkillCompletions(options.dir);
    const commands = buildSlashCommandCatalog().map((command) => ({
        name: command.name,
        usage: command.usage,
        description: command.description,
        subCommands: Array.isArray(command.subCommands)
            ? command.subCommands.map((subCommand) => ({
                name: subCommand.name,
                usage: subCommand.usage,
                description: subCommand.description,
                argCompletions: subCommand.needsSkillArg ? skillCompletions : [],
            }))
            : [],
        argCompletions: buildArgCompletions(command, skillCompletions),
    }));

    return {
        type: 'achilles-slash-command-catalog',
        version: 1,
        commands,
    };
}

const payload = parsePayload(await readStdin());
const input = extractInput(payload);
process.stdout.write(`${JSON.stringify(toAutocompleteCatalog({ dir: input.dir }))}\n`);
