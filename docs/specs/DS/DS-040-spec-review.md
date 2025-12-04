# DS-040 – Skill: spec-review (.AchillesSkills/gamp/spec-review/spec-review.js)

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

## Scope & Intent
Inspect specs and surface risks before execution, per `oskill.md`: read `.specs` snapshot, ask LLM reviewer to highlight gaps with severity-tagged findings, missing tests, and structured JSON for downstream orchestrators.

## Architecture
- Reads specs via GampRSP, produces summaries (counts, highlights) and can generate docs index.
- Supports mentor-style guidance with overview/ideas and recent files list.

## Traceability
- URS: URS-003, URS-004, URS-005
- Requirements: FS-003, FS-004, FS-010

## File Impact
### File: achilles-cli/.AchillesSkills/gamp/spec-review/spec-review.js
Timestamp: 1700000003040

#### Exports
- default skill action({ prompt, context })

#### Dependencies
- GampRSP
- specDocumentHelpers (implicit in skill bundle)

#### Description
Spec review/summary skill to audit existing URS/FS/NFS/DS, surface counts and highlights, and optionally render HTML docs.

## Tests
- Covered indirectly by spec-mentor and spec-management tests (DS-026, DS-023).
