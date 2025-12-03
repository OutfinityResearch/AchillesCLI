# DS-031 – Global Testing Conventions

## Version
- current: v1.0
- timestamp: 1700000003031

## Scope & Intent
Document current automated test conventions for AchillesCLI and expectations for future suites.

## Architecture
- **Runner**: node:test-based suites under `tests/` (including `tests/gamp/*`); temporary workspaces created per suite; simulated LLMAgent/skills.
- **Coverage focus**: bootstrap behavior, language contract propagation, spec action previews, status output, planner failures, resume/cancel flows.
- **Fixtures**: temp dirs under `tests/.tmp/*`, package stubs, and mock skill/planner responses to isolate CLI logic from real skills.
- **Future**: extend with real skill packs and integration against achillesAgentLib; keep deterministic mocks for unit-level coverage.

## Traceability
- URS: URS-003, URS-004, URS-005, URS-009, URS-010
- Requirements: FS-003, FS-004, FS-007, FS-008, FS-010, NFS-003, NFS-005

## File Impact
- Artifact: Testing conventions (no single source file)
- Related files: tests/cliPlanning.test.mjs, tests/gamp/*

## Tests
- Meta-level description; realized by DS-020…DS-026.
