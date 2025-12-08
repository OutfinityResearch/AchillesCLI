# DS-028 – Tests: skills/docs-and-summary.test.mjs

## Version
- current: v1.0
- timestamp: 2025-12-05T00:00:00Z

## Scope & Intent
Confirma că skill-ul docs-and-summary, rulat prin CLI `/run`, generează sumarul HTML și documentația completă.

## Architecture

Testul pornește un workspace temporar, invocă `/run docs-and-summary`, apoi verifică pe disc că `.specs/mock/spec-summary.html` există și conține textul “Specification Summary”, iar `.specs/html_docs/index.html` este creat și ne-gol. Execuția trebuie să returneze un singur skill cu status `ok`.

## Traceability
- URS: URS-003, URS-005
- Requirement: FS-003, FS-004

## File Impact
### File: achilles-cli/tests/skills/docs-and-summary.test.mjs

#### Description
Asigură că sumarul și documentația completă sunt generate și scrise pe disc, validând conținutul minim așteptat.

## Related Files
- docs/specs/DS/DS-044-docs-and-summary.md
- docs/specs/DS/DS-031-global-testing.md
