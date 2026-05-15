# Generate Tests

## Summary
Generate cskill test files from descriptor and specs.

## Description
Call this when a cskill needs generated tests from its descriptor and specs. It reads `cskill.md` and `specs/*.md` to create a `.tests.mjs` file covering examples, constraints, errors, and edge cases.

## Help
Input: skillName or JSON { skillName, options: { force } }.

## Input Format
Plain text skill name, or JSON with `skillName` and optional `options.force`.

## Output Format
Returns a generated test summary with file path and test count, or an error string.

## Constraints
- Intended for cskills with enough descriptor/spec information to derive tests.
- Do not overwrite existing tests unless `force` is requested.
