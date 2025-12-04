# DS-007 – Skill Catalog (helpers/skillCatalog.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-04T11:33:47Z

## Scope & Intent
Discover and register skills from `.AchillesSkills` roots, expose catalog queries, and manage orchestrator filtering.

## Architecture
- Resolves skill roots under provided directories and CLI bundle.
- Clears and rebuilds catalog/aliases/subsystems on registration.
- Lists skills with detected implementation types (js/sop/descriptor).
- Finds skills by name/alias/title and filters orchestrators.

## Traceability
- URS: URS-001, URS-008
- Requirement: FS-001, FS-008

## File Impact
### File: achilles-cli/helpers/skillCatalog.mjs
Timestamp: 1700000003007

#### Exports
- `resolveSkillRoot(dir)` — resolves an absolute path to `.AchillesSkills` under `dir`, validating existence and directory-ness (returns null when absent).
- `registerLocalSkills(cli)` — clears existing catalog/aliases/subsystems, ensures subsystem keys persist, scans all configured roots, and registers skills with the recursive agent while logging per-root failures.
- `getSkillCatalog(cli)` — returns the full in-memory skill registry as recorded by the recursive agent.
- `listSkills(cli, columns, timeoutMs)` — renders catalog entries into pipe-separated rows (name/type/summary/implementation by default) with a timeout guard to avoid hanging on huge catalogs.
- `findSkill(cli, name)` — case-insensitive lookup across name/shortName/title aliases; returns the matching record or null.
- `getOrchestrators(cli)` — filters the catalog to orchestrator-type skills for planning.
  Diagram (registerLocalSkills, ASCII):
  ```
  [skillSearchRoots]
         |
         v
  resolveSkillRoot (each)
         |
         v
  clear catalogs + restore subsystems
         |
         v
  registerSkillsFromRoot(root...)
         |
         v
     catalog ready
  ```

#### Dependencies
- node fs/path
- helpers/cliUtils.mjs

#### Description
Handles skill discovery and catalog maintenance for recursive agent, enabling planners and /run commands to target available capabilities.

## Tests
- DS-021 (achilles-cli end-to-end)
