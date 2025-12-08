# AchillesCLI Design Specification Map (DS_map)
**ID:** DS-MAP-001

Each source file has a matching DS under `docs/specs/DS/DS-XXX-*.md`. Global DS entries cover shared behaviors (CLI shell, specs workspace, planning, execution, memory, guidance). Tests have DS entries describing coverage and fixtures.

| DS ID | File | Purpose |
|-------|------|---------|
| DS-001 | achilles-cli/achilles-cli.mjs | CLI shell, config, orchestration, commands |
| DS-002 | achilles-cli/GampRSP.mjs | Specs workspace (.specs) creation and HTML docs |
| DS-003 | achilles-cli/intentionToSkill.mjs | Intent-to-plan LLM bridge |
| DS-004 | achilles-cli/helpers/planHelpers.mjs | Plan prompt builder and guidance injection |
| DS-005 | achilles-cli/helpers/planService.mjs | Plan lifecycle, resume, execute |
| DS-006 | achilles-cli/helpers/executionHelpers.mjs | Skill execution, formatting, previews |
| DS-007 | achilles-cli/helpers/skillCatalog.mjs | Skill discovery/registration |
| DS-008 | achilles-cli/helpers/bootstrapHelpers.mjs | Auto-bootstrap steps |
| DS-009 | achilles-cli/helpers/specDocumentHelpers.mjs | Spec resolution, summaries |
| DS-010 | achilles-cli/helpers/MemoryManager.mjs | Memory routing/persistence |
| DS-011 | achilles-cli/helpers/memoryHelpers.mjs | Memory utilities/context shaping |
| DS-012 | achilles-cli/helpers/debugHelpers.mjs | Debug wiring for LLM logging |
| DS-013 | achilles-cli/helpers/inputHelpers.mjs | Readline, history, key handling |
| DS-014 | achilles-cli/helpers/interactiveLoop.mjs | CLI loop and command handling |
| DS-015 | achilles-cli/helpers/cliUtils.mjs | Utility parsing (truthy, arrays, plan parsing) |
| DS-016 | achilles-cli/helpers/styles.mjs | Color/style constants |
| DS-017 | achilles-cli/helpers/outputHelpers.mjs | Help/status output rendering |
| DS-018 | achilles-cli/helpers/specGuidance.mjs | Spec guidance text injection |
| DS-019 | achilles-cli/helpers/PromptManager.mjs | Prompt helpers (placeholder) |
| DS-020 | achilles-cli/tests/cliPlanning.test.mjs | Planner CLI tests |
| DS-021 | achilles-cli/tests/gamp/achilles-cli.test.mjs | End-to-end CLI + specs tests |
| DS-022 | achilles-cli/tests/gamp/workspace-workflows.test.mjs | Workspace workflow tests |
| DS-023 | achilles-cli/tests/gamp/spec-management.test.mjs | Spec management tests |
| DS-024 | achilles-cli/tests/gamp/refactor-design.test.mjs | Refactor/design tests |
| DS-025 | achilles-cli/tests/gamp/generic-skill.test.mjs | Generic skill behavior tests |
| DS-026 | achilles-cli/tests/gamp/spec-mentor.test.mjs | Spec mentor tests |
| DS-027 | Global Architecture | Layered runtime overview (CLI, planning, execution, skills, specs, memory) |
| DS-028 | Global Specs & Traceability | Workspace layout, URS/FS/NFS/DS lifecycle, traceability, publishing |
| DS-029 | Global Language & Guidance | Language contract enforcement, guidance injection, model modes |
| DS-030 | Global Bootstrap & Safety Rails | Bootstrap modes/steps, cancellation/resume, warnings |
| DS-031 | Global Testing Conventions | Test harness approach and expectations |
| DS-032 | achilles-cli/.AchillesSkills/gamp/utils/specPlanner.mjs | Spec planner utility for actions and execution |
| DS-033 | achilles-cli/.AchillesSkills/gamp/update-specs/update-specs.js | LLM-driven spec updates |
| DS-034 | achilles-cli/.AchillesSkills/gamp/ignore-files/ignore-files.js | Ignore list management |
| DS-035 | achilles-cli/.AchillesSkills/gamp/generate-docs/generate-docs.js | HTML docs generation |
| DS-036 | achilles-cli/.AchillesSkills/gamp/build-code/build-code.js | Build code stubs from DS file impact |
| DS-037 | achilles-cli/.AchillesSkills/gamp/fix-tests-and-code/fix-tests-and-code.js | Repair code/tests from DS context |
| DS-038 | achilles-cli/.AchillesSkills/gamp/sync-specs/sync-specs.js | Sync specs from code to documentation |
| DS-039 | achilles-cli/.AchillesSkills/gamp/run-tests/run-tests.js | Run project test suites |
| DS-040 | achilles-cli/.AchillesSkills/gamp/spec-review/spec-review.js | Spec review/summary skill |
| DS-041 | achilles-cli/.AchillesSkills/gamp/refactor-design/refactor-design.js | Design/refactor spec alignment |
| DS-042 | achilles-cli/.AchillesSkills/gamp/generic-skill/generic-skill.js | Generic LLM skill fallback |
| DS-043 | achilles-cli/.AchillesSkills/gamp/spec-mentor/spec-mentor.js | Spec mentor/education skill |
| DS-044 | achilles-cli/.AchillesSkills/gamp/mock-build/mock-build.js | Spec preview (non-mutating) |
| DS-045 | achilles-cli/.AchillesSkills/gamp/spec-help/spec-help.js | Spec help/overview skill |
