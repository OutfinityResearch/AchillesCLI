# DS-027 – Tests: skills/build-code-cli.test.mjs

## Version
- current: v1.0
- timestamp: 2025-12-05T00:00:00Z

## Scope & Intent
Validate că skill-ul build-code executat prin CLI `/run` generează fișierele descrise în DS-urile existente și include banner-ul DS.

## Architecture

Testul creează un workspace temporar, seed-uiește URS/FS/DS și un bloc file-impact pentru `src/generated/demo.mjs` în `.specs/DS/DS-001.md`, stub-ează răspunsul LLM pentru `build-code-generate`, apoi rulează `/run build-code`. Verifică pe disc că `src/generated/demo.mjs` există, conține exportul `demo` și banner-ul DS, iar execuția este raportată `ok`.

## Traceability
- URS: URS-003, URS-005
- Requirement: FS-004, FS-010

## File Impact
### File: achilles-cli/tests/skills/build-code-cli.test.mjs

#### Description
Testează generarea de fișiere din specificațiile DS și verifică rezultatul pe disc (fișier creat, conținutul include banner DS și exportul generat).

## Related Files
- docs/specs/DS/DS-036-build-code.md
- docs/specs/DS/DS-031-global-testing.md
