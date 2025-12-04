# DS-003 – Intent to Skill Plan (intentionToSkill.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-04T11:33:47Z

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
### File: achilles-cli/intentionToSkill.mjs
Timestamp: 1700000003003

#### Exports
- `PLAN_INTENT` — constant context tag (`cli-orchestrator-planning`) applied to LLM calls so downstream logging/analytics can segment planner traffic.
- `intentionToSkillPlan({ llmAgent, taskDescription, orchestrators, languageContract, modelMode })` — builds the orchestrator prompt, invokes `llmAgent.executePrompt` with JSON shape, parses `{ skill, prompt }` steps via `parsePlan`, and returns `{ plan, error }` with graceful fallbacks when the LLM is missing or replies empty.
  Diagram (ASCII):
  ```
  [task + orchestrators]
           |
           v
    buildPlanPrompt
           |
           v
  llmAgent.executePrompt (json)
           |
           v
        parsePlan
           |
   plan entries?
      |      |
     no     yes
      |      |
      v      v
  return   return
 {plan:[], {plan, error:null}
  error}
  ```

#### Dependencies
- helpers/planHelpers.mjs
- helpers/cliUtils.mjs

#### Description
Defines planner context intent, composes prompt text, executes LLM, and validates the returned plan array with graceful fallbacks on failure.

## Tests
- DS-020 (planner CLI)
