# DS-045 – Skill: spec-help (.AchillesSkills/gamp/spec-help/spec-help.js)

## Version
- current: v1.0
- timestamp: 2025-12-04T10:01:19Z

## Scope & Intent
Explain the GAMP spec stack and how to interact with it, per `oskill.md`: concise refresher on URS → FS/NFS → DS → Tests, traceability, per-requirement DS, and actionable best practices.

## Architecture
- Returns help text describing specs, commands, and navigation tips; reads workspace paths as needed.

## Traceability
- URS: URS-010
- Requirements: FS-008

## File Impact
### File: achilles-cli/.AchillesSkills/gamp/spec-help/spec-help.js
Timestamp: 1700000003045

#### Exports
- default skill `action({ prompt, context })` — configures workspace, optionally asks the LLM to produce structured help (introduction, keyConcepts, lifecycleSteps, bestPractices, closingThoughts), falls back to a static helper when LLM unavailable/fails, and returns the help payload plus status message.

#### Dependencies
- None beyond context

#### Description
User-facing help skill to explain specification usage and available commands/skills for navigating the spec set.

## Tests
- No dedicated suite; covered indirectly by CLI usage.
