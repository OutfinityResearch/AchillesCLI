# DS-039 – Skill: run-tests (.AchillesSkills/gamp/run-tests/run-tests.js)

## Version
- current: v1.0
- timestamp: 2025-12-04T10:01:19Z

## Scope & Intent
Execute project test harness (`runAlltests.js`) and summarize failures, per `oskill.md`: support suite selection, stream stdout/stderr, report exit codes and failing suites, default to all suites when unspecified.

## Architecture

The module architecture invokes npm/yarn test commands (or provided command) from workspace root. It collects stdout/stderr and exit code; surfaces failures.

## Traceability
- URS: URS-009
- Requirements: FS-010

## File Impact
### File: achilles-cli/.AchillesSkills/gamp/run-tests/run-tests.js

#### Exports
- default skill `action({ prompt, context })` — configures workspace, extracts optional suite id from the prompt (FS/NFS/TEST), runs `runAlltests.js` via `node` with optional `--suite`, and returns suite label, pass/fail status, stdout/stderr, and exit code.

#### Dependencies
- node child_process (spawn/exec) [implied]

#### Description
Test runner skill to validate implementations against spec-derived suites; used when automation is needed after build/fix.

## Tests
- No dedicated suite; may be triggered in end-to-end workflows.
