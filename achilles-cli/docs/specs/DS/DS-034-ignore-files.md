# DS-034 – Skill: ignore-files (.AchillesSkills/gamp/ignore-files/ignore-files.js)

## Version
- current: v1.0
- timestamp: 1700000003034

## Scope & Intent
Manage `.specs/.ignore` manifest so spec operations stay focused on relevant sources, per `oskill.md`: parse lists, add defaults, normalise entries, avoid duplicates, and return the updated list.

## Architecture
- Parses prompt into patterns; normalizes paths relative to workspace root.
- Merges defaults with provided entries; writes `.specs/.ignore` via GampRSP addIgnoreEntries.
- Reports added entries.

## Traceability
- URS: URS-003, URS-004
- Requirements: FS-007, NFS-004

## File Impact
### File: .AchillesSkills/gamp/ignore-files/ignore-files.js
Timestamp: 1700000003034

#### Exports
- default skill action({ prompt, context })

#### Dependencies
- GampRSP
- node path

#### Description
Bootstrap/support skill to ensure ignore list is present and extensible, reducing accidental spec ingestion of bulky or sensitive folders.

## Tests
- Exercised indirectly in bootstrap tests (DS-022) and CLI e2e (DS-021).
