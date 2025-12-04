# DS-017 – Output Helpers (helpers/outputHelpers.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-04T10:01:19Z

## Scope & Intent
Render help and status output summarizing available commands, skill usage, and LLM log/stat paths with duration buckets.

## Architecture
- `printHelp` describes CLI commands and usage.
- `printStatus` reports log/stat file locations and response time buckets via LLM logger utils.

## Traceability
- URS: URS-010
- Requirement: FS-008, NFS-005

## File Impact
### File: achilles-cli/helpers/outputHelpers.mjs
Timestamp: 1700000003017

#### Exports
- `printHelp(cli)` — renders command cheat-sheet (list/debug/model/lang/run/continue/status/specs/exit), input tips (multiline, cancel keys, history recall, resume cues), and paths for prompt history.
- `printStatus(cli)` — prints aggregated LLM stats (request counts, tokens, last model, per-model breakdown, response time buckets), log/stat file paths, and available fast/deep model options from the invoker strategy.

#### Dependencies
- achillesAgentLib/utils/LLMLogger
- helpers/styles.mjs

#### Description
Small renderer utilities for user assistance and status diagnostics inside CLI.

## Tests
- DS-021 (achilles-cli end-to-end)
