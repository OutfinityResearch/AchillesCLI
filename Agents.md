# Agents Working Constraints (Positive)

## Project Context (Achilles CLI)
- Purpose: Achilles CLI is a regulated-software-oriented assistant that manages specifications (URS/FS/NFS/DS), plans tasks via LLM, executes skills, and keeps code/specs in sync. It exposes commands for listing skills, running workflows, viewing specs, setting language/model, debugging, and resuming plans.
- Structure: core runtime in `achilles-cli/` (CLI shell, helpers, GampRSP spec workspace manager); skills in `.AchillesSkills/gamp/` (update-specs, build-code, sync-specs, etc.); specs live in `.specs/` with URS.md, FS.md, NFS.md, DS files; docs under `docs/specs/` with design specs, matrix, loaders, and HTML styling.
- Flow: user interacts via CLI (`achilles-cli.mjs`), which bootstraps `.specs`, registers skills, plans tasks with the LLM (intentionToSkill + plan helpers), executes steps (execution helpers), previews/updates specs (GampRSP + update-specs skill), and can rebuild code/tests from DS file impacts. Memory (global/user/session) is managed via MemoryManager; debugging and language contracts are enforced through helpers. `matrix.html` summarizes requirements and DS/test coverage.

1) Keep specs and code aligned: for any change, update both the DS entry (`docs/specs/DS/...`) and the corresponding implementation so they stay in sync.
2) Document exports richly: in every DS “Exports” section, describe each exported symbol with inputs/outputs, side effects, and concurrency/flow notes; add diagrams as ASCII/text when flows are non-trivial.
3) Prompt guidance: planner/spec prompts must ask for ASCII/text diagrams (not Mermaid) for complex flows and per-export visuals to keep docs readable without extra tooling.
4) Use ASCII diagrams: represent flows/diagrams in plain text code fences; avoid Mermaid since there is no parser available.
5) Matrix organization: keep `docs/specs/matrix.html` listing URS/FS/NFS tables as-is, and DS tables for Global, Core Code, Skills, and Tests with columns (DS ID, Requirements Covered URS/FS/NFS, Coverage, Test Status) and DS IDs clickable to their specs.
6) Categories reference: DS groups—Global (DS-027..031), Core Code (DS-001..019), Skills (.AchillesSkills DS-032..045), Tests (DS-020..026); remember URS/FS/NFS live separately.
7) Editing approach: prefer `apply_patch`, avoid destructive commands unless requested, and keep text ASCII unless the file already uses Unicode.
8) Testing stance: run targeted suites when validation is needed (e.g., spec-management, achilles-cli e2e); tests were not run in this session unless explicitly requested.
9) Narrative docs: prefer subject-and-predicate sentences over bullet lists when generating documentation/specifications; reserve bullets for enum-like data only.
