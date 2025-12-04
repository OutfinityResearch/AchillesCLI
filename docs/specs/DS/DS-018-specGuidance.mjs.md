# DS-018 – Spec Guidance (helpers/specGuidance.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

## Scope & Intent
Provide detailed GAMP/spec guidance text injected into planner prompts to steer URS/FS/NFS/DS authoring and testing conventions.

## Architecture
- Exports `SPEC_GUIDANCE_TEXT` describing URS/FS/NFS/DS expectations, file-level impact, and testing conventions.

## Traceability
- URS: URS-003, URS-004, URS-009
- Requirement: FS-001, FS-003, FS-010

## File Impact
### File: achilles-cli/helpers/specGuidance.mjs
Timestamp: 1700000003018

#### Exports
- SPEC_GUIDANCE_TEXT

#### Dependencies
- none

#### Description
Static guidance string consumed by plan prompts and skills to align generated specs with Achilles conventions.

## Tests
- DS-020 (planner CLI)
