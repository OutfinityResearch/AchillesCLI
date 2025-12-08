# DS-036 – Tests: skills/update-specs-cli.test.mjs

## Version
- current: v1.0
- timestamp: 2025-12-05T00:00:00Z

## Scope & Intent
Asigură că skill-ul update-specs, rulat prin CLI `/run`, aplică planul LLM și creează URS/FS/DS conform acțiunilor returnate.

## Architecture

Testul seed-uiește un workspace temporar, stub-ează LLM-ul pentru `update-specs-plan` (acțiuni createURS/createFS/createDS), rulează `/run update-specs`, apoi citește `.specs/URS.md`, `.specs/FS.md` și primul fișier din `.specs/DS/` pentru a confirma titlurile “URS telemetry”, “FS telemetry” și “DS telemetry”. Verifică faptul că există cel puțin un fișier DS și că statusul execuției este `ok`.

## Traceability
- URS: URS-003, URS-004, URS-005
- Requirement: FS-003, FS-004, FS-010

## File Impact
### File: achilles-cli/tests/skills/update-specs-cli.test.mjs

#### Description
Rulează skill-ul și validează pe disc că URS/FS/DS sunt create conform planului stub, inspectând conținutul fișierelor generate.

## Related Files
- docs/specs/DS/DS-033-update-specs.md
- docs/specs/DS/DS-031-global-testing.md
