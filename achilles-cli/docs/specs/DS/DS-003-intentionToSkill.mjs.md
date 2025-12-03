# DS-003 – Intent to Skill Plan (intentionToSkill.mjs)

## Version
- current: v1.0
- timestamp: 1700000003003

## Scope & Intent
Convert free-text tasks into ordered skill steps via LLM planner, embedding language contract and orchestrator catalog.

## Architecture
- Builds planner prompt with available orchestrators and guidance text.
- Invokes `llmAgent.executePrompt` with JSON response shape and handles errors.
- Parses plan output into `{skill, prompt}` steps via cliUtils.parsePlan.

## Traceability
- URS: URS-001, URS-008
- Requirement: FS-001

## File Impact
### File: intentionToSkill.mjs
Timestamp: 1700000003003

#### Exports
- `PLAN_INTENT`
- `intentionToSkillPlan()`

#### Dependencies
- helpers/planHelpers.mjs
- helpers/cliUtils.mjs

#### Description
Defines planner context intent, composes prompt text, executes LLM, and validates the returned plan array with graceful fallbacks on failure.

## Tests
- DS-020 (planner CLI)
