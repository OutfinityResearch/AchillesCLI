# DS-006 – Skill Execution & Formatting (helpers/executionHelpers.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-04T11:33:47Z

## Scope & Intent
Run skills with language contracts, build arguments, print plans/executions, preview spec actions, and format results for memory/logging.

## Architecture
- Wraps prompts with language contract; builds skill args (defaultArgument/requiredArguments).
- Executes via `recursiveAgent.executeWithReviewMode` with workspace/specs/memory context.
- Formats execution payloads (actions, reviews, docs, counts) and prints previews/detail lines.
- Provides single-skill runner for /run commands.

## Traceability
- URS: URS-001, URS-003, URS-007, URS-008, URS-010
- Requirement: FS-001, FS-003, FS-006, FS-008, FS-009

## File Impact
### File: achilles-cli/helpers/executionHelpers.mjs
Timestamp: 1700000003006

#### Exports
- `buildArgsForSkill(cli, record, prompt)` — merges the planner prompt with skill metadata (defaultArgument/requiredArguments) into a concrete args object passed to the recursive agent; enforces language contract when the skill requests it.
- `runSkill(cli, record, prompt)` — orchestrates a single skill execution: builds args, wraps the prompt with the CLI language contract, injects workspace/spec/memory context, calls `recursiveAgent.executeWithReviewMode`, prints previews, and returns the raw execution payload.
- `printPlan(cli, plan)` / `printExecutions(cli, executions)` — render the planned steps and their outcomes to stdout with progress numbering and status colouring.
- `formatExecutionResult(cli, execution)` — normalises a skill result (actions, reviews, docs, counts, errors) into human-readable lines for memory capture/logging.
- `summarizeSpecActions(actions)` / `printSpecActionPreview(cli, record, payload)` / `printSpecificationDetails(cli, actions)` — collapse spec actions into concise summaries and emit previews (per action and full sections) so operators see what will change.
- `executeSingleSkill(cli, skillName, prompt)` — convenience runner for `/run`: resolves the skill, delegates to `runSkill`, prints execution summaries, and captures memory in one go.
  Diagram (runSkill, ASCII):
  ```
  [skill record + prompt]
              |
              v
    buildArgsForSkill (+ language contract)
              |
              v
  recursiveAgent.executeWithReviewMode
              |
              v
     printSpecActionPreview
              |
              v
     return execution payload
  ```

#### Dependencies
- helpers/styles.mjs
- helpers/memoryHelpers.mjs
- helpers/specDocumentHelpers.mjs

#### Description
Transforms planner steps into runnable skill invocations, ensuring language enforcement, context injection, and user-facing output with spec previews.

## Tests
- DS-021 (achilles-cli end-to-end)
- DS-025 (generic skill)
