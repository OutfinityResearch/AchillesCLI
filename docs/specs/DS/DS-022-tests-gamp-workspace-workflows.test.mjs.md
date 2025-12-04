# DS-022 – Tests: gamp/workspace-workflows.test.mjs

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

## Scope & Intent
Validate workspace bootstrap/workflow behaviors, including ignore list generation and interaction with skills.

## Architecture
- Spins temporary workspaces, simulates LLM interactions, and asserts bootstrap outcomes and skill executions.

## Traceability
- URS: URS-004, URS-008
- Requirement: FS-007

## File Impact
### File: achilles-cli/tests/gamp/workspace-workflows.test.mjs
Timestamp: 1700000003022

#### Description
Covers bootstrap flows and ensures default ignore entries and skill usage align with expectations.

## Related Files
- docs/specs/DS/DS-008-bootstrapHelpers.mjs.md
