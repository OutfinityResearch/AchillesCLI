# DS-025 – Tests: skills/generic-skill.test.mjs

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

## Scope & Intent
Validate generic skill execution flows, ensuring results are formatted and summarized correctly.

## Architecture

The module architecture exercises generic-skill tools against temporary workspaces and validates file effects. It runs list/read plans to ensure directory listings return entries and `src/app.mjs` content is read. It runs a rewrite plan with an LLM stub so `src/app.mjs` is overwritten and now contains `value = 42`. It runs create/append plans to produce `docs/note.txt` and append content, then reads the final file to confirm both lines are present. It runs delete-path to remove `src/temp.txt` and asserts the file is gone. Each step checks the recorded status (`ok`) and inspects the files on disk to prove the actions executed.

## Traceability
- URS: URS-001, URS-008
- Requirement: FS-001, FS-006

## File Impact
### File: achilles-cli/tests/skills/generic-skill.test.mjs

#### Description
Ensures execution helper formatting and skill invocation behave as expected for generic skills.

## Related Files
- docs/specs/DS/DS-006-executionHelpers.mjs.md
