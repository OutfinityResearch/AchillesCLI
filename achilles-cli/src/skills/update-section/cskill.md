# Update Section

## Summary
Add or replace one section in a skill descriptor.

## Description
Call this to add or replace exactly one markdown section in an existing skill descriptor. Prefer this over full-file writes for focused edits.

## Help
Input: JSON { skillName, section, content }.

## Input Format
JSON with `skillName`, `section`, and `content`.

## Output Format
Returns a success message with the updated section, or an error string.

## Constraints
- Only update one section per call.
- Read the skill first when preserving surrounding content matters.
