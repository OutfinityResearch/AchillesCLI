# DS-024 – Tests: skills/refactor-design.test.mjs

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

## Scope & Intent
Cover refactor/design oriented workflows ensuring planner and skill outputs align with design expectations.

## Architecture

The module architecture creates temporary workspaces, runs `refactor-design` with paths in the prompt, and checks that the skill creates a DS file under `.specs/DS/` containing references to `src/refactors/plan-runner.mjs` and `src/config/plan.mjs`. It verifies that build-code stubs for those paths are materialised on disk with the DS banner. It also runs `ignore-files` to append custom patterns and asserts that `.specs/.ignore` includes both defaults (e.g., `node_modules`) and the user entries (`logs`, `build/output`), proving that file modifications happened.

## Traceability
- URS: URS-003, URS-005
- Requirement: FS-003, FS-004, FS-010

## File Impact
### File: achilles-cli/tests/skills/refactor-design.test.mjs

#### Description
Validates design/refactor-related spec updates and outputs.

## Related Files
- docs/specs/DS/DS-003-intentionToSkill.mjs.md
- docs/specs/DS/DS-006-executionHelpers.mjs.md
