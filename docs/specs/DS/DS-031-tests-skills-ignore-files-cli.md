# DS-031 – Tests: skills/ignore-files-cli.test.mjs

## Version
- current: v1.0
- timestamp: 2025-12-05T00:00:00Z

## Scope & Intent
Confirmă că skill-ul ignore-files, executat prin CLI `/run`, adaugă intrările implicite și personalizate în `.specs/.ignore`.

## Architecture

Testul creează un workspace temporar, rulează `/run ignore-files "tmp,build"`, apoi deschide `.specs/.ignore` pentru a verifica atât intrările implicite (`node_modules`), cât și pe cele cerute (`tmp`, `build`). Faptul că fișierul există și conține intrările dovedeste modificarea pe disc.

## Traceability
- URS: URS-003, URS-004
- Requirement: FS-007

## File Impact
### File: achilles-cli/tests/skills/ignore-files-cli.test.mjs

#### Description
Rulează skill-ul și validează conținutul fișierului `.specs/.ignore`, confirmând că intrările au fost scrise.

## Related Files
- docs/specs/DS/DS-034-ignore-files.md
- docs/specs/DS/DS-031-global-testing.md
