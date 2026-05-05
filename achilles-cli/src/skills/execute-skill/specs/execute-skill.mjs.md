# execute-skill Module Specification

Executes a user skill and returns its output.

## Overview

This module allows direct execution of user-created skills (not built-in management skills) by name with optional input parameters.

## Exported Function

### action

Main entry point for the skill.

Accepts:
- mainAgent: The MainAgent instance
- prompt: Input string or object specifying skill to execute

## Input Parsing

Supports multiple input formats:

String format:
- "skillName" - Execute skill with no input
- "skillName input text" - Execute with input
- "skillName with input text" - Execute with input (explicit "with" keyword)
- Multi-line: First line parsed for skill name, rest as input

Object format:
- skillName/name/skill: The skill to execute
- input/skillInput/args: Input to pass to skill

## Skill Resolution

Processing steps:
1. Normalize skill name (lowercase, replace non-alphanumeric with hyphens)
2. Look up skill record using agent.getSkillRecord()
3. If not found with normalized name, try original name
4. Verify skill exists in catalog

## Execution Restrictions

Only user skills can be executed:
- Internal/built-in management skills are rejected (check record.isInternal)
- Error message suggests using the skill directly instead

## Execution

Uses agent.executePrompt() with:
- Input: The parsed skill input or default message
- Options: skillName pointing to the resolved skill

## Output Format

Success:
```
=== skillName Output ===
[result content]
```

Result content formatting:
- String result: Direct output
- Object with result property: Formatted JSON or string
- Other objects: JSON stringified
- Other types: String conversion

## Error Handling

Skill not found:
```
Error: Skill "name" not found.
Available user skills: skill1, skill2, skill3
```

Built-in skill:
```
Error: "name" is a built-in management skill, not a user skill.
Use the skill directly (e.g., "read-skill joker") instead of execute-skill.
```

Missing skill name:
```
Error: skillName is required.
Usage: execute-skill <skillName> [input]
Example: execute-skill joker topic=programming
```

Execution error:
```
Error executing skill "name": [error message]
```

## Dependencies

- MainAgent methods:
  - getSkillRecord: Find skill by name
  - getSkills: List available skills (filtered by !isInternal for user skills)
  - executePrompt: Execute the skill
