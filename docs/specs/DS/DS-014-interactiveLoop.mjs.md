# DS-014 – Interactive Loop (helpers/interactiveLoop.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

## Scope & Intent
Drive the CLI REPL: parse commands, route to handlers, trigger planning/execution, and manage exit conditions.

## Architecture
- `runInteractiveLoop` prints banner, reads multiline input, detects commands vs free text.
- Handles commands (/list, /continue|/resume, /help, /status, /debug, /model, /lang, /specs, /run, /cancel, /exit).
- Performs planning, prints plan, optionally asks for confirmation, executes plan, records memory.

## Traceability
- URS: URS-001, URS-002, URS-008, URS-010
- Requirement: FS-002, FS-005, FS-008

## File Impact
### File: achilles-cli/helpers/interactiveLoop.mjs
Timestamp: 1700000003014

#### Exports
- runInteractiveLoop

#### Dependencies
- helpers/executionHelpers.mjs

#### Description
Main REPL controller coordinating user interaction, command dispatch, plan execution, and memory capture.

## Tests
- DS-021 (achilles-cli end-to-end)
