# DS-026 – Tests: skills/spec-mentor.test.mjs

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

## Scope & Intent
Test spec mentor flows and educational outputs when requesting spec guidance or summaries.

## Architecture

The module architecture seeds temporary specs (URS/FS/NFS) and uses stubbed LLM responses to exercise three skills. It runs `spec-mentor` and checks the returned JSON contains overview, URS/FS ideas, test impacts, and an approval question. It runs `spec-review` and validates the parsed review summary, a single issue with severity `high`, and a test gap entry. It runs `spec-help` and ensures the help payload includes introduction, key concepts, lifecycle steps mentioning URS, and closing thoughts. These checks are against the structured payloads returned by the skills; no filesystem mutations beyond the seeded `.specs` files.

## Traceability
- URS: URS-003, URS-004, URS-005
- Requirement: FS-003, FS-004

## File Impact
### File: achilles-cli/tests/skills/spec-mentor.test.mjs

#### Description
Validates that mentor-style outputs include spec counts, highlights, and docs paths.

## Related Files
- docs/specs/DS/DS-006-executionHelpers.mjs.md
- docs/specs/DS/DS-009-specDocumentHelpers.mjs.md
