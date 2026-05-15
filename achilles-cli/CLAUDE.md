# achilles-cli (inner agent)

Ploinky-agent layer for skill-manager-cli. The outer `../CLAUDE.md` is the local guide; `../ARCHITECTURE.md` has the full diagram and module reference.

## Entry points

- `src/index.mjs` — CLI arg parsing, single-shot vs REPL mode detection, logger config.
- `bin/achilles-cli` — binary wrapper.
- `manifest.json` — Ploinky agent declaration.

## Module layout

- `src/skills/` — built-in skills bundled with the CLI.
- `src/repl/` — REPL components (input loop, history, ESC cancel).
- `src/ui/` — UI components (CommandSelector, ResultFormatter).
- `src/lib/` — library helpers.
- `src/schemas/` — JSON schemas for each skill type (`cskill`, `oskill`, `mskill`, `tskill`, `dcgskill`).
- `scripts/installPrerequisites.sh` — agent install hook.

## Conventions

- All LLM invocation through `LLMAgent` from `achillesAgentLib` (workspace-shared at `~/work/file-parser/ploinky/node_modules/achillesAgentLib`).
- Built-in skills follow the same `SKILL.md` + `skill.json` schema as user-authored skills.

## Commit policy

Inherits workspace commit policy. See `~/work/file-parser/CLAUDE.md`.
