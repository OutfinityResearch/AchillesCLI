# DS-021 – Tests: gamp/achilles-cli.test.mjs

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

## Scope & Intent
End-to-end CLI tests covering bootstrap, language contract, spec focus, action previews, /lang behavior, /specs command, status output, and resume handling.

## Architecture
- Creates temp workspaces and simulates LLMAgent + recursiveAgent to control planning/execution.
- Asserts bootstrap only runs once, specs preview generation, language enforcement, and resume/cancel flows.
- Checks status output for log/stat paths and duration buckets.

## Traceability
- URS: URS-001, URS-002, URS-003, URS-005, URS-007, URS-010
- Requirement: FS-001, FS-002, FS-003, FS-005, FS-008, FS-009, NFS-005, NFS-006

## File Impact
### File: achilles-cli/tests/gamp/achilles-cli.test.mjs
Timestamp: 1700000003021

#### Description
Comprehensive scenario suite validating CLI interactions, bootstrap caching, spec action previews, language contract propagation, and status reporting.

## Related Files
- docs/specs/DS/DS-001-achilles-cli.mjs.md
- docs/specs/DS/DS-005-planService.mjs.md
- docs/specs/DS/DS-006-executionHelpers.mjs.md
