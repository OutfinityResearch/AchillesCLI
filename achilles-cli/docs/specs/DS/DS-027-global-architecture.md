# DS-027 – Global Architecture

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

## Scope & Intent
Describe the layered runtime of AchillesCLI: CLI shell, planning/execution pipeline, skill runtime, specs workspace, and memory/logging surfaces.

## Architecture
- **CLI Shell**: `achilles-cli.mjs` instantiates LLM agent, RecursiveSkilledAgent, MemoryManager, and hooks input/output helpers and interactive loop.
- **Planning**: planner prompt builder (`planHelpers`) → intent-to-plan LLM bridge (`intentionToSkill`) → plan lifecycle (`planService`) with confirmation, cancellation, resume.
- **Execution**: skill runner (`executionHelpers`) wraps prompts with language contract, injects context (workspace/specs/memory), and prints previews/results.
- **Skill Runtime**: `skillCatalog` discovers skills under `.AchillesSkills` roots, rebuilds catalog/aliases/subsystems, exposes orchestrators.
- **Specs Workspace**: `GampRSP` ensures `.specs`, manages URS/FS/NFS/DS, ignore list, cache, HTML docs.
- **Memory & Logs**: `MemoryManager` + `.history_*`; LLM logs/stats under `.specs/.llm_logs` and `.llm_stats`; debug mode toggles verbose LLM logging.

## Traceability
- URS: URS-001, URS-002, URS-003, URS-004, URS-008, URS-010
- Requirements: FS-001, FS-002, FS-003, FS-005, FS-007, FS-008, NFS-003, NFS-005

## File Impact
- Artifact: Global architecture overview (no single source file)
- Related files: achilles-cli.mjs, helpers/*, GampRSP.mjs

## Tests
- Covered indirectly via DS-020…DS-026 suites exercising planning, execution, bootstrap, and specs flows.
