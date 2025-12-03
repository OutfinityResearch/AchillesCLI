# DS-032 – Spec Planner Utility (.AchillesSkills/gamp/utils/specPlanner.mjs)

## Version
- current: v1.0
- timestamp: 1700000003032

## Scope & Intent
Utility for spec skills to talk to GampRSP: summarize specs, parse planner output, and apply spec actions (URS/FS/NFS/DS/test/file-impact).

## Architecture
- Ensures LLM presence in context (`ensureLLM`).
- Loads and truncates specs snapshot (`summariseSpecs`).
- Parses planner output into actions (`parsePlan`), then applies actions to GampRSP (`executePlan` via create/update/retire URS/FS/NFS, create/update DS, describeFile, create/delete tests).

## Traceability
- URS: URS-003, URS-004, URS-005
- Requirements: FS-003, FS-004, FS-010

## File Impact
### File: .AchillesSkills/gamp/utils/specPlanner.mjs
Timestamp: 1700000003032

#### Exports
- ensureLLM, summariseSpecs, parsePlan, executePlan (default bundle)

#### Dependencies
- GampRSP singleton

#### Description
Shared executor for spec-related skills, bridging LLM-generated action plans to concrete spec mutations and HTML doc generation support.

## Tests
- Referenced indirectly by DS-021/DS-023/DS-026 when spec skills are mocked; no dedicated suite.
