# DS-030 – Global Bootstrap & Safety Rails

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

## Scope & Intent
Define bootstrap modes/steps and safety behaviors (cancellation, resume, contradiction/scope warnings) across the CLI.

## Architecture
- **Bootstrap**: Modes auto/ask/manual; default step `ignore-files`; cached completion to avoid reruns; logs skips/failures; auto-runs when `.specs` missing.
- **Cancellation**: Ctrl+C/Escape or `/cancel` flags requestCancel; execution loop checks flags per step and preserves pendingPlan state.
- **Resume**: `/continue|/resume [extra]` reloads pending plan, optionally replans with additional instructions, and continues from saved index.
- **Warnings**: Execution prints spec action previews; skills expected to detect scope/contradictions; CLI echoes failed steps and errors; plan confirmation optional.

## Traceability
- URS: URS-002, URS-003, URS-004, URS-006, URS-008
- Requirements: FS-005, FS-006, FS-007, FS-008, NFS-003

## File Impact
- Artifact: Bootstrap and safety policy (no single source file)
- Related files: helpers/bootstrapHelpers.mjs, helpers/planService.mjs, helpers/executionHelpers.mjs, helpers/inputHelpers.mjs

## Tests
- DS-021 (cancel/resume, bootstrap caching), DS-022 (bootstrap workflows)
