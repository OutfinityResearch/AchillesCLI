---
id: DS005
title: REPL and Command Processing
status: active
owner: AchillesCLI Maintainers
summary: Defines interactive session behavior, hierarchical command routing, and natural-language processing flow.
---

# DS005-repl-and-command-processing

## Introduction
This DS documents the interactive runtime in `src/repl/`, including session lifecycle, hierarchical command routing, and natural-language execution.

## Core Content
Primary REPL components and responsibilities:
1. `REPLSession.mjs`
   - Owns interactive loop lifecycle.
   - Coordinates input acquisition, execution dispatch, and output rendering.
   - Maintains session-local execution context.
   - Routes all non-slash input directly to the LLM processor.
2. `InteractivePrompt.mjs`
   - Handles prompt capture and line-edit interactions.
   - Provides hierarchical command menu: typing `/` opens the top-level command picker.
   - Commands with sub-options show a secondary menu when selected (e.g., `/list` → `skills`, `repos`).
   - Commands without sub-options complete directly or prompt for skill/argument input.
3. `SlashCommandHandler.mjs`
   - Defines command grammar via `COMMAND_DEFINITIONS` and `SUB_OPTIONS`.
   - Routes deterministic commands to concrete handlers/skills.
   - Enforces argument validation for slash-command entry points.
   - Supports hierarchical commands with sub-options (e.g., `/list skills`, `/add repo`).
4. `NaturalLanguageProcessor.mjs`
    - Routes free-text prompts into orchestrated LLM execution.
    - Applies runtime execution options and context shaping.
    - Captures ESC interruptions and propagates cancellation to MainAgent session runtime.
5. `HistoryManager.mjs`
   - Persists and rehydrates command history.
   - Stores history in `.achilles-cli/history` within the working directory.
   - Supports history navigation and replay behavior.

Command routing model:
1. Inputs beginning with `/` are parsed as command invocations.
2. Commands may have sub-options (e.g., `/list` → `skills`, `repos`). Selecting a command with sub-options opens a secondary menu.
3. Non-slash inputs are processed directly through the natural-language execution path with no fallback to quick commands.
4. Command handlers can trigger skill reload when skill definitions change.

Hierarchical command structure:
1. Commands with `subOptions` in `COMMAND_DEFINITIONS` show a sub-menu when selected.
2. Sub-options are defined in `SUB_OPTIONS` with their own skill mappings and argument requirements.
3. Commands without sub-options complete directly or prompt for additional input (skill name, text arguments).
4. The command picker (`/`) is the primary discovery mechanism for all available commands.

Session control behavior:
1. REPL session stores and applies current tier/model preferences.
2. Cancellation/interruption paths must preserve terminal recoverability.
3. ESC interruption is supported for both natural-language processing and slash-command execution paths.
4. Slash-command execution forwards AbortSignal and interruption intent to skill runtime calls.
5. Context-sensitive help and command selection remain available in interactive mode.

Operational invariants:
1. Deterministic slash flows must avoid unnecessary LLM routing.
2. Natural-language flows must remain explicit about orchestrated execution.
3. REPL errors must be user-readable and must not silently terminate the loop.
4. All commands use slash syntax; there are no quick commands without `/`.
5. Interrupted turns must not be appended to command history.

## Conclusion
The REPL subsystem is the primary interactive contract for AchillesCLI and must keep deterministic commands, orchestrated prompting, and session-state controls coherent. The hierarchical command model provides uniform discovery and execution through the `/` menu.
