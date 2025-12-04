# DS-032 – Spec Planner Utility (.AchillesSkills/gamp/utils/specPlanner.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-04T11:33:47Z

## Scope & Intent
Utility for spec skills to talk to GampRSP: summarize specs, parse planner output, and apply spec actions (URS/FS/NFS/DS/test/file-impact).

## Architecture
- Ensures LLM presence in context (`ensureLLM`).
- Loads and truncates specs snapshot (`summariseSpecs`).
- Parses planner output into actions (`parsePlan`), then applies actions to GampRSP (`executePlan` via create/update/retire URS/FS/NFS, create/update DS, describeFile, create/delete tests).

## Traceability
- URS: URS-003, URS-004, URS-005
- Requirements: FS-003, FS-004, FS-010

## File Impact
### File: achilles-cli/.AchillesSkills/gamp/utils/specPlanner.mjs

#### Exports
- `ensureLLM(context)` — asserts `context.llmAgent.executePrompt` exists, otherwise throws to stop planning/execution early.
- `summariseSpecs(limit)` — returns full specs snapshot or truncated preview to avoid overshooting LLM limits.
- `parsePlan(raw)` — normalises raw planner responses (arrays, objects with `actions`, JSON strings) into an array of action objects.
- `executePlan(plan)` — iterates actions and applies them to GampRSP (create/update/retire URS/FS/NFS; create/update DS; create/delete tests; describeFile with why/how/what/exports/dependencies/side-effects/concurrency). Captures errors per step instead of aborting the whole plan.
  Diagram (ASCII):
  ```
  plan actions
      |
      v
  for each step:
      applyAction -> GampRSP CRUD/describeFile/test
      |
      v
  record outcome or error
      |
      v
  next step
      |
      v
  return outcomes
  ```

#### Dependencies
- GampRSP singleton

#### Description
Shared executor for spec-related skills, bridging LLM-generated action plans to concrete spec mutations and HTML doc generation support.

## Tests
- Referenced indirectly by DS-021/DS-023/DS-026 when spec skills are mocked; no dedicated suite.
