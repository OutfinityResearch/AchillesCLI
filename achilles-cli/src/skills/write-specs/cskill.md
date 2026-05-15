# Write Specs

## Summary
Create or replace a skill specs file.

## Description
Call this to create or replace a skill's generation specs. Use it for cskill/generated-code workflows where implementation requirements must be explicit.

## Help
Input: JSON { skillName, content }.

## Input Format
JSON with `skillName` and `content`.

## Output Format
Returns a created/updated specs message with the written path, or an error string.

## Constraints
- Specs should describe implementation requirements, not user-facing descriptor routing only.
- Validate/generate after specs changes when runtime code depends on them.
