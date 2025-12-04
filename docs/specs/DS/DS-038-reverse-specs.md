# DS-038 – Skill: reverse-specs (.AchillesSkills/gamp/reverse-specs/reverse-specs.js)

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

## Scope & Intent
Synchronise specs with workspace by scanning code, per `oskill.md`: honor `.specs/.ignore`, detect new files, create/update auto-generated URS/FS/DS, describe files at DS level, limit scanning to text sources, and summarize changes.

## Architecture
- Scans workspace files (excluding ignore patterns) for code structure.
- Produces draft URS/FS/DS text based on discovered files and file paths; writes outputs under specs root.

## Traceability
- URS: URS-009
- Requirements: FS-004, FS-010

## File Impact
### File: achilles-cli/.AchillesSkills/gamp/reverse-specs/reverse-specs.js
Timestamp: 1700000003038

#### Exports
- default skill action({ prompt, context })

#### Dependencies
- GampRSP
- node fs/path

#### Description
Reverse-engineering helper to bootstrap specs from codebases lacking documentation, providing starting points for formal specs.

## Tests
- No dedicated suite; used cautiously in workflows (not auto-run in bootstrap).
