# DS-001 – CLI Shell (achilles-cli.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-04T10:01:19Z

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
### File: achilles-cli/achilles-cli.mjs

#### Exports
- `AchillesCLI` — main CLI shell that wires LLM agent + logger, recursive skill runner, bootstrap flow, language contract helpers, plan/execute/resume wrappers, spec viewing, memory capture, history + readline handling (including cancellation hotkeys), and interactive loop startup using the configured workspace/specs roots.
- `runFromCommandLine` — parses CLI arguments/environment toggles (skill roots, bootstrap mode, plan confirmation/progress, interactive switch), constructs an `AchillesCLI` instance with those options, and starts the interactive session with fatal error reporting to stderr/exit code.

#### Dependencies
- node fs/path/process/url
- achillesAgentLib (LLMAgent, RecursiveSkilledAgent, LLMLogger)
- Local helpers: MemoryManager, input/output/plan/bootstrap/skill/debug/spec helpers, GampRSP

#### Description
Creates the CLI object, attaches prompt reader, configures bootstrap and debug, and routes user inputs to planning/execution. Handles cancellation and language contract building.

## Tests
- DS-021 (achilles-cli end-to-end)
- DS-020 (planning CLI)
