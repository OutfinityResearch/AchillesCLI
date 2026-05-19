# Write Tests

## Summary
Generate broader test files for supported skill types.

## Description
Call this when a supported generated runtime skill needs a broader test file. It generates tests for `tskill`/`dbtable` and `cskill`.

## Help
Input: skillName or JSON { skillName, options }.

## Input Format
Plain text skill name, or JSON with `skillName` and optional `options`.

## Output Format
Returns a generated test file summary, or an error string.

## Constraints
- Use this skill for all supported generated runtime test creation, including cskill tests derived from specs.
- Run tests after writing them when verification is requested.
