# DS-041 – Skill: refactor-design (.AchillesSkills/gamp/refactor-design/refactor-design.js)

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

## Scope & Intent
Capture refactor requests as DS updates and optionally move code stubs into new files, per `oskill.md`: parse target modules, update/create DS with new descriptions and file impacts, and invoke build-code to mirror refreshed design.

## Architecture
- Parses prompt for refactor intent; may update DS content and file-impact notes accordingly.
- Uses GampRSP to write changes and keep traceability.

## Traceability
- URS: URS-005, URS-009
- Requirements: FS-003, FS-004, FS-010

## File Impact
### File: .AchillesSkills/gamp/refactor-design/refactor-design.js
Timestamp: 1700000003041

#### Exports
- default skill action({ prompt, context })

#### Dependencies
- GampRSP

#### Description
Design-focused skill to adapt specs/DS when refactoring, ensuring updated architecture and file impact stay in sync.

## Tests
- DS-024 (refactor design test suite) covers this behavior.
