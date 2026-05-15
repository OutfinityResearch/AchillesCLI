# Preview Changes

## Summary
Preview a proposed full-file skill change.

## Description
Call this before applying a large full-file replacement when the user wants review or the change is risky.

## Help
Input: JSON { skillName, fileName, newContent }.

## Input Format
JSON with `skillName`, `fileName`, and `newContent`.

## Output Format
Returns a diff-like preview, or an error string when the target file cannot be read.

## Constraints
- Use for previews only; this skill must not write changes.
- Prefer `update-section` for focused section edits.
