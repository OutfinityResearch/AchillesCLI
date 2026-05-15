# Write Skill

## Summary
Create or replace a skill file.

## Description
Call this to create a new skill descriptor or replace a full skill file. It creates the skill directory when missing.

## Help
Input: JSON { skillName, fileName, content }.

## Input Format
JSON with `skillName`, `fileName`, and `content`.

## Output Format
Returns a created/updated message with byte count, or an error string.

## Constraints
- Use `update-section` instead for focused descriptor section changes.
- The `fileName` must be a recognized skill descriptor or JavaScript module file.
