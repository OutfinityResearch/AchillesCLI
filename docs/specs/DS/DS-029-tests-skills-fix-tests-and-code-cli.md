# DS-029 – Tests: skills/fix-tests-and-code-cli.test.mjs

## Version
- current: v1.0
- timestamp: 2025-12-05T00:00:00Z

## Scope & Intent
Verifică faptul că skill-ul fix-tests-and-code, rulat prin CLI `/run`, execută bucla de remediere, rulează testele și raportează încercările efectuate.

## Architecture

Testul creează un workspace temporar cu un script `runAlltests.js` care iese cu succes, apelează `/run fix-tests-and-code "..."`, apoi despachetează rezultatul pentru a confirma că există cel puțin o intrare în `attempts`. Scenariul dovedește că skill-ul a rulat scriptul de teste și a înregistrat încercarea, chiar dacă succesul a fost obținut la prima rulare.

## Traceability
- URS: URS-005, URS-009
- Requirement: FS-004, FS-010

## File Impact
### File: achilles-cli/tests/skills/fix-tests-and-code-cli.test.mjs

#### Description
Rulează skill-ul prin CLI, verifică că `attempts` este populat și că scriptul de teste din workspace a fost invocat.

## Related Files
- docs/specs/DS/DS-037-fix-tests-and-code.md
- docs/specs/DS/DS-031-global-testing.md
