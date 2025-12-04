# DS-036 – Skill: build-code (.AchillesSkills/gamp/build-code/build-code.js)

## Version
- current: v1.0
- timestamp: 2025-12-04T11:33:47Z

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

#### Exports
- default skill `action({ context })` — configures GampRSP, scans all DS file-impact blocks, extracts per-file metadata (exports/dependencies/why/how/what/side-effects/concurrency), generates or updates files with DS banners (skips if banner already present), optionally invokes the LLM to draft content, falls back to structured stubs, scaffolds FS/NFS test suites plus `runAlltests.js`, and returns a manifest of created/updated/skipped files alongside test scaffold paths.
  Diagram (ASCII):
  ```
  workspaceRoot
       |
       v
  read DS file impacts
       |
       v
  for each impact:
       |
   banner exists?
    |        |
   yes      no
    |        |
  skip   LLM generate or stub
             |
             v
      write file with DS banner
             |
            next impact
       |
       v
  ensure testUtil, FS/NFS suites, runAlltests.js
       |
       v
  return manifest + scaffold paths
  ```

#### Dependencies
- GampRSP
- node fs/path

#### Description
Code generation helper that materializes file stubs from DS design notes to accelerate rebuild/regeneration workflows.

## Tests
- No dedicated suite; indirectly exercised when DS include file impact and builders are invoked.
