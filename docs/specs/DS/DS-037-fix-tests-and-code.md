# DS-037 – Skill: fix-tests-and-code (.AchillesSkills/gamp/fix-tests-and-code/fix-tests-and-code.js)

## Version
- current: v1.0
- timestamp: 2025-12-04T11:33:47Z

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

#### Exports
- default skill `action({ prompt, context })` — ensures a dedicated remediation DS exists (cached in `.specs/.cache`), runs `runAlltests.js` up to three times, captures stdout/stderr/exit code per attempt, appends failure notes under the remediation DS `## Tests` section, triggers `build-code` after each failed attempt to regenerate artifacts, and returns the attempt log or success message.
  Diagram (ASCII):
  ```
  configure workspace
        |
        v
  ensure remediation DS id
        |
        v
  attempts 1..3:
        |
   run runAlltests.js
        |
   exitCode 0?
     |      |
    yes     no
     |       |
 return      append attempt output to DS Tests
 success          |
                  v
             run build-code
                  |
            next attempt (until 3)
                  |
            exhausted -> return attempts
  ```

#### Dependencies
- GampRSP
- node fs/path

#### Description
Repair-oriented skill that syncs code/tests with DS guidance, leveraging file impact metadata to scaffold missing pieces.

## Tests
- No dedicated suite; related to refactor/design and generic-skill e2e scenarios.
