# DS-005 – Plan Lifecycle (helpers/planService.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-04T11:33:47Z

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
### File: achilles-cli/helpers/planService.mjs
Timestamp: 1700000003005

#### Exports
- `parseResumeInput` / `detectResumeInput` — parse raw text for resume keywords (continue/resume variants) and, if not matched, optionally call the LLM to classify the intent, returning `{ resume, extra }` hints for pending plans.
- `preparePlan` — trims the task, enforces bootstrap, gathers orchestrators + language contract, invokes `intentionToSkillPlan`, and surfaces actionable errors when no skills or no steps are produced.
- `executePlan` — walks each planned step with cancellation/skip handling, progress output, missing-skill reporting, skill execution via `runSkill`, spec previews, and pending-plan bookkeeping so resume can pick up mid-flow; returns executions plus a cancelled flag.
  Diagram (ASCII):
  ```
  [start] -> mark plan in progress
             |
             v
        more steps?
         |      |
        no     yes
         |      |
         v      v
   finalize   cancel requested?
                 |        |
                yes      no
                 |        |
         persist next   find skill
         index + warn      |
                 \         v
                  \-> missing? -> record failure -> advance index -> back to "more steps?"
                           |
                          no
                           |
                        runSkill + previews
                           |
                        record outcome
                           |
                        advance index
                           |
                        back to "more steps?"
  ```
- `processTaskInput` — prepares the plan for a user prompt and, unless `skipExecution` is true, executes it with optional progress announcements, returning both plan and execution records.
- `resumePendingPlan` — optionally replans with extra instructions, prints plan preview, resumes from saved index with progress output, and captures memory with plan/execution/cancelled details.
- `summarizeExecutions` — formats execution records into concise status lines for memory/logging (status + skill + formatted result).

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
