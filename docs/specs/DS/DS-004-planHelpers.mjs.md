# DS-004 – Plan Prompt Builder (helpers/planHelpers.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-04T10:01:19Z

## Scope & Intent
Construct planner prompt text with task context, orchestrator metadata, specification guidance, and language contract.

## Architecture

The module architecture defines `buildPlanPrompt` assembling sections (task, guidance, available orchestrators, response format). It injects `SPEC_GUIDANCE_TEXT` to steer GAMP outputs.

## Traceability
- URS: URS-001, URS-003
- Requirement: FS-001, FS-003

## File Impact
### File: achilles-cli/helpers/planHelpers.mjs

#### Exports
- `buildPlanPrompt` — assembles the planner prompt with task text, GAMP spec guidance, optional language contract, orchestration rules, and a JSON response schema; injects orchestrator metadata (name/summary/instructions) so the LLM can map intents to skills deterministically.

#### Dependencies
- helpers/specGuidance.mjs

#### Description
Single function that returns structured prompt text for the planner, aligning orchestrator metadata and response schema expectations.

## Tests
- DS-020 (planner CLI)
