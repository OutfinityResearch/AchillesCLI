---
id: DS001
title: Coding Style and Runtime Conventions
status: active
owner: AchillesCLI Maintainers
summary: Defines coding, runtime, and documentation conventions for all AchillesCLI components.
---

# DS001-coding-style

## Introduction
This file is the coding-style authority for AchillesCLI. It defines implementation conventions, runtime discipline, and documentation obligations that apply across CLI, REPL, UI, schema, and skill modules.

## Core Content
1. Language and module style:
   - Use ESM imports/exports in runtime modules.
   - Keep directory-local naming conventions consistent with current files.
   - Prefer focused modules with explicit responsibilities over large multipurpose files.
2. Structural conventions:
   - CLI bootstrap logic remains in `src/index.mjs`.
   - REPL lifecycle and interactive behavior remain in `src/repl/`.
   - UI rendering/input helpers remain in `src/ui/`.
   - Skill contract parsing and schema utilities remain in `src/schemas/`.
   - Built-in executable skill modules remain in `src/skills/`.
3. Runtime configuration discipline:
   - Preserve environment-based defaults for runtime config.
   - Preserve explicit manual override paths for core config and dependency resolution.
   - Do not hide configuration failures behind silent fallbacks.
4. LLM interaction discipline:
   - Route LLM calls through AchillesAgentLib `LLMAgent` and `MainAgent` paths.
   - Keep tier/model policy centralized and session-aware.
   - Avoid ad-hoc direct provider SDK calls in feature modules.
5. Error handling and observability:
   - Emit clear operational errors for invalid command usage and unsupported flows.
   - Keep debug-level internals gated by debug flags.
   - Return user-safe error messages in non-debug paths.
6. Skill-system conventions:
   - Keep slash-command paths deterministic and explicit.
   - Keep natural-language execution routed through orchestration logic.
   - Keep read/write skill behavior explicit and auditable.
7. Achilles integration conventions:
   - AchillesAgentLib is an authorized dependency.
   - Integration must not assume AchillesAgentLib is always available in the current repo root.
   - Reference dependency and runtime helper examples under `.agents/skills/achilles_specs/examples/`.
8. Documentation conventions:
   - Persistent documentation remains in English.
   - DS files use direct specification language and do not use Q&A chapters.
   - When runtime behavior changes, update DS files and HTML docs in the same change set.

## Conclusion
DS001 is the required style and discipline contract for contributors and agents. Changes that alter structure, runtime behavior, or integration boundaries must keep this file synchronized.
