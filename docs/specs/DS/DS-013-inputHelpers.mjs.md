# DS-013 – Input Handling (helpers/inputHelpers.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-04T11:33:47Z

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
- `initHistory(cli)` / `recordHistory(cli, entry)` — bootstrap `.prompts_history` under the specs root, preload entries into memory/readline, append deduped history, and persist with a rolling cap.
- `ensureReadline(cli)` — constructs a readline instance (single-use per session) with command/skill completions, history snapshot, filtered output stream (strips webchat envelopes), and close cleanup.
- `setupGlobalKeypressHandler(cli, handler)` / `restoreInputMode(cli)` / `handleGlobalKeypress(cli, _, key)` / `withRawModePaused(cli, fn)` — install global key listeners (Ctrl+C/Escape), toggle raw mode safely, route cancel/exit intents, and provide a helper to temporarily pause raw mode while prompting.
- `askUser(cli, message)` — single-line prompt using shared readline, preserving history and raw-mode safety.
- `readMultiline(cli, initialPrompt, continuationPrompt)` — gathers multi-line input with continuation prompts, detects leading slash commands to short-circuit, and records history when appropriate.
  Diagram (ASCII):
  ```
  [initial prompt]
        |
        v
  promptReader -> line
        |
   starts with "/"?
    |          |
   yes        no
    |          |
 return {command}  empty line?
                 |           |
                yes         no
                 |           |
     expecting continuation?  append line
        |            |             |
       yes          no             v
        |            |      line ends with "\"?
     push ""        return {}       |       |
       |                            yes    no
       v                             |      |
   next prompt                  set continuation
                                    |
                                    v
                               next prompt
                                ...
                          finish -> return {text}
  ```

#### Dependencies
- node fs/path/readline/stream

#### Description
Implements user input UX with history, completions, cancellation, and safe raw-mode transitions for interruptible workflows.

## Tests
- DS-021 (achilles-cli end-to-end)
- DS-022 (workspace workflows)
