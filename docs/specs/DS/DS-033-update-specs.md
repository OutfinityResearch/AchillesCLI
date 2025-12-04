# DS-033 – Skill: update-specs (.AchillesSkills/gamp/update-specs/update-specs.js)

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

## Scope & Intent
LLM-driven specification authoring/updating: parse change requests, emit concrete spec actions (URS/FS/NFS/DS/test/describeFile), and keep traceability intact without running builders/tests. Mirrors `oskill.md` expectations (concise titles, verbatim descriptions, reuse IDs, max ~3 tests).

## Architecture
- Builds planner prompt with strict GAMP guidance and allowed actions; includes specs snapshot and change request.
- Requires llmAgent; obtains JSON plan (`update-specs-plan`) and applies via specPlanner (executePlan) to create/update/retire URS/FS/NFS, DS, describeFile, createTest.
- Avoids reverse-specs/build-code/run-tests; regenerates HTML docs after applying actions; returns actions and docs index.

## Traceability
- URS: URS-003, URS-004, URS-005, URS-009
- Requirements: FS-003, FS-004, FS-010

## File Impact
### File: achilles-cli/.AchillesSkills/gamp/update-specs/update-specs.js
Timestamp: 1700000003033

#### Exports
- default skill action({ prompt, context })

#### Dependencies
- GampRSP
- specPlanner utilities (ensureLLM, summariseSpecs, parsePlan, executePlan)
- node path

#### Description
Core spec authoring skill: turns change requests into concrete spec updates with traceability, file impact, and test stubs; avoids triggering reverse/build/run-tests.

## Tests
- Covered via spec-management and mentor/generic skill tests (DS-023, DS-026); no dedicated suite.
