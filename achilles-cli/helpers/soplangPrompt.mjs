export const SOPLANG_PROMPT = `
SOPLang Syntax for Specifications

SOPLang code is embedded in HTML comments within markdown specification files:
\`<!--{"achiles-ide-document":{"commands":"@soplang code"}}-->\`

Use \\n for newlines within the commands string (JSON-escaped).

Variables:
- \`@var\` — output variable (receives result)
- \`$var\` — input variable (references existing value)

Commands Used in Specifications:

1. Load specification file:
   \`@FS-001 load FS.md#FS-001\`
   \`@DS-001 load DS/DS-001-filename.md\`

2. Declare dependencies:
   \`@FS-001 := $URS-001 $URS-002\`
   \`@DS-001 := $FS-001 $FS-002\`

3. Generate code from specification (DS files):
   \`@prompt := $DS-001 $FS-001 $FS-002\`
   \`@compiledFile createJSCode $prompt\`
   \`@result store "/path/to/output.js" $compiledFile\`

Comments:
- Lines starting with \`#\` or \`//\` are ignored

matrix.md SOPLang Code:
The matrix.md file serves as the central registry that loads all specification files as variables. It contains one \`load\` command per specification entry (URS, FS, NFS, DS). These variables can then be referenced by other specs using \`$VAR-ID\` syntax.

Format:
\`\`\`
@URS-001 load URS.md#URS-001
@URS-002 load URS.md#URS-002
@FS-001 load FS.md#FS-001
@FS-002 load FS.md#FS-002
@NFS-001 load NFS.md#NFS-001
@DS-001 load DS/DS-001-filename.md
@DS-002 load DS/DS-002-filename.md
\`\`\`

DS Traceability SOPLang Code:
Each DS file contains SOPLang code that declares dependencies (URS, FS, NFS, other DS) and build instructions. The current DS ID ($DS-XXX) is always included first, followed by all dependencies.

Format:
\`\`\`
@prompt := $DS-001 $URS-001 $URS-002 $FS-001 $NFS-002 $DS-005
@compiledFile createJSCode $prompt
@result store "src/feature.js" $compiledFile
\`\`\`

Where:
- $DS-001 is the current DS file
- $URS-001, $URS-002 are URS dependencies
- $FS-001 is an FS dependency
- $NFS-002 is an NFS dependency
- $DS-005 is another DS dependency
`.trim();

export default {
    SOPLANG_PROMPT,
};
