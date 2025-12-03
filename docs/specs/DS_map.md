# AchillesCLI Design Specification Map (DS_map)
**ID:** DS-MAP-001

Each source file has a matching DS under `docs/specs/DS/DS-XXX-*.md`. Global DS entries cover shared behaviors (CLI shell, specs workspace, planning, execution, memory, guidance). Tests have DS entries describing coverage and fixtures.

| DS ID | File | Purpose |
|-------|------|---------|
| DS-001 | achilles-cli.mjs | CLI shell, config, orchestration, commands |
| DS-002 | GampRSP.mjs | Specs workspace (.specs) creation and HTML docs |
| DS-003 | intentionToSkill.mjs | Intent-to-plan LLM bridge |
| DS-004 | helpers/planHelpers.mjs | Plan prompt builder and guidance injection |
| DS-005 | helpers/planService.mjs | Plan lifecycle, resume, execute |
| DS-006 | helpers/executionHelpers.mjs | Skill execution, formatting, previews |
| DS-007 | helpers/skillCatalog.mjs | Skill discovery/registration |
| DS-008 | helpers/bootstrapHelpers.mjs | Auto-bootstrap steps |
| DS-009 | helpers/specDocumentHelpers.mjs | Spec resolution, summaries |
| DS-010 | helpers/MemoryManager.mjs | Memory routing/persistence |
| DS-011 | helpers/memoryHelpers.mjs | Memory utilities/context shaping |
| DS-012 | helpers/debugHelpers.mjs | Debug wiring for LLM logging |
| DS-013 | helpers/inputHelpers.mjs | Readline, history, key handling |
| DS-014 | helpers/interactiveLoop.mjs | CLI loop and command handling |
| DS-015 | helpers/cliUtils.mjs | Utility parsing (truthy, arrays, plan parsing) |
| DS-016 | helpers/styles.mjs | Color/style constants |
| DS-017 | helpers/outputHelpers.mjs | Help/status output rendering |
| DS-018 | helpers/specGuidance.mjs | Spec guidance text injection |
| DS-019 | helpers/PromptManager.mjs | Prompt helpers (placeholder) |
| DS-020 | tests/cliPlanning.test.mjs | Planner CLI tests |
| DS-021 | tests/gamp/achilles-cli.test.mjs | End-to-end CLI + specs tests |
| DS-022 | tests/gamp/workspace-workflows.test.mjs | Workspace workflow tests |
| DS-023 | tests/gamp/spec-management.test.mjs | Spec management tests |
| DS-024 | tests/gamp/refactor-design.test.mjs | Refactor/design tests |
| DS-025 | tests/gamp/generic-skill.test.mjs | Generic skill behavior tests |
| DS-026 | tests/gamp/spec-mentor.test.mjs | Spec mentor tests |
