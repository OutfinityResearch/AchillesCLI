# DS-011 – Memory Utilities (helpers/memoryHelpers.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-04T10:01:19Z

## Scope & Intent
Lightweight helpers for loading/persisting memory histories and building memory context payloads for skill execution.

## Architecture
- Loads history JSON files if present.
- Persists memory containers safely with error suppression.
- Builds context object combining global/user/session memories.

## Traceability
- URS: URS-002, URS-007
- Requirement: FS-005, FS-009

## File Impact
### File: achilles-cli/helpers/memoryHelpers.mjs
Timestamp: 1700000003011

#### Exports
- `loadMemoryHistory(cli, key)` — reads `.history_<key>` JSON from the specs root, returning the history array or an empty list on absence/parse errors.
- `persistMemory(container, key)` — safely persists a `MemoryContainer` by calling `saveContext(key)` while suppressing persistence failures.
- `buildMemoryContext(cli)` — snapshots global/user/session memory contexts into a single object fed to skills/LLM calls.

#### Dependencies
- node fs/path

#### Description
Utility functions used by MemoryManager and execution helpers to expose consistent memory state and persistence routines.

## Tests
- DS-021 (achilles-cli end-to-end)
