# DS-011 – Memory Utilities (helpers/memoryHelpers.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

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
### File: helpers/memoryHelpers.mjs
Timestamp: 1700000003011

#### Exports
- loadMemoryHistory, persistMemory, buildMemoryContext

#### Dependencies
- node fs/path

#### Description
Utility functions used by MemoryManager and execution helpers to expose consistent memory state and persistence routines.

## Tests
- DS-021 (achilles-cli end-to-end)
