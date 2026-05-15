# Read Skill

## Summary
Read a skill descriptor.

## Description
Call this before modifying, explaining, validating details, or refining an existing skill. It returns the current markdown descriptor.

## Help
Input: skillName.

## Input Format
Plain text skill name, or JSON with `skillName` or `name`.

## Output Format
Returns the descriptor file name, path, type, and full content, or an error string.

## Constraints
- Use before edits so updates are based on current content.
- Do not use this to execute the skill.
