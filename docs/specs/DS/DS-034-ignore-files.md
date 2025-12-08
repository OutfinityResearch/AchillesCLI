# DS-034 – Skill: ignore-files (.AchillesSkills/gamp/ignore-files/ignore-files.js)

## Version
- current: v1.0
- timestamp: 2025-12-04T11:33:47Z

## Scope & Intent
Manage `.specs/.ignore` manifest so spec operations stay focused on relevant sources, per `oskill.md`: parse lists, add defaults, normalise entries, avoid duplicates, and return the updated list.

## Architecture

The module architecture parses prompt into patterns; normalizes paths relative to workspace root. It merges defaults with provided entries; writes `.specs/.ignore` via GampRSP addIgnoreEntries. It reports added entries.

## Traceability
- URS: URS-003, URS-004
- Requirements: FS-007, NFS-004

## File Impact
### File: achilles-cli/.AchillesSkills/gamp/ignore-files/ignore-files.js

#### Exports
- default skill `action({ prompt, context })` — resolves workspace root, parses the user prompt into ignore patterns, normalises them to workspace-relative paths, merges defaults with existing entries via `addIgnoreEntries`, writes `.specs/.ignore`, and returns the final ignore list for visibility.
  Diagram (ASCII):
  ```
  [prompt + context]
          |
          v
    parse entries + defaults
          |
          v
  normalize to workspace-relative
          |
          v
  addIgnoreEntries -> .specs/.ignore
          |
          v
  return updated list
  ```

#### Dependencies
- GampRSP
- node path

#### Description
Bootstrap/support skill to ensure ignore list is present and extensible, reducing accidental spec ingestion of bulky or sensitive folders.

## Tests
- Exercised indirectly in bootstrap tests (DS-022) and CLI e2e (DS-021).
