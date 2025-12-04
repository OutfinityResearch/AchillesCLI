# DS-012 – Debug Helpers (helpers/debugHelpers.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-04T10:01:19Z

## Scope & Intent
Wire LLM agent debug logging and propagate debug mode between CLI and agent.

## Architecture
- `setupLLMDebugging` detects if agent supports debug and toggles based on CLI flag.
- Writes status messages for visibility.

## Traceability
- URS: URS-001, URS-010
- Requirement: FS-002, FS-008, NFS-005

## File Impact
### File: achilles-cli/helpers/debugHelpers.mjs
Timestamp: 1700000003012

#### Exports
- `setupLLMDebugging(cli)` — detects whether the LLM agent supports debug hooks, wires a structured logger for request/response/error events (including prompts/history length), propagates the CLI debug flag via `setDebugEnabled`, and wraps `llmAgent.complete` to surface debug lines when supported.

#### Dependencies
- none beyond cli.llmAgent interface

#### Description
Small helper to keep CLI debug mode consistent with underlying LLM agent capability.

## Tests
- DS-021 (achilles-cli end-to-end)
