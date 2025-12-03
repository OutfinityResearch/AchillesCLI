# DS-042 – Skill: generic-skill (.AchillesSkills/gamp/generic-skill/generic-skill.js)

## Version
- current: v1.0
- timestamp: 1700000003042

## Scope & Intent
Adaptive orchestrator when no specialised skill fits, per `oskill.md`: produce a short LLM plan and execute tools (list-files, read-file, rewrite-file, replace-text) with rationale for each step inside workspace root.

## Architecture
- Passes prompt to llmAgent with context (workspaceRoot, specsRoot) and returns raw response.
- Minimal logic; used when no specific skill applies.

## Traceability
- URS: URS-001, URS-008
- Requirements: FS-001

## File Impact
### File: .AchillesSkills/gamp/generic-skill/generic-skill.js
Timestamp: 1700000003042

#### Exports
- default skill action({ prompt, context })

#### Dependencies
- llmAgent from context

#### Description
Simple skill for generic LLM assistance scoped to workspace, used as a catch-all when orchestrator routes to a generic capability.

## Tests
- DS-025 (generic skill test suite).
