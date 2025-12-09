# DS-028 – Tests: skills/generate-summary.test.mjs

## Version
- current: v1.0
- timestamp: 2025-12-09T11:32:04Z

## Scope & Intent
Confirma că skill-ul generate-summary, rulat prin CLI `/run`, generează doar sumarul HTML fără a recrea documentația completă.

## Architecture

Testul pornește un workspace temporar, invocă `/run generate-summary`, apoi verifică pe disc că `.specs/mock/spec-summary.html` există și conține textul “Specification Summary” și că nu este generat `.specs/html_docs/index.html`. Execuția trebuie să returneze un singur skill cu status `ok`.

## Traceability
- URS: URS-003, URS-005
- Requirement: FS-003, FS-004

## File Impact
### File: achilles-cli/tests/skills/generate-summary.test.mjs

#### Description
Asigură că sumarul este generat și scris pe disc fără a declanșa regenerarea documentației HTML, validând conținutul minim așteptat.

## Related Files
- docs/specs/DS/DS-044-generate-summary.md
- docs/specs/DS/DS-031-global-testing.md
