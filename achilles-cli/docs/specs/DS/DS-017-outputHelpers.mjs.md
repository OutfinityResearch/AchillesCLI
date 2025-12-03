# DS-017 – Output Helpers (helpers/outputHelpers.mjs)

## Version
- current: v1.0
- timestamp: 1700000003017

## Scope & Intent
Render help and status output summarizing available commands, skill usage, and LLM log/stat paths with duration buckets.

## Architecture
- `printHelp` describes CLI commands and usage.
- `printStatus` reports log/stat file locations and response time buckets via LLM logger utils.

## Traceability
- URS: URS-010
- Requirement: FS-008, NFS-005

## File Impact
### File: helpers/outputHelpers.mjs
Timestamp: 1700000003017

#### Exports
- printHelp, printStatus

#### Dependencies
- achillesAgentLib/utils/LLMLogger
- helpers/styles.mjs

#### Description
Small renderer utilities for user assistance and status diagnostics inside CLI.

## Tests
- DS-021 (achilles-cli end-to-end)
