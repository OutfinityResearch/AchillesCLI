# DS-039 – Skill: run-tests (.AchillesSkills/gamp/run-tests/run-tests.js)

## Version
- current: v1.0
- timestamp: 1700000003039

## Scope & Intent
Execute project test harness (`runAlltests.js`) and summarize failures, per `oskill.md`: support suite selection, stream stdout/stderr, report exit codes and failing suites, default to all suites when unspecified.

## Architecture
- Invokes npm/yarn test commands (or provided command) from workspace root.
- Collects stdout/stderr and exit code; surfaces failures.

## Traceability
- URS: URS-009
- Requirements: FS-010

## File Impact
### File: .AchillesSkills/gamp/run-tests/run-tests.js
Timestamp: 1700000003039

#### Exports
- default skill action({ prompt, context })

#### Dependencies
- node child_process (spawn/exec) [implied]

#### Description
Test runner skill to validate implementations against spec-derived suites; used when automation is needed after build/fix.

## Tests
- No dedicated suite; may be triggered in end-to-end workflows.
