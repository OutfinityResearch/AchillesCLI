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
| DS-027 | Global Architecture | Layered runtime overview (CLI, planning, execution, skills, specs, memory) |
| DS-028 | Global Specs & Traceability | Workspace layout, URS/FS/NFS/DS lifecycle, traceability, publishing |
| DS-029 | Global Language & Guidance | Language contract enforcement, guidance injection, model modes |
| DS-030 | Global Bootstrap & Safety Rails | Bootstrap modes/steps, cancellation/resume, warnings |
| DS-031 | Global Testing Conventions | Test harness approach and expectations |
| DS-032 | .AchillesSkills/gamp/utils/specPlanner.mjs | Spec planner utility for actions and execution |
| DS-033 | .AchillesSkills/gamp/update-specs/update-specs.js | LLM-driven spec updates |
| DS-034 | .AchillesSkills/gamp/ignore-files/ignore-files.js | Ignore list management |
| DS-035 | .AchillesSkills/gamp/generate-docs/generate-docs.js | HTML docs generation |
| DS-036 | .AchillesSkills/gamp/build-code/build-code.js | Build code stubs from DS file impact |
| DS-037 | .AchillesSkills/gamp/fix-tests-and-code/fix-tests-and-code.js | Repair code/tests from DS context |
| DS-038 | .AchillesSkills/gamp/reverse-specs/reverse-specs.js | Reverse-engineer specs from code |
| DS-039 | .AchillesSkills/gamp/run-tests/run-tests.js | Run project test suites |
| DS-040 | .AchillesSkills/gamp/spec-review/spec-review.js | Spec review/summary skill |
| DS-041 | .AchillesSkills/gamp/refactor-design/refactor-design.js | Design/refactor spec alignment |
| DS-042 | .AchillesSkills/gamp/generic-skill/generic-skill.js | Generic LLM skill fallback |
| DS-043 | .AchillesSkills/gamp/spec-mentor/spec-mentor.js | Spec mentor/education skill |
| DS-044 | .AchillesSkills/gamp/mock-build/mock-build.js | Spec preview (non-mutating) |
| DS-045 | .AchillesSkills/gamp/spec-help/spec-help.js | Spec help/overview skill |
