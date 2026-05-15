# Run Tests

## Summary
Run existing skill test files.

## Description
Call this when the user asks to run tests, or after generating/updating tests. It runs existing `.tests.mjs` files and reports pass/fail results.

## Help
Input: skillName, all, or JSON { target, options }.

## Input Format
Plain text skill name, `all`, or JSON with `target` and optional `options`.

## Output Format
Returns formatted test results with pass/fail counts and failure details.

## Constraints
- This runs existing tests only; use `generate-tests` or `write-tests` to create tests.
- Use `all` only when broad test execution is requested.
