# DS-033 – Tests: skills/spec-help-cli.test.mjs

## Version
- current: v1.0
- timestamp: 2025-12-05T00:00:00Z

## Scope & Intent
Asigură că skill-ul spec-help, rulat prin CLI `/run`, returnează payload-ul de ajutor cu introducere, concepte cheie, pași de lifecycle și concluzii.

## Architecture

Testul pornește un workspace temporar, rulează `/run spec-help`, despachetează rezultatul și verifică prezența câmpurilor din `help` (introduction, keyConcepts, lifecycleSteps, closingThoughts). Nu modifică fișiere, validează structura răspunsului generat de skill.

## Traceability
- URS: URS-003, URS-004
- Requirement: FS-003, FS-004

## File Impact
### File: achilles-cli/tests/skills/spec-help-cli.test.mjs

#### Description
Verifică payload-ul de help întors de skill și confirmă câmpurile obligatorii, fără acțiuni pe disc.

## Related Files
- docs/specs/DS/DS-040-spec-review.md
- docs/specs/DS/DS-031-global-testing.md
