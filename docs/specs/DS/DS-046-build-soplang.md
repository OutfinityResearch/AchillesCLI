# DS-046 – Skill: build-soplang (.AchillesSkills/gamp/build-soplang/mskill.md)

## Version
- current: v1.0
- timestamp: 2025-12-12T10:00:00Z

## Scope & Intent
Parse and compile SOPLang code from markdown files in the .specs directory. The skill calls the `soplang-tool` MCP entrypoint to run `SoplangBuilder.buildFromSpecsMarkdown`, which extracts SOPLang code blocks embedded in HTML comments within markdown files, prioritizes matrix.md code, and builds a consolidated SOPLang document.

## Architecture

The skill operates via MCP AgentClient calling the external `soplangAgent` tool. It uses a fixed payload approach with no user-supplied parameters.

```
+-------------------+       +---------------------+       +---------------------+
| build-soplang     |  MCP  | soplang-tool        |       | SoplangBuilder.js   |
| skill (mskill.md) | ----> | (soplangAgent)      | ----> | buildFromSpecsMarkdown |
+-------------------+       +---------------------+       +---------------------+
                                                                    |
                                                                    v
                                                          +---------------------+
                                                          | .specs/*.md files   |
                                                          | (HTML comments with |
                                                          |  SOPLang code)      |
                                                          +---------------------+
                                                                    |
                                                                    v
                                                          +---------------------+
                                                          | specs-soplang-      |
                                                          | document            |
                                                          | workspace.buildAll()|
                                                          +---------------------+
```

## Traceability
- URS: URS-008 (Skillful automation)
- Requirements: FS-001 (LLM planning & skills orchestration)

## File Impact

### File: achilles-cli/.AchillesSkills/gamp/build-soplang/mskill.md

#### Skill Definition (Light-SOP-Lang)
The skill is defined using Light-SOP-Lang notation:
```
@build soplang-tool '{"pluginName":"SoplangBuilder","methodName":"buildFromSpecsMarkdown","params":[]}' "Run SoplangBuilder from Markdown"
```

#### Allowed Tools
- soplang-tool

#### Instructions
- Always call `soplang-tool` with the fixed payload: `{"pluginName":"SoplangBuilder","methodName":"buildFromSpecsMarkdown","params":[]}`.
- Ignore free-form user prompt content for arguments; rely on the fixed payload.
- Fail loudly if the transport or tool call errors; include the MCP response when successful.

### External Dependency: SOPLangBuilder/soplangAgent/plugins/SoplangBuilder.js

#### Exports
- `buildFromSpecsMarkdown(root?)` — Scans markdown files under the workspace root, extracts SOPLang code from HTML comments containing `achiles-ide-document`, `achiles-ide-chapter`, or `achiles-ide-paragraph` metadata, concatenates extracted code (prioritizing matrix.md), creates/updates a "specs-soplang-document", and runs `workspace.buildAll()`.

#### Registered SOPLang Commands
The `SoplangBuilder` plugin registers custom SOPLang commands via `registerAchillesCLISOPlangCommands(workspace)`:

1. **`load`** — Loads content from a specification file.
   - Syntax: `@VAR load path/to/file.md#SECTION-ID`
   - Example: `@FS-001 load FS.md#FS-001`
   - Resolves paths relative to `.specs/` directory.
   - If `#SECTION-ID` is provided, extracts only that section from the file.

2. **`createJSCode`** — Generates JavaScript code from a prompt using the LLM plugin.
   - Syntax: `@compiledFile createJSCode $prompt`
   - Sends prompt to LLM with code generation system prompt.
   - Returns generated ES module code (async/await style).
   - Falls back to commented placeholder if LLM unavailable.

3. **`store`** — Saves content to a file on disk.
   - Syntax: `@result store "path/to/output.js" $content`
   - Creates parent directories if they don't exist.
   - Resolves paths relative to workspace root.

#### Input/Output
- Input: Optional root directory path (defaults to workspace root via `SOPLANG_WORKSPACE_ROOT` env or `process.cwd()`)
- Output: Object containing:
  - `docId`: Document identifier ("specs-soplang-document")
  - `soplangCodeLength`: Total length of extracted SOPLang code
  - `filesScanned`: Number of markdown files processed
  - `matrixCodeBlocks`: Count of code blocks from matrix.md
  - `otherCodeBlocks`: Count of code blocks from other files
  - `errors`: Array of build errors
  - `durationMs`: Execution time in milliseconds

#### Side Effects
- Reads markdown files recursively from workspace
- Creates or updates "specs-soplang-document" in SOPLang workspace
- Calls `workspace.forceSave()` and `workspace.buildAll()`

#### Dependencies
- Workspace plugin (for save/build operations)
- Documents plugin (for document CRUD operations)
- LLM plugin (for `createJSCode` command)

### Related Helper: achilles-cli/helpers/soplangPrompt.mjs

This helper exports the `SOPLANG_PROMPT` constant, which provides SOPLang syntax reference for LLM prompts. It is imported by `planHelpers.mjs` and included in plan prompts so the LLM understands how to generate proper SOPLang code in specifications.

#### Exports
- `SOPLANG_PROMPT` — String containing SOPLang syntax documentation:
  - Variable syntax (`@var` for output, `$var` for input)
  - `load` command syntax for loading spec files
  - `:=` operator for declaring dependencies
  - `createJSCode` command for code generation
  - `store` command for saving files
  - matrix.md and DS traceability code format examples

### SOPLang Code Extraction Format

SOPLang code is extracted from HTML comments in markdown files with the following structure:
```html
<!--{"achiles-ide-document":{"id":"docId","title":"Title","commands":"@soplang code here"}}-->
<!--{"achiles-ide-chapter":{"title":"Chapter","commands":"@soplang code"}}-->
<!--{"achiles-ide-paragraph":{"text":"Text","commands":"@soplang code"}}-->
```

The `commands` field contains SOPLang code that gets extracted and compiled.

## Tests
- Manual testing via CLI invocation of build-soplang skill.
- Integration verified through successful compilation of .specs SOPLang code.
