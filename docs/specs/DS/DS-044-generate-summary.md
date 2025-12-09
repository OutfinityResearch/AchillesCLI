# DS-044 – Skill: generate-summary (.AchillesSkills/gamp/generate-summary/generate-summary.js)

## Version
- current: v1.0
- timestamp: 2025-12-09T11:32:04Z

## Scope & Intent
Summarise the latest specs without regenerating HTML docs. Per `oskill.md`, generate `.specs/mock/spec-summary.html`, group info by doc type, include impacted files and up to 3 tests per DS, and avoid mutating specs beyond the summary artefact.

## Architecture

The module architecture reads specs, builds summaries (counts, recent DS), and renders only the summary HTML artefact. It returns the spec summary payload for CLI display without invoking `GampRSP.generateHtmlDocs()`.

## Traceability
- URS: URS-003, URS-005
- Requirements: FS-003, FS-004

## File Impact
### File: achilles-cli/.AchillesSkills/gamp/generate-summary/generate-summary.js

#### Exports
- default skill `action({ prompt, context })` — configures workspace, reads URS/FS/NFS/DS, builds a structured summary (traceability, file impacts, tests), renders `mock/spec-summary.html` only, and returns counts plus recent DS info without mutating specs or regenerating docs.

#### Dependencies
- GampRSP/spec helpers

#### Description
Non-mutating spec preview skill for quick overviews of current URS/FS/NFS/DS set without touching `.specs/html_docs`.

## Tests
- Indirectly used in CLI e2e tests (DS-021) when planner selects generate-summary.
