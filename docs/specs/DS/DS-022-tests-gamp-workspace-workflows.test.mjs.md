# DS-022 – Tests: skills/workflows/workspace-workflows.test.mjs

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

## Scope & Intent
Validate workspace bootstrap/workflow behaviors, including ignore list generation and interaction with skills.

## Architecture

The module architecture spins temporary workspaces, uses stubbed LLM responses, and executes skills via CLI plans while checking concrete filesystem effects. It confirms bootstrap writes `.specs/.ignore` with defaults, `build-code` reads DS metadata and creates target source files containing the DS banner, `docs-and-summary` emits `.specs/mock/spec-summary.html` plus `.specs/html_docs/index.html`, `sync-specs` creates URS/FS anchors and DS files that reference the scanned source file, `run-tests` executes `runAlltests.js` and surfaces stdout/status from the child process, and `fix-tests-and-code` records remediation attempts before succeeding. The test inspects the created files and their contents to ensure each action happened.

## Traceability
- URS: URS-004, URS-008
- Requirement: FS-007

## File Impact
### File: achilles-cli/tests/workflows/workspace-workflows.test.mjs

#### Description
Covers bootstrap flows and ensures default ignore entries and skill usage align with expectations.

## Related Files
- docs/specs/DS/DS-008-bootstrapHelpers.mjs.md
