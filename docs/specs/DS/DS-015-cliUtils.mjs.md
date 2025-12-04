# DS-015 – CLI Utilities (helpers/cliUtils.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

## Scope & Intent
Utility helpers for truthy parsing, array coercion, skill implementation detection, and plan parsing from various shapes.

## Architecture
- Provides `isTruthy`, `ensureArray` for env/arg parsing.
- Detects skill implementation type by inspecting skill directory contents.
- Parses planner output (array/object/string) into normalized plan steps.

## Traceability
- URS: URS-001, URS-008
- Requirement: FS-001, FS-008

## File Impact
### File: achilles-cli/helpers/cliUtils.mjs
Timestamp: 1700000003015

#### Exports
- isTruthy, ensureArray, detectImplementation, parsePlan

#### Dependencies
- node fs

#### Description
Lightweight utilities used across CLI setup, skill listing, and planner parsing.

## Tests
- DS-020 (planner CLI)
- DS-025 (generic skill)
