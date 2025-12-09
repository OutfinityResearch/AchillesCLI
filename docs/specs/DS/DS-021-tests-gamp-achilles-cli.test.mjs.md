# DS-021 – Tests: skills/workflows/achilles-cli.test.mjs

## Version
- current: v1.0
- timestamp: 2025-12-09T11:32:04Z

## Scope & Intent
End-to-end CLI tests covering bootstrap, language contract, spec focus, action previews, /lang behavior, /specs command, status output, and resume handling.

## Architecture

The module architecture builds temporary workspaces with minimal `package.json` and `src/index.mjs`, injects a stubbed LLMAgent to drive planner outputs, and runs AchillesCLI end-to-end. It verifies that bootstrap runs exactly once and writes `.specs/.ignore` containing defaults like `node_modules`, that `/run generate-summary` produces `.specs/mock/spec-summary.html` without regenerating `.specs/html_docs/index.html`, and that language defaults to English but switches on `/lang` and is reported by `/lang` without args. It confirms plan execution prints spec action previews, `/specs` prints stored sections, `/status` lists log/stat paths with duration buckets, and resume/cancel flows report pending steps. No destructive actions occur beyond creating the `.specs` artifacts in the temp workspace.

## Traceability
- URS: URS-001, URS-002, URS-003, URS-005, URS-007, URS-010
- Requirement: FS-001, FS-002, FS-003, FS-005, FS-008, FS-009, NFS-005, NFS-006

## File Impact
### File: achilles-cli/tests/workflows/achilles-cli.test.mjs

#### Description
Comprehensive scenario suite validating CLI interactions, bootstrap caching, spec action previews, language contract propagation, and status reporting.

## Related Files
- docs/specs/DS/DS-001-achilles-cli.mjs.md
- docs/specs/DS/DS-005-planService.mjs.md
- docs/specs/DS/DS-006-executionHelpers.mjs.md
