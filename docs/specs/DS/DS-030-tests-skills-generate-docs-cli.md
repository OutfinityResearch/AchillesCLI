# DS-030 – Tests: skills/generate-docs-cli.test.mjs

## Version
- current: v1.0
- timestamp: 2025-12-05T00:00:00Z

## Scope & Intent
Asigură că skill-ul generate-docs, executat prin CLI `/run`, produce documentația HTML completă.

## Architecture

Testul pornește un workspace temporar, rulează `/run generate-docs`, apoi verifică existența fișierului `.specs/html_docs/index.html` și că acesta are dimensiune non-zero. Execuția trebuie să raporteze un singur skill cu status `ok`.

## Traceability
- URS: URS-003, URS-005
- Requirement: FS-003, FS-004

## File Impact
### File: achilles-cli/tests/skills/generate-docs-cli.test.mjs

#### Description
Validează că HTML-ul documentației este generat și scris pe disc în urma rulării skill-ului.

## Related Files
- docs/specs/DS/DS-035-generate-docs.md
- docs/specs/DS/DS-031-global-testing.md
