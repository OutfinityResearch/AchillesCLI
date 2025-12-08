# DS-041 – Skill: refactor-design (.AchillesSkills/gamp/refactor-design/refactor-design.js)

## Version
- current: v1.0
- timestamp: 2025-12-04T11:33:47Z

## Scope & Intent
Capture refactor requests as DS updates and optionally move code stubs into new files, per `oskill.md`: parse target modules, update/create DS with new descriptions and file impacts, and invoke build-code to mirror refreshed design.

## Architecture

The module architecture parses prompt for refactor intent; may update DS content and file-impact notes accordingly. It uses GampRSP to write changes and keep traceability.

## Traceability
- URS: URS-005, URS-009
- Requirements: FS-003, FS-004, FS-010

## File Impact
### File: achilles-cli/.AchillesSkills/gamp/refactor-design/refactor-design.js

#### Exports
- default skill `action({ prompt, context })` — configures workspace, parses DS references and file mentions from the prompt, creates a new URS/FS/DS trio when none is referenced, updates DS description/architecture with refactor scope/timestamp, annotates mentioned files via `describeFile` (autodetecting exports from current sources), and invokes `build-code` to regenerate artifacts; returns created DS info, touched files per DS, and build results.
  Diagram (ASCII):
  ```
  prompt + workspace
         |
         v
   parse DS ids in prompt
         |
   ds ids found?
     |         |
    yes       no
     |         |
 use referenced  create URS/FS/DS trio
      DS list            |
           \             v
            \------> target DS ids
                        |
                        v
        update DS description/architecture
                        |
                        v
    extract file mentions + exports -> describeFile
                        |
                        v
               call build-code skill
                        |
                        v
        return dsIds, created, annotatedFiles, build
  ```

#### Dependencies
- GampRSP

#### Description
Design-focused skill to adapt specs/DS when refactoring, ensuring updated architecture and file impact stay in sync.

## Tests
- DS-024 (refactor design test suite) covers this behavior.
