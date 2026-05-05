# AGENTS.md

## Scope
This file defines repository-level guidance for contributors and agents working in AchillesCLI. DS specifications under `docs/specs/` are the contract authority.

## Mandatory Reading Order
1. `docs/specs/DS000-vision.md`
2. `docs/specs/DS001-coding-style.md`
3. `docs/specs/DS002-llm-model-strategy.md`
4. `docs/specs/DS003-global-architecture.md`
5. `docs/specs/DS004-entrypoint-runtime-bootstrap.md`
6. `docs/specs/DS005-repl-and-command-processing.md`
7. `docs/specs/DS006-ui-system.md`
8. `docs/specs/DS007-skills-runtime-and-builtins.md`
9. `docs/specs/DS008-schemas-and-skill-doc-contract.md`
10. `docs/specs/DS009-testing-observability-and-ops.md`
11. `docs/specs/DS010-ecosystem-integration.md`
12. `docs/specs/matrix.md`
13. `docs/index.html`

## Current Skill Catalog
- `.agents/skills/gamp_specs`
- `.agents/skills/achilles_specs`
- `.agents/skills/review_specs`
- `.agents/skills/article_build`
- `.agents/skills/cskill_build`
- `.agents/skills/dgskill_build`
- `.agents/skills/oskill_build`
- `.agents/skills/antropic_skill_build`

## Repository Rules
- Persistent docs/specs/comments are in English.
- `DS001-coding-style.md` is the coding-style authority.
- DS numbering remains contiguous with no gaps.
- DS files use direct contract language and do not use Q&A sections.
- When runtime behavior changes, update DS files and HTML docs together.
- Keep Achilles runtime helper examples in `.agents/skills/achilles_specs/examples/`.
- AchillesAgentLib integration is authorized and must keep manual override support for runtime configuration.
- LLM calls must be routed through `LLMAgent`/runtime configuration paths.
- Keep downstream docs focused on host behavior, not standalone copied-skill marketing pages.

## Runtime Defaults
- Runtime configuration supports environment defaults and manual overrides.
- Achilles integration contract is defined in `docs/specs/DS010-ecosystem-integration.md`.
- Model-tier and session model controls are defined in `docs/specs/DS002-llm-model-strategy.md`.

## Key Paths
- HTML docs: `docs/index.html`
- Specs loader: `docs/specsLoader.html?spec=matrix.md`
- Specs directory: `docs/specs/`
- Coding style authority: `docs/specs/DS001-coding-style.md`
- Global architecture: `docs/specs/DS003-global-architecture.md`
