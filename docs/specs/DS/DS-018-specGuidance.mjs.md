# DS-018 – Spec Guidance (helpers/specGuidance.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-04T10:01:19Z

## Scope & Intent
Provide detailed GAMP/spec guidance text injected into planner prompts to steer URS/FS/NFS/DS authoring and testing conventions.

## Architecture

The module architecture exports `SPEC_GUIDANCE_TEXT` describing URS/FS/NFS/DS expectations, file-level impact, and testing conventions.

## Traceability
- URS: URS-003, URS-004, URS-009
- Requirement: FS-001, FS-003, FS-010

## File Impact
### File: achilles-cli/helpers/specGuidance.mjs

#### Exports
- `SPEC_GUIDANCE_TEXT` — canonical, multi-section guidance injected into planner prompts covering URS/FS/NFS/DS roles, mandatory File Impact details (exports/dependencies/side-effects/concurrency), testing layout/runAlltests conventions, language and traceability expectations, bootstrap/testing guardrails, and doc lifecycle rules.

#### Dependencies
- none

#### Description
Static guidance string consumed by plan prompts and skills to align generated specs with Achilles conventions.

## Tests
- DS-020 (planner CLI)
