# DS-034 – Tests: skills/spec-review-cli.test.mjs

## Version
- current: v1.0
- timestamp: 2025-12-05T00:00:00Z

## Scope & Intent
Confirma că skill-ul spec-review, rulat prin CLI `/run`, parsează corect răspunsul LLM și livrează summary, issues și test gaps.

## Architecture

Testul folosește un workspace temporar, stub-ează LLM-ul pentru intentul `spec-review-analysis`, rulează `/run spec-review "focus on FS"`, apoi despachetează rezultatul pentru a verifica summary-ul “Specs look ok.”, existența unui issue cu severitate `high` și prezența unei intrări în testGaps. Nu modifică fișierele de pe disc; validează structura și conținutul payload-ului.

## Traceability
- URS: URS-003, URS-004
- Requirement: FS-003, FS-004

## File Impact
### File: achilles-cli/tests/skills/spec-review-cli.test.mjs

#### Description
Rulează skill-ul prin CLI și verifică payload-ul de review (summary, issues, testGaps) după despachetare, fără efecte pe disc.

## Related Files
- docs/specs/DS/DS-040-spec-review.md
- docs/specs/DS/DS-031-global-testing.md
