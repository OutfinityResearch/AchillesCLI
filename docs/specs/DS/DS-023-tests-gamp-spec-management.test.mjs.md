# DS-023 – Tests: skills/workflows/spec-management.test.mjs

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

## Scope & Intent
Exercise specification management workflows (updates, summaries, HTML generation) via mocked skills and planners.

## Architecture

The module architecture drives `update-specs`, `sync-specs`, and `build-code` via stubbed plan steps in a temporary workspace and inspects the resulting artifacts. It checks that `update-specs` creates URS/FS/DS entries in `.specs/URS.md`, `.specs/FS.md`, and `.specs/DS/DS-###.md` with the planned titles, that `sync-specs` brings source files into DS coverage and writes DS content mentioning those paths, and that `build-code` generates source files from DS file-impact sections. It also verifies that HTML documentation is produced (non-empty `.specs/html_docs/index.html`) and that the ignore list is maintained. Each assertion is tied to a file on disk (presence and expected content).

## Traceability
- URS: URS-003, URS-004, URS-005
- Requirement: FS-003, FS-004, FS-007, FS-010

## File Impact
### File: achilles-cli/tests/workflows/spec-management.test.mjs

#### Description
Ensures spec actions create/summary documents correctly and HTML docs are generated and discoverable.

## Related Files
- docs/specs/DS/DS-002-GampRSP.mjs.md
- docs/specs/DS/DS-006-executionHelpers.mjs.md
