# DS-010 – Memory Manager (helpers/MemoryManager.mjs)

## Version
- current: v1.0
- timestamp: 1700000003010

## Scope & Intent
Wrap achillesAgentLib MemoryContainer to maintain global, user, and session memories; route interactions via LLM to decide persistence.

## Architecture
- Initializes containers with history files (`.history_global`, `.history_user`).
- Provides `capture` to summarize executions and classify storage via LLM prompt.
- Persists contexts when routing decisions allow; default stores summaries in session when routing fails.

## Traceability
- URS: URS-002, URS-007, URS-008
- Requirement: FS-005, FS-009

## File Impact
### File: helpers/MemoryManager.mjs
Timestamp: 1700000003010

#### Exports
- default MemoryManager class

#### Dependencies
- node fs/path
- achillesAgentLib/MemoryContainer

#### Description
Centralizes memory handling, ensuring histories survive across sessions and language contracts/memory context are available to skills.

## Tests
- DS-021 (achilles-cli end-to-end)
