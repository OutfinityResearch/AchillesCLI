# DS-019 – Prompt Manager (helpers/PromptManager.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

## Scope & Intent
Standalone prompt/history manager with readline, multiline input, envelope filtering, and history persistence; an alternative to inputHelpers for prompt collection.

## Architecture
- Loads/writes `.prompts_history` under specs root with capped entries.
- Provides filtered stdout writer to hide structured envelopes.
- Supports multiline reads with continuations and command detection; records history entries.

## Traceability
- URS: URS-001, URS-010
- Requirement: FS-002

## File Impact
### File: helpers/PromptManager.mjs
Timestamp: 1700000003019

#### Exports
- `PromptManager`

#### Dependencies
- node fs/path/readline/stream

#### Description
Implements prompt capture utilities usable when CLI needs a dedicated manager outside the main inputHelpers flow.

## Tests
- No dedicated automated tests; covered indirectly by CLI behavior.
