# DS-007 – Skill Catalog (helpers/skillCatalog.mjs)

## Version
- current: v1.0
- timestamp: 1700000003007

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
### File: helpers/skillCatalog.mjs
Timestamp: 1700000003007

#### Exports
- resolveSkillRoot, registerLocalSkills, getSkillCatalog, listSkills, findSkill, getOrchestrators

#### Dependencies
- node fs/path
- helpers/cliUtils.mjs

#### Description
Handles skill discovery and catalog maintenance for recursive agent, enabling planners and /run commands to target available capabilities.

## Tests
- DS-021 (achilles-cli end-to-end)
