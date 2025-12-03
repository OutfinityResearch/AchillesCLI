# DS-005 – Plan Lifecycle (helpers/planService.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

## Scope & Intent
Manage planning flow: prepare plan, execute steps, handle cancellations, resume intents, and summarize executions.

## Architecture
- `preparePlan` ensures bootstrap then calls planner.
- `executePlan` iterates skill steps with progress reporting, cancellation checks, pending plan bookkeeping, and spec action previews.
- `detectResumeInput` uses heuristics + LLM to decide resume intent.
- `resumePendingPlan` optionally replans with extra instructions and continues from saved index.

## Traceability
- URS: URS-002, URS-003, URS-004, URS-008
- Requirement: FS-001, FS-005, FS-006, FS-008

## File Impact
### File: helpers/planService.mjs
Timestamp: 1700000003005

#### Exports
- parse/detect resume
- preparePlan, executePlan, processTaskInput
- resumePendingPlan, summarizeExecutions

#### Dependencies
- intentionToSkill.mjs
- helpers/bootstrapHelpers.mjs
- helpers/executionHelpers.mjs
- helpers/styles.mjs

#### Description
Central orchestrator for plan preparation and execution, wiring bootstrap, logging, resume flows, and memory capture hooks.

## Tests
- DS-021 (achilles-cli end-to-end)
- DS-020 (planner CLI)
