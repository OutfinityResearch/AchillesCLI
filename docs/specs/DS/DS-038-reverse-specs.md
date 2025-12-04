# DS-038 – Skill: reverse-specs (.AchillesSkills/gamp/reverse-specs/reverse-specs.js)

## Version
- current: v1.0
- timestamp: 2025-12-04T11:33:47Z

## Scope & Intent
Synchronise specs with workspace by scanning code, per `oskill.md`: honor `.specs/.ignore`, detect new files, create/update auto-generated URS/FS/DS, describe files at DS level, limit scanning to text sources, and summarize changes.

## Architecture
- Scans workspace files (excluding ignore patterns) for code structure.
- Produces draft URS/FS/DS text based on discovered files and file paths; writes outputs under specs root.

## Traceability
- URS: URS-009
- Requirements: FS-004, FS-010

## File Impact
### File: achilles-cli/.AchillesSkills/gamp/reverse-specs/reverse-specs.js
Timestamp: 1700000003038

#### Exports
- default skill `action({ prompt, context })` — configures workspace, reads ignore list, scans up to 80 source files (selected extensions) excluding `.specs` and ignored paths, seeds auto-generated URS/FS/DS anchors if missing, builds per-file LLM plans with detected exports/snippets/spec snapshot, executes returned actions (or falls back to `describeFile` when LLM fails), and returns per-file outcomes with counts.
  Diagram (ASCII):
  ```
  workspace + ignores
         |
         v
  list files (filtered by extension/ignore)
         |
         v
  ensure auto URS/FS/DS anchors
         |
         v
  for each file (<=80):
         |
    build LLM prompt (snippet + exports + specs)
         |
    llm.executePrompt -> parsePlan
         |
    plan available?
      |         |
     yes       no
      |         |
 executePlan   fallback describeFile on auto DS
      |         |
      +----> record outcomes
                  |
             next file
         |
         v
  return results
  ```

#### Dependencies
- GampRSP
- node fs/path

#### Description
Reverse-engineering helper to bootstrap specs from codebases lacking documentation, providing starting points for formal specs.

## Tests
- No dedicated suite; used cautiously in workflows (not auto-run in bootstrap).
