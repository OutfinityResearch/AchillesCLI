---
id: DS005
title: REPL and Command Processing
status: active
owner: AchillesCLI Maintainers
summary: Defines interactive session behavior, command routing, and natural-language processing flow.
---

# DS005-repl-and-command-processing

## Introduction
This DS documents the interactive runtime in `src/repl/`, including session lifecycle, slash-command routing, and natural-language execution.

## Core Content
Primary REPL components and responsibilities:
1. `REPLSession.mjs`
   - Owns interactive loop lifecycle.
   - Coordinates input acquisition, execution dispatch, and output rendering.
   - Maintains session-local execution context.
2. `InteractivePrompt.mjs`
   - Handles prompt capture and line-edit interactions.
   - Integrates advanced input flow with UI providers.
3. `SlashCommandHandler.mjs`
   - Registers command grammar and aliases.
   - Routes deterministic commands to concrete handlers/skills.
   - Enforces argument validation for slash-command entry points.
4. `QuickCommands.mjs`
   - Provides fast-path helper commands and convenience operations.
5. `NaturalLanguageProcessor.mjs`
   - Routes free-text prompts into orchestrated LLM execution.
   - Applies runtime execution options and context shaping.
6. `HistoryManager.mjs`
   - Persists and rehydrates command history.
   - Supports history navigation and replay behavior.

Command routing model:
1. Inputs beginning with slash syntax are parsed as command invocations.
2. Non-slash inputs are processed through the natural-language execution path.
3. Command handlers can trigger skill reload when skill definitions change.

Session control behavior:
1. REPL session stores and applies current tier/model preferences.
2. Cancellation/interruption paths must preserve terminal recoverability.
3. Context-sensitive help and command selection remain available in interactive mode.

Operational invariants:
1. Deterministic slash flows must avoid unnecessary LLM routing.
2. Natural-language flows must remain explicit about orchestrated execution.
3. REPL errors must be user-readable and must not silently terminate the loop.

## Conclusion
The REPL subsystem is the primary interactive contract for AchillesCLI and must keep deterministic commands, orchestrated prompting, and session-state controls coherent.
