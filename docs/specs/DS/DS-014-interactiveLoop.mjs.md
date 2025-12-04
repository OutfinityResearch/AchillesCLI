# DS-014 – Interactive Loop (helpers/interactiveLoop.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-04T11:33:47Z

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

#### Exports
- `runInteractiveLoop(cli)` — REPL controller: prints banner/debug status, loops on `readMultiline`, routes slash-commands via `handleCommand`, detects resume intents, prepares plans, prints plans, optionally asks for execution confirmation, runs plans with progress, prints executions, and captures memory; always restores input mode on exit.
  Diagram (ASCII):
  ```
  banner -> readMultiline
              |
        command entered?
         |           |
        yes         no
         |           |
   handleCommand   resume intent?
         |           |        |
   should exit?     yes      no
     |       \       |        |
    yes      no   resume    preparePlan
     |        |     |           |
  restore   loop   loop     plan empty?
 input + exit         |        |
                      |      yes -> loop
                      |      no
                      |       |
                      |    printPlan
                      |       |
                 need confirm?
                 |          |
               decline    run executePlan + printExecutions
                              |
                        captureMemoryEntry
                              |
                             loop
  ```

#### Dependencies
- helpers/executionHelpers.mjs

#### Description
Main REPL controller coordinating user interaction, command dispatch, plan execution, and memory capture.

## Tests
- DS-021 (achilles-cli end-to-end)
