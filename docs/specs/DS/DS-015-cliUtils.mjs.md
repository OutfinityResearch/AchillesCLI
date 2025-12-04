# DS-015 – CLI Utilities (helpers/cliUtils.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-04T11:33:47Z

## Scope & Intent
Utility helpers for truthy parsing, array coercion, skill implementation detection, and plan parsing from various shapes.

## Architecture
- Provides `isTruthy`, `ensureArray` for env/arg parsing.
- Detects skill implementation type by inspecting skill directory contents.
- Parses planner output (array/object/string) into normalized plan steps.

## Traceability
- URS: URS-001, URS-008
- Requirement: FS-001, FS-008

## File Impact
### File: achilles-cli/helpers/cliUtils.mjs

#### Exports
- `isTruthy(value)` — interprets boolean-like values (`true/yes/1`) from strings or booleans; defaults to false otherwise.
- `ensureArray(value)` — coerces comma-separated strings or arrays into a trimmed array, filtering empties.
- `detectImplementation(skillRecord)` — inspects the skill directory to classify implementation (`javascript`, `soplang`, `javascript + soplang`, `descriptor-only`, `english`, or `unknown`).
- `parsePlan(raw)` — normalises planner output (arrays, objects with steps/plan, JSON strings, fenced blocks) into clean `{ skill, prompt }` entries; discards invalid/empty rows.
  Diagram (ASCII):
  ```
  raw planner output
          |
          v
     tryParsePlan
          |
     parsed steps?
        |     |
       no    yes
        |     |
   return []  trim skill/prompt
                  |
             filter empties
                  |
           return plan array
  ```

#### Dependencies
- node fs

#### Description
Lightweight utilities used across CLI setup, skill listing, and planner parsing.

## Tests
- DS-020 (planner CLI)
- DS-025 (generic skill)
