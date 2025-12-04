# DS-043 – Skill: spec-mentor (.AchillesSkills/gamp/spec-mentor/spec-mentor.js)

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

## Scope & Intent
Guide operators through URS/FS/NFS/DS/tests before changes, per `oskill.md`: load specs (truncated), propose bullet ideas for updates, emphasise traceability and embedded verification, and request user confirmation before acting.

## Architecture
- Reads specs, produces counts and highlights for URS/FS/NFS/DS, and may generate HTML docs index.
- Returns overview text, ideas, and docs paths for operator education.

## Traceability
- URS: URS-003, URS-004, URS-005
- Requirements: FS-003, FS-004, FS-010

## File Impact
### File: achilles-cli/.AchillesSkills/gamp/spec-mentor/spec-mentor.js
Timestamp: 1700000003043

#### Exports
- default skill action({ prompt, context })

#### Dependencies
- GampRSP (through helper utilities in skill bundle)

#### Description
Mentor-style spec summarizer to educate operators on current specification set and provide quick navigation/output paths.

## Tests
- DS-026 (spec mentor test suite).
