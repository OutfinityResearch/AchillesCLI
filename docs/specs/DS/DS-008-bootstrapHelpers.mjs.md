# DS-008 – Bootstrap (helpers/bootstrapHelpers.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-04T11:33:47Z

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

#### Exports
- `normalizeBootstrapMode(mode, fallback)` — validates the bootstrap mode (`auto|ask|manual`), falling back to a sanitized default when unset/invalid.
- `ensureBootstrap(cli, taskDescription)` — idempotent bootstrap orchestrator: respects mode (auto/ask/manual), resolves configured auto-skills (e.g., `ignore-files`), optionally prompts the user, runs skills with language contract + previews, logs failures, and flips completion flags to avoid duplicate runs.
  Diagram (ASCII):
  ```
  bootstrap needed?
        |
        v
  already running? --yes--> wait for promise
        |
       no
        |
  _bootstrapRequired? --no--> mark done
        |
       yes
        |
  resolve mode (auto/ask/manual)
        |
   manual -> mark done
   auto/ask -> iterate auto skills
                     |
                find skill?
                 /       \
             missing    found
               |          |
           log skip   ask mode?
                          / \
                    decline  approve
                       |        |
                     skip     runSkill + preview
                                    |
                               next skill
  after skills -> mark done -> return
  ```

#### Dependencies
- helpers/executionHelpers.mjs
- helpers/styles.mjs

#### Description
Runs configured bootstrap skills with appropriate prompts and logging, ensuring specs root exists before planning/execution.

## Tests
- DS-021 (achilles-cli end-to-end)
- DS-022 (workspace workflows)
