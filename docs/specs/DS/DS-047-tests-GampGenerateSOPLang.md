# DS-047 – Tests: GampGenerateSOPLang.test.mjs

## Version
- current: v1.1
- timestamp: 1734005000000

## Scope & Intent
Workflow tests for GampRSP SOPLang code generation. Validates that GampRSP functions generate valid SOPLang code embedded in HTML comments for all specification file types (matrix.md, FS.md, NFS.md, DS/*.md).

## Architecture

The test suite validates the SOPLang comment generation pipeline:

```
+-------------------+     +-------------------+     +----------------------+
| GampRSP functions | --> | .specs files      | --> | HTML comments with   |
| createURS()       |     | - matrix.md       |     | SOPLang code         |
| createFS()        |     | - URS.md          |     |                      |
| createNFS()       |     | - FS.md           |     | Format:              |
| createDS()        |     | - NFS.md          |     | <!--{"achiles-ide-   |
+-------------------+     | - DS/*.md         |     | document":{"commands"|
                          +-------------------+     | :"@code"}}-->        |
                                                    +----------------------+
                                                              |
                                                              v
                                                    +----------------------+
                                                    | Test Verifications:  |
                                                    | - Valid JSON format  |
                                                    | - load commands      |
                                                    | - := dependencies    |
                                                    | - createJSCode/store |
                                                    | - Escaped newlines   |
                                                    +----------------------+
```

## Traceability
- URS: URS-008 (Skillful automation)
- Requirements: FS-001 (LLM planning & skills orchestration)
- Related DS: DS-002 (GampRSP.mjs), DS-046 (build-soplang skill)

## File Impact

### File: achilles-cli/tests/workflows/GampGenerateSOPLang.test.mjs

#### Test Suites

**1. matrix.md SOPLang**
- `generates load commands for all spec types` - Verifies matrix.md contains load commands for URS, FS, NFS, DS
- `uses correct load syntax with file path and anchor` - Validates `@VAR load path#anchor` syntax

**2. URS entries in matrix.md**
- `URS entries generate load commands in matrix.md` - URS.md doesn't have SOPLang; matrix.md has load commands

**3. FS.md SOPLang**
- `generates dependency declaration linking to URS` - Verifies FS references parent URS with `$URS-XXX`

**4. NFS.md SOPLang**
- `generates dependency declaration linking to URS` - Verifies NFS references parent URS with `$URS-XXX`

**5. DS files SOPLang**
- `generates build pipeline with createJSCode and store` - Full pipeline: `@prompt :=`, `createJSCode`, `store`
- `includes multiple dependencies in prompt assignment` - Multiple URS/FS/NFS dependencies
- `handles DS without implementation path` - Uses TBD placeholder

**6. SOPLang comment format validation**
- `all comments use achiles-ide-document structure` - Validates JSON structure
- `commands use correct newline escaping` - Verifies `\\n` for multi-line commands

#### Dependencies
- tests/skills/helpers/skillTestUtils.mjs (makeWorkspace, cleanupWorkspaces)
- GampRSP.mjs

#### Side Effects
- Creates temporary workspaces in tests/.tmp/skill-e2e/
- Workspaces are cleaned up after tests

## Test Results
- Total tests: 10
- Pass: 10
- Fail: 0
