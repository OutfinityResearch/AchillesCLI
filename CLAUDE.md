# skill-manager-cli — Local Guide

Standalone Achilles CLI checkout (vs the sibling in `AssistOSExplorer/AchillesCLI/`). Outer dir = Ploinky repo; inner `achilles-cli/` = Ploinky agent.

## Reading order

1. Parent `~/work/file-parser/CLAUDE.md` for workspace conventions.
2. `ARCHITECTURE.md` (same dir) for the full architecture diagram, core components, dependency graph, data flow, and module reference.
3. `achilles-cli/src/index.mjs` — entry point.
4. `achilles-cli/manifest.json` — Ploinky agent declaration.
5. `bash-skills/` — bash-implementation reference skills.

## Scope

- Skill CRUD (create/read/update/delete `cskill.md` / `oskill.md` / `mskill.md` / `tskill.md` / `dcgskill.md` / Anthropic-style `skill.md`).
- Schema validation against `achilles-cli/src/schemas/`.
- Code generation from skill definitions to executable `.mjs`.
- Iterative refinement until tests pass.
- Interactive REPL with history + slash commands.

## Critical components

- `AchillesCli` (core) — wraps `RecursiveSkilledAgent` from `achillesAgentLib`, `LLMAgent`, `HistoryManager`, `SlashCommandHandler`, `ActionReporter`.
- `REPLSession` — input loop, history, ESC cancel.
- `SlashCommandHandler` — `/ls`, `/read`, `/write`, skill exec.
- `CommandSelector` — arrow nav, filtering, skill picker.

## Conventions

- Node.js 20+, ES modules, `.mjs` where established, 4-space JS indent.
- Built-in skills live in `achilles-cli/src/skills/`.
- LLM invocation: through `LLMAgent` from `achillesAgentLib`, never direct vendor HTTP.

## Testing

- `tests/` at outer repo root for integration/test-env runs.
- Validate skill schema changes against fixtures before refactoring schemas.

## Commit policy

Inherits workspace commit policy (no AI attribution). See `~/work/file-parser/CLAUDE.md`.

## Relationship to AssistOSExplorer

`AssistOSExplorer/AchillesCLI/` is the sibling checkout used by the Explorer workspace. Keep their schemas and core CLI behavior aligned; divergence between the two checkouts is a smell, not a feature.
