# Write Specs

## Summary
Create or replace a skill specs/ file.

## Description
Call this to create or replace a skill's generation specs under `specs/`. Use it for cskill/generated-code workflows where implementation requirements must be explicit.

## Help
Input: JSON { skillName, content, optional fileName }.

## Input Format
JSON with `skillName`, `content`, and optional `fileName`. Defaults to `specs/index.mjs.md` for cskill and `specs/tskill.generated.mjs.md` for tskill/dbtable.

## Output Format
Returns a created/updated specs message with the written path, or an error string.

## Constraints
- Specs should describe implementation requirements, not user-facing descriptor routing only.
- Validate/generate after specs changes when runtime code depends on them.
