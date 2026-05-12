#!/usr/bin/env node

import { buildSlashCommandCatalog } from '../repl/SlashCommandHandler.mjs';

function toAutocompleteCatalog() {
    const commands = buildSlashCommandCatalog().map((command) => ({
        name: command.name,
        usage: command.usage,
        description: command.description,
        subCommands: Array.isArray(command.subCommands)
            ? command.subCommands.map((subCommand) => ({
                name: subCommand.name,
                usage: subCommand.usage,
                description: subCommand.description,
            }))
            : [],
    }));

    return {
        type: 'achilles-slash-command-catalog',
        version: 1,
        commands,
    };
}

process.stdout.write(`${JSON.stringify(toAutocompleteCatalog())}\n`);
