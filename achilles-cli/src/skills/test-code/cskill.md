# Test Code

## Summary
Smoke-test generated runtime code for one skill.

## Description
Call this for a quick runtime-code smoke test for one skill. It imports `src/index.mjs`, `src/index.js`, or `src/tskill.generated.mjs` and exercises exported functions.

## Help
Input: skillName plus optional testInput.

## Input Format
Plain text skill name plus optional test input, or JSON with `skillName` and optional `testInput`.

## Output Format
Returns module load status, executed checks, and errors when import or execution fails.

## Constraints
- Use for one-skill smoke checks, not as a replacement for full test suites.
- The target skill must already have runtime code in `src/`.
