# DS-016 – Styles (helpers/styles.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

## Scope & Intent
Provide ANSI color constants for consistent CLI output (info, warn, error, debug, reset).

## Architecture
- Exports color escape codes used across helpers for user-facing messages.

## Traceability
- URS: URS-010
- Requirement: FS-008, NFS-005

## File Impact
### File: achilles-cli/helpers/styles.mjs
Timestamp: 1700000003016

#### Exports
- COLOR_RESET, COLOR_INFO, COLOR_WARN, COLOR_ERROR, COLOR_DEBUG

#### Dependencies
- none

#### Description
Central palette for CLI message formatting.

## Tests
- DS-021 (achilles-cli end-to-end)
