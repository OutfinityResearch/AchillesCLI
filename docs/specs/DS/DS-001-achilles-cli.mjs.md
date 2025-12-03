# DS-001 – CLI Shell (achilles-cli.mjs)

## Version
- current: v1.0
- timestamp: 1700000003001

## Scope & Intent
CLI entrypoint that wires LLM agent, recursive skill runner, memory, bootstrap, and interactive loop. Exposes commands (/list, /run, /lang, /model, /debug, /specs, /cancel, /resume, /exit) and enforces language contract + plan confirmation.

## Architecture
- Builds AchillesCLI with workspace/specs roots, colors, history, and debug mode.
- Configures GampRSP + LLM logger, initializes memory containers, registers skills from search roots.
- Provides helpers for planning, execution, single-skill runs, spec viewing, and interactive loop startup.

## Traceability
- URS: URS-001, URS-002, URS-007, URS-008, URS-010
- Requirement: FS-001, FS-002, FS-005, FS-008, FS-009

## File Impact
### File: achilles-cli.mjs
Timestamp: 1700000003001

#### Exports
- `AchillesCLI`
- `runFromCommandLine`

#### Dependencies
- node fs/path/process/url
- achillesAgentLib (LLMAgent, RecursiveSkilledAgent, LLMLogger)
- Local helpers: MemoryManager, input/output/plan/bootstrap/skill/debug/spec helpers, GampRSP

#### Description
Creates the CLI object, attaches prompt reader, configures bootstrap and debug, and routes user inputs to planning/execution. Handles cancellation and language contract building.

## Tests
- DS-021 (achilles-cli end-to-end)
- DS-020 (planning CLI)
