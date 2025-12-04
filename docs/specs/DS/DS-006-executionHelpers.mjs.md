# DS-006 – Skill Execution & Formatting (helpers/executionHelpers.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

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
- buildArgsForSkill, runSkill
- printPlan, printExecutions, formatExecutionResult
- summarizeSpecActions, printSpecActionPreview, printSpecificationDetails
- executeSingleSkill

#### Dependencies
- helpers/styles.mjs
- helpers/memoryHelpers.mjs
- helpers/specDocumentHelpers.mjs

#### Description
Transforms planner steps into runnable skill invocations, ensuring language enforcement, context injection, and user-facing output with spec previews.

## Tests
- DS-021 (achilles-cli end-to-end)
- DS-025 (generic skill)
