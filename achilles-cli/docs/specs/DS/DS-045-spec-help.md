# DS-045 – Skill: spec-help (.AchillesSkills/gamp/spec-help/spec-help.js)

## Version
- current: v1.0
- timestamp: 1700000003045

## Scope & Intent
Explain the GAMP spec stack and how to interact with it, per `oskill.md`: concise refresher on URS → FS/NFS → DS → Tests, traceability, per-requirement DS, and actionable best practices.

## Architecture
- Returns help text describing specs, commands, and navigation tips; reads workspace paths as needed.

## Traceability
- URS: URS-010
- Requirements: FS-008

## File Impact
### File: .AchillesSkills/gamp/spec-help/spec-help.js
Timestamp: 1700000003045

#### Exports
- default skill action({ prompt, context })

#### Dependencies
- None beyond context

#### Description
User-facing help skill to explain specification usage and available commands/skills for navigating the spec set.

## Tests
- No dedicated suite; covered indirectly by CLI usage.
