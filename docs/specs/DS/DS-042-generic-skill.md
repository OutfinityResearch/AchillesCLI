# DS-042 – Skill: generic-skill (.AchillesSkills/gamp/generic-skill/generic-skill.js)

## Version
- current: v1.0
- timestamp: 2025-12-04T11:33:47Z

## Scope & Intent
Adaptive orchestrator when no specialised skill fits, per `oskill.md`: produce a short LLM plan and execute tools (list-files, read-file, rewrite-file, replace-text) with rationale for each step inside workspace root.

## Architecture
- Passes prompt to llmAgent with context (workspaceRoot, specsRoot) and returns raw response.
- Minimal logic; used when no specific skill applies.

## Traceability
- URS: URS-001, URS-008
- Requirements: FS-001

## File Impact
### File: achilles-cli/.AchillesSkills/gamp/generic-skill/generic-skill.js
Timestamp: 1700000003042

#### Exports
- default skill `action({ prompt, context, llmAgent })` — optionally asks the LLM for a JSON tool plan (list/read/rewrite/replace/create/append/delete), normalises steps, safely resolves all paths within workspaceRoot, executes each tool (with rewrite delegating to LLM using existing file content), logs progress via optional logger, and returns both the plan and per-step results.
  Diagram (ASCII):
  ```
  prompt + context
        |
        v
  readPlanFromLLM or DEFAULT_PLAN
        |
        v
  normalisePlan + safe paths
        |
        v
  for each step:
        |
    executeStep (tool executor)
        |
    record ok/failed + result/error
        |
    next step
        |
        v
  return {plan, steps}
  ```

#### Dependencies
- llmAgent from context

#### Description
Simple skill for generic LLM assistance scoped to workspace, used as a catch-all when orchestrator routes to a generic capability.

## Tests
- DS-025 (generic skill test suite).
