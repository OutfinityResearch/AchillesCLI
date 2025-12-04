# DS-037 – Skill: fix-tests-and-code (.AchillesSkills/gamp/fix-tests-and-code/fix-tests-and-code.js)

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

## Scope & Intent
Iteratively fix tests and code, per `oskill.md`: run `run-tests`, collect failures, append diagnostics to DS, rerun `build-code`, and stop when passing or no actionable failures; limit attempts and surface remediation summary.

## Architecture
- Reads DS to identify impacted files and test folders.
- Applies templated headers and hints for exports/dependencies; rewrites files with DS references.
- Aims to align code/tests to spec expectations; does not run tests itself.

## Traceability
- URS: URS-005, URS-009
- Requirements: FS-004, FS-010

## File Impact
### File: achilles-cli/.AchillesSkills/gamp/fix-tests-and-code/fix-tests-and-code.js
Timestamp: 1700000003037

#### Exports
- default skill action({ prompt, context })

#### Dependencies
- GampRSP
- node fs/path

#### Description
Repair-oriented skill that syncs code/tests with DS guidance, leveraging file impact metadata to scaffold missing pieces.

## Tests
- No dedicated suite; related to refactor/design and generic-skill e2e scenarios.
