# DS-019 – Prompt Manager (helpers/PromptManager.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-04T10:01:19Z

## Scope & Intent
Standalone prompt/history manager with readline, multiline input, envelope filtering, and history persistence; an alternative to inputHelpers for prompt collection.

## Architecture

The module architecture loads/writes `.prompts_history` under specs root with capped entries. It provides filtered stdout writer to hide structured envelopes. It supports multiline reads with continuations and command detection; records history entries.

## Traceability
- URS: URS-001, URS-010
- Requirement: FS-002

## File Impact
### File: achilles-cli/helpers/PromptManager.mjs

#### Exports
- `PromptManager` (class) — encapsulates prompt capture outside the main CLI loop: loads and saves `.prompts_history` (capped to 200 entries), filters stdout to drop envelope noise, provisions readline with history, exposes `ask(message)` and `readMultiline(initial, continuation)` for single/multi-line input with command detection, `record(entry)` to append history, and `close()` to release readline/streams.

#### Dependencies
- node fs/path/readline/stream

#### Description
Implements prompt capture utilities usable when CLI needs a dedicated manager outside the main inputHelpers flow.

## Tests
- No dedicated automated tests; covered indirectly by CLI behavior.
