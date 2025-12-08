# DS-020 – Tests: cliPlanning.test.mjs

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

## Scope & Intent
Covers planner CLI behaviors, especially planning outputs and failure cases.

## Architecture

The module architecture loads orchestrator fixtures under `tests/fixtures/planner`, injects a stubbed LLMAgent that emits deterministic plans containing `project-router-orchestrator` and `timeline-planner-orchestrator`, and runs AchillesCLI planning against those fixtures. It verifies that the `/list` output includes those orchestrator names, that plan execution returns status `ok` for each planned step with the expected prompts, and that an empty-plan response triggers the planner error path rather than executing. No files are created beyond the temporary workspace scaffolding.

## Traceability
- URS: URS-001, URS-008
- Requirement: FS-001, FS-005

## File Impact
### File: achilles-cli/tests/cliPlanning.test.mjs

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
