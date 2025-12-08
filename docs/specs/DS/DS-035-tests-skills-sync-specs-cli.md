# DS-035 – Tests: skills/sync-specs-cli.test.mjs

## Version
- current: v1.0
- timestamp: 2025-12-05T00:00:00Z

## Scope & Intent
Verifică că skill-ul sync-specs, rulat prin CLI `/run`, creează ancore URS/FS/DS și documentează fișierele sursă în DS.

## Architecture

Testul pune un fișier `src/app.mjs` în workspace, stub-ează LLM-ul pentru `sync-specs-plan` (createURS/FS/DS + describeFile), rulează `/run sync-specs`, apoi verifică că `.specs/URS.md` conține “URS sync”, `.specs/FS.md` conține “FS sync”, există cel puțin un fișier DS în `.specs/DS/`, iar conținutul DS include `app.mjs`. Statusul execuției trebuie să fie `ok`.

## Traceability
- URS: URS-005, URS-009
- Requirement: FS-004, FS-010

## File Impact
### File: achilles-cli/tests/skills/sync-specs-cli.test.mjs

#### Description
Rulează skill-ul și confirmă că ancorele URS/FS/DS sunt create și că DS documentează fișierul sursă, verificând explicit conținutul fișierelor generate.

## Related Files
- docs/specs/DS/DS-038-sync-specs.md
- docs/specs/DS/DS-031-global-testing.md
