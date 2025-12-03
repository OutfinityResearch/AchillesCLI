# DS-020 – Tests: cliPlanning.test.mjs

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

## Scope & Intent
Covers planner CLI behaviors, especially planning outputs and failure cases.

## Architecture
- Uses node:test to validate planner interactions via simulated LLMAgent and temporary workspaces.
- Asserts rejection when planner returns empty plans.

## Traceability
- URS: URS-001, URS-008
- Requirement: FS-001, FS-005

## File Impact
### File: tests/cliPlanning.test.mjs
Timestamp: 1700000003020

#### Exports
- Test cases (default execution via node --test)

#### Dependencies
- node:test, assert
- Achilles CLI modules via relative paths

#### Description
Ensures planner behavior matches expectations when no steps are produced and validates error handling.

## Related Files
- docs/specs/DS/DS-003-intentionToSkill.mjs.md
- docs/specs/DS/DS-005-planService.mjs.md
