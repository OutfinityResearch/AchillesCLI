# DS-013 – Input Handling (helpers/inputHelpers.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

## Scope & Intent
Manage readline lifecycle, history persistence, command completion, keypress handling, raw mode pausing, and multi-line prompt parsing.

## Architecture
- Initializes history file under specs root and updates on prompts.
- Creates readline with completion for CLI commands and skills.
- Provides `readMultiline` with line continuation and command detection.
- Manages global keypresses for cancel/exit and safely pauses handlers while prompting.

## Traceability
- URS: URS-001, URS-002, URS-008, URS-010
- Requirement: FS-002, FS-005, FS-008, NFS-002

## File Impact
### File: achilles-cli/helpers/inputHelpers.mjs
Timestamp: 1700000003013

#### Exports
- initHistory, recordHistory, ensureReadline, askUser, readMultiline
- setupGlobalKeypressHandler, restoreInputMode, withRawModePaused, handleGlobalKeypress

#### Dependencies
- node fs/path/readline/stream

#### Description
Implements user input UX with history, completions, cancellation, and safe raw-mode transitions for interruptible workflows.

## Tests
- DS-021 (achilles-cli end-to-end)
- DS-022 (workspace workflows)
