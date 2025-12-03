# DS-012 – Debug Helpers (helpers/debugHelpers.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

## Scope & Intent
Wire LLM agent debug logging and propagate debug mode between CLI and agent.

## Architecture
- `setupLLMDebugging` detects if agent supports debug and toggles based on CLI flag.
- Writes status messages for visibility.

## Traceability
- URS: URS-001, URS-010
- Requirement: FS-002, FS-008, NFS-005

## File Impact
### File: helpers/debugHelpers.mjs
Timestamp: 1700000003012

#### Exports
- setupLLMDebugging

#### Dependencies
- none beyond cli.llmAgent interface

#### Description
Small helper to keep CLI debug mode consistent with underlying LLM agent capability.

## Tests
- DS-021 (achilles-cli end-to-end)
