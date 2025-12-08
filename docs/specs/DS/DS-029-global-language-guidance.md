# DS-029 – Global Language & Guidance

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

## Scope & Intent
Capture language contract enforcement and embedded guidance that steers planner and skills toward compliant GAMP specs.

## Architecture

The architecture **Language contract**: Built via `buildLanguageContract` in CLI; default English; updated by `/lang`; contract appended to planner and skill prompts; specLanguage passed in execution context. It **Guidance text**: `SPEC_GUIDANCE_TEXT` injects URS/FS/NFS/DS expectations, file impact mandates, and testing conventions into planning prompts. It **Model modes**: `/model fast|deep` sets default LLM mode for planning/execution; debug toggle exposes LLM calls when supported. It **Persistence**: Language preference stored in env (`DEFAULT_SPEC_LANGUAGE`) for reuse across runs.

```
/lang or DEFAULT_SPEC_LANGUAGE
          |
          v
buildLanguageContract
          |
          v
planner prompts + skill prompts
          |
          v
SPEC_GUIDANCE_TEXT enforcement
```


## Traceability
- URS: URS-001, URS-007, URS-010
- Requirements: FS-001, FS-008, FS-009, NFS-005, NFS-006

## File Impact
- Artifact: Language & guidance policy (no single source file)
- Related files: achilles-cli.mjs (language contract), helpers/planHelpers.mjs, helpers/executionHelpers.mjs, helpers/specGuidance.mjs

## Tests
- DS-021 (language contract propagation), DS-025 (formatting), DS-026 (mentor summaries)
