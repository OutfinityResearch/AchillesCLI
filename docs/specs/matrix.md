# AchillesCLI Specification Matrix

::: summary Test Results Summary
- [[status:passed]] **Passed:** 0
- [[status:failed]] **Failed:** 0
- [[status:partial]] **Partial:** 0
- [[status:unknown]] **Unknown / Not Run:** 45
- _Last run: not recorded (run tests to update)_
:::

::: legend Legend
- [[status:passed]] Passed
- [[status:failed]] Failed
- [[status:partial]] Partial
- [[status:unknown]] Unknown
:::

## Requirement Specifications (URS / FS / NFS)

### User Requirements (URS)
| Requirement | Title |
| --- | --- |
| [URS-001](specsLoader.html?spec=URS.md#URS-001) | Terminal LLM spec assistant |
| [URS-002](specsLoader.html?spec=URS.md#URS-002) | Session resumption |
| [URS-003](specsLoader.html?spec=URS.md#URS-003) | Spec relationship guardrails |
| [URS-004](specsLoader.html?spec=URS.md#URS-004) | Auto-updating specifications |
| [URS-005](specsLoader.html?spec=URS.md#URS-005) | DS coverage global & per file |
| [URS-006](specsLoader.html?spec=URS.md#URS-006) | Contradiction detection |
| [URS-007](specsLoader.html?spec=URS.md#URS-007) | Language preference |
| [URS-008](specsLoader.html?spec=URS.md#URS-008) | Skillful automation |
| [URS-009](specsLoader.html?spec=URS.md#URS-009) | Safety net for code recovery |
| [URS-010](specsLoader.html?spec=URS.md#URS-010) | Operator controls |

### Functional Specification (FS)
| FS | Summary |
| --- | --- |
| [FS-001](specsLoader.html?spec=FS.md#FS-001) | LLM planning & skills orchestration |
| [FS-002](specsLoader.html?spec=FS.md#FS-002) | Interactive & non-interactive CLI loop |
| [FS-003](specsLoader.html?spec=FS.md#FS-003) | Spec relationship management |
| [FS-004](specsLoader.html?spec=FS.md#FS-004) | DS coverage (global & per file) |
| [FS-005](specsLoader.html?spec=FS.md#FS-005) | Session memory & resume |
| [FS-006](specsLoader.html?spec=FS.md#FS-006) | Contradiction & scope warnings |
| [FS-007](specsLoader.html?spec=FS.md#FS-007) | Auto-updates & bootstrap |
| [FS-008](specsLoader.html?spec=FS.md#FS-008) | CLI command set |
| [FS-009](specsLoader.html?spec=FS.md#FS-009) | Language preference enforcement |
| [FS-010](specsLoader.html?spec=FS.md#FS-010) | Spec-based code recovery path |

### Non-Functional Specification (NFS)
| NFS | Title |
| --- | --- |
| [NFS-001](specsLoader.html?spec=NFS.md#NFS-001) | Deterministic spec updates |
| [NFS-002](specsLoader.html?spec=NFS.md#NFS-002) | Performance for REPL use |
| [NFS-003](specsLoader.html?spec=NFS.md#NFS-003) | Reliability & recovery |
| [NFS-004](specsLoader.html?spec=NFS.md#NFS-004) | Security & isolation |
| [NFS-005](specsLoader.html?spec=NFS.md#NFS-005) | Observability & debuggability |
| [NFS-006](specsLoader.html?spec=NFS.md#NFS-006) | Language compliance |

## Design Specs – Global
| DS ID | Requirements Covered (URS / FS / NFS) | Coverage | Test Status |
| --- | --- | --- | --- |
| [DS-027](specsLoader.html?spec=DS/DS-027-global-architecture.md) Global Architecture | URS: 001, 002, 003, 004, 008, 010; FS: 001, 002, 003, 005, 007, 008 | [[coverage:full]] | [[status:unknown]] |
| [DS-028](specsLoader.html?spec=DS/DS-028-global-specs-traceability.md) Global Specs & Traceability | URS: 003, 004, 005, 009; FS: 003, 004, 007, 010 | [[coverage:full]] | [[status:unknown]] |
| [DS-029](specsLoader.html?spec=DS/DS-029-global-language-guidance.md) Language & Guidance | URS: 001, 007, 010; FS: 001, 008, 009 | [[coverage:full]] | [[status:unknown]] |
| [DS-030](specsLoader.html?spec=DS/DS-030-global-bootstrap-safety.md) Bootstrap & Safety | URS: 002, 003, 004, 006, 008; FS: 005, 006, 007, 008 | [[coverage:full]] | [[status:unknown]] |
| [DS-031](specsLoader.html?spec=DS/DS-031-global-testing.md) Global Testing | URS: 003, 004, 005, 009, 010; FS: 003, 004, 007, 008, 010 | [[coverage:partial]] | [[status:unknown]] |

## Design Specs – Core Code
| DS ID | Requirements Covered (URS / FS / NFS) | Coverage | Test Status |
| --- | --- | --- | --- |
| [DS-001](specsLoader.html?spec=DS/DS-001-achilles-cli.mjs.md) achilles-cli.mjs | URS: 001, 002, 007, 008, 010; FS: 001, 002, 005, 008, 009 | [[coverage:full]] | [[status:unknown]] |
| [DS-002](specsLoader.html?spec=DS/DS-002-GampRSP.mjs.md) GampRSP.mjs | URS: 003, 004, 005, 009; FS: 003, 004, 007, 010 | [[coverage:full]] | [[status:unknown]] |
| [DS-003](specsLoader.html?spec=DS/DS-003-intentionToSkill.mjs.md) intentionToSkill.mjs | URS: 001, 008; FS: 001 | [[coverage:full]] | [[status:unknown]] |
| [DS-004](specsLoader.html?spec=DS/DS-004-planHelpers.mjs.md) helpers/planHelpers.mjs | URS: 001, 003; FS: 001, 003 | [[coverage:full]] | [[status:unknown]] |
| [DS-005](specsLoader.html?spec=DS/DS-005-planService.mjs.md) helpers/planService.mjs | URS: 002, 003, 004, 008; FS: 001, 005, 006, 008 | [[coverage:full]] | [[status:unknown]] |
| [DS-006](specsLoader.html?spec=DS/DS-006-executionHelpers.mjs.md) helpers/executionHelpers.mjs | URS: 001, 003, 007, 008, 010; FS: 001, 003, 006, 008, 009 | [[coverage:full]] | [[status:unknown]] |
| [DS-007](specsLoader.html?spec=DS/DS-007-skillCatalog.mjs.md) helpers/skillCatalog.mjs | URS: 001, 008; FS: 001, 008 | [[coverage:full]] | [[status:unknown]] |
| [DS-008](specsLoader.html?spec=DS/DS-008-bootstrapHelpers.mjs.md) helpers/bootstrapHelpers.mjs | URS: 004, 009; FS: 007 | [[coverage:full]] | [[status:unknown]] |
| [DS-009](specsLoader.html?spec=DS/DS-009-specDocumentHelpers.mjs.md) helpers/specDocumentHelpers.mjs | URS: 003, 004, 005; FS: 003, 004, 008 | [[coverage:full]] | [[status:unknown]] |
| [DS-010](specsLoader.html?spec=DS/DS-010-MemoryManager.mjs.md) helpers/MemoryManager.mjs | URS: 002, 007, 008; FS: 005, 009 | [[coverage:full]] | [[status:unknown]] |
| [DS-011](specsLoader.html?spec=DS/DS-011-memoryHelpers.mjs.md) helpers/memoryHelpers.mjs | URS: 002, 007; FS: 005, 009 | [[coverage:full]] | [[status:unknown]] |
| [DS-012](specsLoader.html?spec=DS/DS-012-debugHelpers.mjs.md) helpers/debugHelpers.mjs | URS: 001, 010; FS: 002, 008 | [[coverage:full]] | [[status:unknown]] |
| [DS-013](specsLoader.html?spec=DS/DS-013-inputHelpers.mjs.md) helpers/inputHelpers.mjs | URS: 001, 002, 008, 010; FS: 002, 005, 008 | [[coverage:full]] | [[status:unknown]] |
| [DS-014](specsLoader.html?spec=DS/DS-014-interactiveLoop.mjs.md) helpers/interactiveLoop.mjs | URS: 001, 002, 008, 010; FS: 002, 005, 008 | [[coverage:full]] | [[status:unknown]] |
| [DS-015](specsLoader.html?spec=DS/DS-015-cliUtils.mjs.md) helpers/cliUtils.mjs | URS: 001, 008; FS: 001, 008 | [[coverage:full]] | [[status:unknown]] |
| [DS-016](specsLoader.html?spec=DS/DS-016-styles.mjs.md) helpers/styles.mjs | URS: 010; FS: 008 | [[coverage:full]] | [[status:unknown]] |
| [DS-017](specsLoader.html?spec=DS/DS-017-outputHelpers.mjs.md) helpers/outputHelpers.mjs | URS: 010; FS: 008 | [[coverage:full]] | [[status:unknown]] |
| [DS-018](specsLoader.html?spec=DS/DS-018-specGuidance.mjs.md) helpers/specGuidance.mjs | URS: 003, 004, 009; FS: 001, 003, 010 | [[coverage:full]] | [[status:unknown]] |
| [DS-019](specsLoader.html?spec=DS/DS-019-PromptManager.mjs.md) helpers/PromptManager.mjs | URS: 001, 010; FS: 002 | [[coverage:full]] | [[status:unknown]] |

## Design Specs – Skills (.AchillesSkills)
| DS ID | Requirements Covered (URS / FS / NFS) | Coverage | Test Status |
| --- | --- | --- | --- |
| [DS-032](specsLoader.html?spec=DS/DS-032-specPlanner.mjs.md) specPlanner.mjs | URS: 003, 004, 005; FS: 003, 004, 010 | [[coverage:full]] | [[status:unknown]] |
| [DS-033](specsLoader.html?spec=DS/DS-033-update-specs.md) update-specs.js | URS: 003, 004, 005, 009; FS: 003, 004, 010 | [[coverage:full]] | [[status:unknown]] |
| [DS-034](specsLoader.html?spec=DS/DS-034-ignore-files.md) ignore-files.js | URS: 003, 004; FS: 007 | [[coverage:full]] | [[status:unknown]] |
| [DS-035](specsLoader.html?spec=DS/DS-035-generate-docs.md) generate-docs.js | URS: 003, 004, 005; FS: 003, 007, 010 | [[coverage:full]] | [[status:unknown]] |
| [DS-036](specsLoader.html?spec=DS/DS-036-build-code.md) build-code.js | URS: 005, 009; FS: 004, 010 | [[coverage:full]] | [[status:unknown]] |
| [DS-037](specsLoader.html?spec=DS/DS-037-fix-tests-and-code.md) fix-tests-and-code.js | URS: 005, 009; FS: 004, 010 | [[coverage:full]] | [[status:unknown]] |
| [DS-038](specsLoader.html?spec=DS/DS-038-sync-specs.md) sync-specs.js | URS: 009; FS: 004, 010 | [[coverage:partial]] | [[status:unknown]] |
| [DS-039](specsLoader.html?spec=DS/DS-039-run-tests.md) run-tests.js | URS: 009; FS: 004, 010 | [[coverage:partial]] | [[status:unknown]] |
| [DS-040](specsLoader.html?spec=DS/DS-040-spec-review.md) spec-review.js | URS: 003, 004, 005; FS: 003, 004, 010 | [[coverage:full]] | [[status:unknown]] |
| [DS-041](specsLoader.html?spec=DS/DS-041-refactor-design.md) refactor-design.js | URS: 005, 009; FS: 003, 004, 010 | [[coverage:full]] | [[status:unknown]] |
| [DS-042](specsLoader.html?spec=DS/DS-042-generic-skill.md) generic-skill.js | URS: 001, 008; FS: 001 | [[coverage:full]] | [[status:unknown]] |
| [DS-043](specsLoader.html?spec=DS/DS-043-spec-mentor.md) spec-mentor.js | URS: 003, 004, 005; FS: 003, 004, 010 | [[coverage:full]] | [[status:unknown]] |
| [DS-044](specsLoader.html?spec=DS/DS-044-generate-summary.md) generate-summary.js | URS: 003, 005; FS: 003, 004 | [[coverage:full]] | [[status:unknown]] |
| [DS-045](specsLoader.html?spec=DS/DS-045-spec-help.md) spec-help.js | URS: 010; FS: 008 | [[coverage:full]] | [[status:unknown]] |

## Design Specs – Tests
| DS ID | Requirements Covered (URS / FS / NFS) | Coverage | Test Status |
| --- | --- | --- | --- |
| [DS-020](specsLoader.html?spec=DS/DS-020-tests-cliPlanning.test.mjs.md) cliPlanning.test.mjs | URS: 001, 008; FS: 001, 005 | [[coverage:partial]] | [[status:unknown]] |
| [DS-021](specsLoader.html?spec=DS/DS-021-tests-gamp-achilles-cli.test.mjs.md) achilles-cli.test.mjs | URS: 001, 002, 003, 005, 007, 010; FS: 001, 002, 003, 005, 008, 009 | [[coverage:partial]] | [[status:unknown]] |
| [DS-022](specsLoader.html?spec=DS/DS-022-tests-gamp-workspace-workflows.test.mjs.md) workspace-workflows.test.mjs | URS: 004, 008; FS: 007 | [[coverage:partial]] | [[status:unknown]] |
| [DS-023](specsLoader.html?spec=DS/DS-023-tests-gamp-spec-management.test.mjs.md) spec-management.test.mjs | URS: 003, 004, 005; FS: 003, 004, 007, 010 | [[coverage:partial]] | [[status:unknown]] |
| [DS-024](specsLoader.html?spec=DS/DS-024-tests-gamp-refactor-design.test.mjs.md) refactor-design.test.mjs | URS: 003, 005; FS: 003, 004, 010 | [[coverage:partial]] | [[status:unknown]] |
| [DS-025](specsLoader.html?spec=DS/DS-025-tests-gamp-generic-skill.test.mjs.md) generic-skill.test.mjs | URS: 001, 008; FS: 001, 006 | [[coverage:partial]] | [[status:unknown]] |
| [DS-026](specsLoader.html?spec=DS/DS-026-tests-gamp-spec-mentor.test.mjs.md) spec-mentor.test.mjs | URS: 003, 004, 005; FS: 003, 004 | [[coverage:partial]] | [[status:unknown]] |
| [DS-027](specsLoader.html?spec=DS/DS-027-tests-skills-build-code-cli.md) build-code-cli.test.mjs | URS: 003, 005; FS: 004, 010 | [[coverage:partial]] | [[status:unknown]] |
| [DS-028](specsLoader.html?spec=DS/DS-028-tests-skills-generate-summary.md) generate-summary.test.mjs | URS: 003, 005; FS: 003, 004 | [[coverage:partial]] | [[status:unknown]] |
| [DS-029](specsLoader.html?spec=DS/DS-029-tests-skills-fix-tests-and-code-cli.md) fix-tests-and-code-cli.test.mjs | URS: 005, 009; FS: 004, 010 | [[coverage:partial]] | [[status:unknown]] |
| [DS-030](specsLoader.html?spec=DS/DS-030-tests-skills-generate-docs-cli.md) generate-docs-cli.test.mjs | URS: 003, 005; FS: 003, 004 | [[coverage:partial]] | [[status:unknown]] |
| [DS-031](specsLoader.html?spec=DS/DS-031-tests-skills-ignore-files-cli.md) ignore-files-cli.test.mjs | URS: 003, 004; FS: 007 | [[coverage:partial]] | [[status:unknown]] |
| [DS-032](specsLoader.html?spec=DS/DS-032-tests-skills-run-tests-cli.md) run-tests-cli.test.mjs | URS: 009; FS: 004, 010 | [[coverage:partial]] | [[status:unknown]] |
| [DS-033](specsLoader.html?spec=DS/DS-033-tests-skills-spec-help-cli.md) spec-help-cli.test.mjs | URS: 003, 004; FS: 003, 004 | [[coverage:partial]] | [[status:unknown]] |
| [DS-034](specsLoader.html?spec=DS/DS-034-tests-skills-spec-review-cli.md) spec-review-cli.test.mjs | URS: 003, 004; FS: 003, 004 | [[coverage:partial]] | [[status:unknown]] |
| [DS-035](specsLoader.html?spec=DS/DS-035-tests-skills-sync-specs-cli.md) sync-specs-cli.test.mjs | URS: 005, 009; FS: 004, 010 | [[coverage:partial]] | [[status:unknown]] |
| [DS-036](specsLoader.html?spec=DS/DS-036-tests-skills-update-specs-cli.md) update-specs-cli.test.mjs | URS: 003, 004, 005; FS: 003, 004, 010 | [[coverage:partial]] | [[status:unknown]] |
