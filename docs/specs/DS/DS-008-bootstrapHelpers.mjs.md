# DS-008 – Bootstrap (helpers/bootstrapHelpers.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

## Scope & Intent
Perform automatic bootstrap steps when specs are missing, honoring auto/ask/manual modes and avoiding repeated runs per session.

## Architecture
- Defines allowed bootstrap modes and default steps (ignore-files skill).
- Caches bootstrap completion and prevents duplicate execution.
- Prompts user in ask mode; logs progress and failures.

## Traceability
- URS: URS-004, URS-009
- Requirement: FS-007

## File Impact
### File: achilles-cli/helpers/bootstrapHelpers.mjs
Timestamp: 1700000003008

#### Exports
- normalizeBootstrapMode, ensureBootstrap

#### Dependencies
- helpers/executionHelpers.mjs
- helpers/styles.mjs

#### Description
Runs configured bootstrap skills with appropriate prompts and logging, ensuring specs root exists before planning/execution.

## Tests
- DS-021 (achilles-cli end-to-end)
- DS-022 (workspace workflows)
