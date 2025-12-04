# DS-036 – Skill: build-code (.AchillesSkills/gamp/build-code/build-code.js)

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

## Scope & Intent
Regenerate code artifacts from DS file-impact sections, per `oskill.md`: parse `### File:` blocks, ensure files/directories exist, inject DS banners, update timestamps only when specs changed, and avoid overwriting manual code if banner is present.

## Architecture
- Parses DS markdown to extract File Impact blocks and planned exports/dependencies.
- For each impacted file, creates directories, writes header with DS references and TODO placeholders, and preserves existing content comments.
- Supports comment style per extension; avoids overwriting code blindly.

## Traceability
- URS: URS-005, URS-009
- Requirements: FS-004, FS-010

## File Impact
### File: achilles-cli/.AchillesSkills/gamp/build-code/build-code.js
Timestamp: 1700000003036

#### Exports
- default skill action({ prompt, context })

#### Dependencies
- GampRSP
- node fs/path

#### Description
Code generation helper that materializes file stubs from DS design notes to accelerate rebuild/regeneration workflows.

## Tests
- No dedicated suite; indirectly exercised when DS include file impact and builders are invoked.
