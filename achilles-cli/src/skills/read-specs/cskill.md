# Read Specs

## Summary
Read a skill specs file.

## Description
Call this when the user asks about implementation requirements or before changing generation specs for a skill.

## Help
Input: skillName.

## Input Format
Plain text skill name, or JSON with `skillName` or `name`.

## Output Format
Returns the specs file path and content, or an error string when no specs file exists.

## Constraints
- Use for generated-code requirements, not for descriptor content.
- If no specs exist, report that clearly instead of inventing content.
