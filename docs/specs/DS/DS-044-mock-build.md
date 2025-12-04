# DS-044 – Skill: mock-build (.AchillesSkills/gamp/mock-build/mock-build.js)

## Version
- current: v1.0
- timestamp: 2025-12-04T10:01:19Z

## Scope & Intent
Summarise latest specs and publish HTML artefacts without modifications, per `oskill.md`: generate `.specs/mock/spec-summary.html` and full `html_docs`, group info by doc type, include impacted files and up to 3 tests per DS.

## Architecture
- Reads specs, builds summaries (counts, recent DS), and can render HTML docs index.
- Returns spec summary payload for display in CLI.

## Traceability
- URS: URS-003, URS-005
- Requirements: FS-003, FS-004

## File Impact
### File: achilles-cli/.AchillesSkills/gamp/mock-build/mock-build.js

#### Exports
- default skill `action({ prompt, context })` — configures workspace, reads URS/FS/NFS/DS, builds a structured summary (traceability, file impacts, tests), renders `mock/spec-summary.html` plus full `html_docs`, and returns counts plus recent DS info without mutating specs.

#### Dependencies
- GampRSP/spec helpers

#### Description
Non-mutating spec preview skill for quick overviews of current URS/FS/NFS/DS set.

## Tests
- Indirectly used in CLI e2e tests (DS-021) when planner selects mock-build.
