# DS-004 – Plan Prompt Builder (helpers/planHelpers.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

## Scope & Intent
Construct planner prompt text with task context, orchestrator metadata, specification guidance, and language contract.

## Architecture
- Defines `buildPlanPrompt` assembling sections (task, guidance, available orchestrators, response format).
- Injects `SPEC_GUIDANCE_TEXT` to steer GAMP outputs.

## Traceability
- URS: URS-001, URS-003
- Requirement: FS-001, FS-003

## File Impact
### File: helpers/planHelpers.mjs
Timestamp: 1700000003004

#### Exports
- `buildPlanPrompt`

#### Dependencies
- helpers/specGuidance.mjs

#### Description
Single function that returns structured prompt text for the planner, aligning orchestrator metadata and response schema expectations.

## Tests
- DS-020 (planner CLI)
