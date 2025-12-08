# DS-032 – Tests: skills/run-tests-cli.test.mjs

## Version
- current: v1.0
- timestamp: 2025-12-05T00:00:00Z

## Scope & Intent
Verifică că skill-ul run-tests, rulat prin CLI `/run`, execută `runAlltests.js`, propagă stdout și raportează succesul.

## Architecture

Testul construiește un workspace temporar cu un `runAlltests.js` care scrie `tests ok` și iese cu cod 0, rulează `/run run-tests "FS-001"`, apoi despachetează rezultatul pentru a confirma `stdout` conținând mesajul și `exitCode`/`status` de succes. Aceasta demonstrează că scriptul a fost invocat și output-ul a fost capturat.

## Traceability
- URS: URS-009
- Requirement: FS-004, FS-010

## File Impact
### File: achilles-cli/tests/skills/run-tests-cli.test.mjs

#### Description
Execută skill-ul și verifică rezultatul procesului copil și statusul raportat, validând că scriptul `runAlltests.js` este rulat efectiv.

## Related Files
- docs/specs/DS/DS-039-run-tests.md
- docs/specs/DS/DS-031-global-testing.md
