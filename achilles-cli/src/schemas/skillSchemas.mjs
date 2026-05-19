/**
 * Skill Schema Definitions
 * Defines the structure, required sections, and templates for each skill type
 */

import fs from 'node:fs';
import path from 'node:path';

export const SKILL_TYPES = {
    tskill: {
        fileName: 'tskill.md',
        runtimeType: 'dbtable',
        generatedFileName: 'tskill.generated.mjs',
        description: 'Database table skill - defines entity schema with fields, validators, and business rules',
        requiredSections: ['Table Purpose', 'Fields'],
        optionalSections: [
            'Instructions',
            'Help',
            'Role Access Policy',
            'Delete Guard',
            'Interactive Fields',
            'List Extra Fields',
            'Derived Fields',
            'Business Rules',
            'Relationships',
        ],
    },
    cskill: {
        fileName: 'cskill.md',
        runtimeType: 'cskill',
        generatedFileName: null,
        description: 'Code skill - executes a module and uses Input Format for argument extraction',
        requiredSections: ['Input Format'],
        optionalSections: ['Help', 'Constraints', 'Examples'],
        recommendedSections: ['Description', 'Output Format'],
    },
    oskill: {
        fileName: 'oskill.md',
        runtimeType: 'orchestrator',
        generatedFileName: null,
        description: 'Orchestrator skill - routes intents to other skills',
        requiredSections: [],
        optionalSections: ['Description', 'Instructions', 'Preparation', 'Allowed-Skills', 'Allowed-Prep-Skills', 'Session-Type', 'Help'],
        sectionAliases: {
            Instructions: ['instructions', 'guidance', 'overview', 'orchestration-guidance'],
            Preparation: ['preparation', 'prep', 'context-prep'],
            'Allowed-Skills': ['allowed-skills', 'skill-allowlist', 'skill-allow-list', 'skills'],
            'Allowed-Prep-Skills': ['allowed-prep-skills', 'allowed-preparation-skills', 'prep-skills'],
            'Session-Type': ['session', 'session type', 'session-type', 'session_type'],
        },
    },
    mskill: {
        fileName: 'mskill.md',
        runtimeType: 'mcp',
        generatedFileName: null,
        description: 'MCP skill - uses Model Context Protocol tools',
        requiredSections: [],
        optionalSections: ['Description', 'Instructions', 'Allowed-Tools', 'Light-SOP-Lang', 'Help', 'Configuration'],
        sectionAliases: {
            Instructions: ['instructions', 'guidance', 'system-prompt', 'overview', 'mcp-guidance'],
            'Allowed-Tools': ['allowed-tools', 'tool-allowlist', 'tool-allow-list', 'tools'],
            'Light-SOP-Lang': ['light-sop-lang', 'lightsoplang', 'script', 'plan-script'],
        },
    },
    dcgskill: {
        fileName: 'dcgskill.md',
        runtimeType: 'dynamic-code-generation',
        generatedFileName: null,
        description: 'Dynamic code generation skill - LLM decides whether to answer directly or execute generated JavaScript',
        requiredSections: [],
        optionalSections: ['Description', 'Help', 'Prompt', 'Argument', 'Input', 'Parameters', 'LLM Model', 'Examples'],
        sectionAliases: {
            Argument: ['argument', 'input', 'parameters'],
            'LLM Model': ['llm model', 'llm-model', 'model'],
        },
    },
    anthropic: {
        fileName: 'SKILL.md',
        runtimeType: 'anthropic',
        generatedFileName: null,
        description: 'Anthropic-style skill - portable instruction/resource bundle',
        requiredSections: [],
        optionalSections: ['Help', 'Scripts', 'Resources', 'Examples'],
    },
};

export const SKILL_TEMPLATES = {
    tskill: `# [Entity Name]

## Table Purpose
[Explain what entity this table stores, which user workflow it supports, and what record identity means for create/read/update/delete operations.]

## Help
[User-facing invocation guidance shown by hosts. This section does not add generated table behavior.]
Example: /exec [skill-name] create name="Example" status="active"

## Fields
[Each field is declared as a ### subsection. Field-level sections below describe runtime parsing, validation, normalization, presentation, derivation, and identity behavior.]

### field_id
#### Description
[Human-readable purpose of this field.]

#### PrimaryKey
[Primary record identifier. Production table skills should normally define one primary key so record identity is stable.]

#### Aliases
[Alternative names the user or LLM may use for this field.]
["id", "record_id"]

#### Field Value Is Required
[Whether this field must be present during create/update flows.]
Always required.

#### Field Value Validator
[Rules that incoming values must satisfy before the generated runtime accepts them.]
Must match pattern: [ENTITY]-####.

### name
#### Description
[Human-readable name, title, or display label for the record.]

#### Aliases
["title", "label"]

#### Field Value Resolver
[Normalization applied before validation or storage.]
Trim whitespace.

#### Field Value Validator
[Validation rules for accepted values.]
Must be between 2 and 100 characters.

#### Field Value Presenter
[Display formatting used in confirmations, lists, or responses.]
Display in Title Case.

### status
#### Description
[State or lifecycle value for this record.]

#### Field Value Enumerator
[Allowed finite values for this field.]
["active", "inactive", "archived"]

#### Default Value
[Default value used when the user does not provide one.]
"active"

### display_name
#### Description
[Generated or computed field used for presentation.]

#### Field Value Derivator
[How to derive this field from other record fields.]
Combine name and status.

## Role Access Policy
[Optional authorization policy by role and operation. Use only when runtime behavior depends on role-specific access.]
- admin: create, read, update, delete
- user: read

## Delete Guard
[Optional rules that prevent deletion when references, state, or business constraints make deletion unsafe.]
- Do not delete active records.

## Interactive Fields
[Optional fields that should ask for user input or confirmation when missing or ambiguous.]
- name
- status

## List Extra Fields
[Optional fields to include in list/select responses beyond the primary display fields.]
- status

## Derived Fields
[Optional computed values derived from stored fields. Prefer field-level derivators when the behavior belongs to one field.]
- is_active: [Explain the derived value and its calculation, e.g. status === "active".]

## Business Rules
[Optional domain constraints that generated behavior or tests should enforce.]

1. Names must be unique within the relevant parent scope.
2. Archived records cannot return to active status.

## Relationships
[Optional parent/child references to other tables or entities.]
- Parent [ParentEntity]: foreign key parent_id, cascade behavior restrict delete.
- Child [ChildEntity]: referenced by parent_id, cascade behavior set null on delete.
`,

    cskill: `# [Skill Name]

## Description
[Public capability contract for this code skill. The runtime executes src/index.mjs or src/index.js; this descriptor explains what that module is expected to do.]

## Help
[User-facing invocation guidance shown by hosts. This section is informational and does not replace Input Format.]
Example: /exec [skill-name] param1="value" param2="optional value"

## Input Format
[Required by the Code Skills subsystem. Used for argument extraction before calling the module action.]
- **param1**: [Description of first parameter]
  - Type: string | number | object
  - Required: true | false
- **param2**: [Description of second parameter]
  - Type: string | number | object
  - Required: false

## Output Format
[Expected return shape from the module action. Useful for callers, tests, and generation workflows.]
- **Type**: string | object | array
- **Success Example**: "Expected successful output"
- **Error Example**: "Error: Description of error case"

## Constraints
[Operational limits the runtime implementation must respect.]
- [Constraint 1]
- [Constraint 2]
- [Constraint 3]

## Examples
[Concrete examples for users, tests, or generation/refinement workflows.]
- **Input**: \`"example input"\`
- **Expected Output**: \`"example output"\`
- **Input**: \`{ "data": "...", "options": { "format": "json" } }\`
- **Expected Output**: \`{ "result": "..." }\`
`,

    oskill: `# [Orchestrator Name]

## Preparation
[Optional setup instructions executed before the main orchestration session. Use this to load context or inspect state before the main workflow. If omitted, no separate preparation block runs.]

## Allowed-Prep-Skills
[Optional allowlist for preparation. If omitted, preparation uses the main Allowed-Skills list. If present but empty, no preparation skills are available.]
- context-loader

## Allowed-Skills
[Execution allowlist for the main orchestrator. If omitted or empty, agentLib exposes all discovered skills except this orchestrator. Declare this explicitly when the workflow must be bounded.]
- skill_name_1: [When this downstream skill should be used]
- skill_name_2: [When this downstream skill should be used]

## Instructions
[Main orchestration guidance. Explain how to choose among allowed skills, how to sequence them, how to handle ambiguity, and what completion quality means.]
1. Determine which allowed skill should be used first.
2. Keep execution bounded to the declared allowlist.
3. Return a concise final answer after delegated work is complete.

## Session-Type
[Controls which agentic session implementation runs this orchestrator. Accepted values:]
- sop: [Default when omitted. Plan-first execution: the LLM first creates a Plan SOPlang script over the bounded skill surface, then the interpreter executes that plan. Best when the workflow should be inspectable and structured.]
- loop: [Adaptive reasoning-and-action execution: the LLM chooses one tool at a time, observes results, and continues until completion or a bounded stop condition. Best when the workflow needs iterative decisions after each result.]
sop

## Description
[Short operational summary of the workflow. This helps discovery and selection; routing, sequencing, fallback, and completion rules belong in Instructions.]

## Help
[User-facing invocation guidance shown by hosts. This is not part of the orchestration prompt contract.]
Example: /exec [orchestrator-name] describe the workflow or admin task to perform
`,

    mskill: `# [MCP Skill Name]

## Description
[Short summary of the MCP capability and the remote/tooling domain it exposes.]

## Help
[User-facing invocation guidance shown by hosts. This section is informational and does not replace Instructions or Allowed-Tools.]
Example: /exec [skill-name] describe the remote tool task to perform

## Instructions
[Planning guidance used when no explicit Light-SOP-Lang script is present. Accepted aliases: Guidance, System-Prompt, Overview, MCP-Guidance.]
Use the allowed MCP tools to satisfy the request.

## Allowed-Tools
[Allowlist of MCP tool names this skill may call. Accepted aliases: Tool-Allowlist, Tool-Allow-List, Tools. If omitted, the subsystem may use the available tools exposed by the MCP client.]
- tool_name_1
- tool_name_2

## Light-SOP-Lang
[Optional explicit Plan SOPlang script. Accepted aliases: LightSOPLang, Script, Plan-Script. When present, this script is the plan source and bypasses LLM-generated MCP planning.]
@prompt
@tool_name_1 $prompt

## Configuration
[Optional human/host documentation for connection details. The current MCP subsystem does not treat this section as a substitute for the actual MCP client configuration.]
- URL: [MCP server URL or local path]
- Authentication: [auth method if required]
- timeout: 30000
- retries: 3
`,

    dcgskill: `# [Skill Name]

## Description
[Short public summary of the dynamic code generation capability.]

## Help
[User-facing invocation guidance shown by hosts. This section is informational and does not change the dynamic execution path.]
Example: /exec [skill-name] input text or JSON

## Prompt
[Behavioral guidance for the text-or-code decision prompt. The subsystem asks the LLM whether to answer directly or generate JavaScript, then returns text or executes the generated snippet.]
You are a specialized assistant for [task description].

Your responsibilities:
1. [Primary responsibility]
2. [Secondary responsibility]
3. [Additional responsibility]

Input format:
- [Describe expected input]

Output format:
- [Describe expected output]

Error handling:
- [How to handle errors]

## Argument
[Description of the expected input. Accepted aliases: Input, Parameters. This does not rename the runtime argument: the operative argument key is always input.]
Primary natural-language instruction or text payload.

## LLM Model
[Model selector for the dynamic decision prompt. Accepted aliases: LLM-Model, Model. If omitted, agentLib uses the configured code model.]
code

## Examples
[Concrete inputs and expected outcomes for users and refinement workflows.]
- Input: "example input"
  Output: "example output"
- Input: { "data": "...", "options": { "format": "json" } }
  Output: { "result": "..." }
`,

    anthropic: `# [Skill Name]

## Overview
[Operational guidance used as part of the loop-session prompt. Anthropic-style skills do not have a fixed narrow section set; write this file as direct runtime instructions, not loose documentation.]

You are a [role description]. Your task is to [primary objective].

## Help
[User-facing invocation guidance shown by hosts. This section is informational; the raw descriptor body still provides the runtime guidance.]
Example: /exec [skill-name] describe the task

## Guidelines
[Behavioral rules the loop-session runtime should follow.]
- [Guideline 1]
- [Guideline 2]
- [Guideline 3]

## Scripts
[Optional helper surface. If a scripts/ directory exists alongside this file, files in it are exposed through the run-script tool.]
Example: Place executable scripts in \`scripts/\` and invoke them by path (e.g., \`scripts/build.sh\`).

## Resources
[Optional helper surface. If a resources/ directory exists alongside this file, files in it are exposed through the get-resource tool.]
Example: Place reference files in \`resources/\` and read them by path (e.g., \`resources/config.json\`).

## Examples
[Concrete user requests and expected assistant behavior.]
- User: "[example user input]"
  Assistant: "[example assistant response]"
`,
};

function createSectionKey(heading) {
    return String(heading || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function getSectionKeys(content) {
    const keys = new Set();
    const headingRegex = /^#{1,6}\s+(.+)$/gm;
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
        keys.add(createSectionKey(match[1]));
    }
    return keys;
}

function getSectionAliases(schema, section) {
    const aliases = schema?.sectionAliases?.[section] || [];
    return [section, ...aliases].map(createSectionKey).filter(Boolean);
}

function hasSection(sectionKeys, schema, section) {
    return getSectionAliases(schema, section).some((alias) => sectionKeys.has(alias));
}

/**
 * Detect skill type from file content
 * @param {string} content - The skill file content
 * @returns {string|null} - The skill type or null if unknown
 */
export function detectSkillType(content) {
    if (!content || typeof content !== 'string') {
        return null;
    }

    const contentLower = content.toLowerCase();
    const sectionKeys = getSectionKeys(content);

    if (sectionKeys.has('table-purpose') ||
        sectionKeys.has('fields') ||
        contentLower.includes('### field value validator')) {
        return 'tskill';
    }

    if (sectionKeys.has('allowed-skills') ||
        sectionKeys.has('skill-allowlist') ||
        sectionKeys.has('skill-allow-list') ||
        sectionKeys.has('orchestration-guidance') ||
        sectionKeys.has('routing-logic')) {
        return 'oskill';
    }

    if (sectionKeys.has('allowed-tools') ||
        sectionKeys.has('tool-allowlist') ||
        sectionKeys.has('tool-allow-list') ||
        sectionKeys.has('light-sop-lang') ||
        sectionKeys.has('lightsoplang') ||
        sectionKeys.has('mcp-tools') ||
        contentLower.includes('### server connection')) {
        return 'mskill';
    }

    if (sectionKeys.has('input-format')) {
        return 'cskill';
    }

    if (sectionKeys.has('prompt') ||
        sectionKeys.has('argument') ||
        sectionKeys.has('parameters') ||
        sectionKeys.has('llm-model') ||
        sectionKeys.has('model')) {
        return 'dcgskill';
    }

    if (sectionKeys.has('scripts') ||
        sectionKeys.has('resources') ||
        contentLower.includes('run-script') ||
        contentLower.includes('get-resource') ||
        contentLower.includes('ask-user')) {
        return 'anthropic';
    }

    return null;
}

/**
 * Validate a skill file against its schema
 * @param {string} content - The skill file content
 * @param {string} skillType - The skill type (tskill, cskill, etc.)
 * @returns {{valid: boolean, errors: string[], warnings: string[]}}
 */
export function validateSkillContent(content, skillType = null) {
    const errors = [];
    const warnings = [];

    if (!content || typeof content !== 'string') {
        return { valid: false, errors: ['Content is empty or invalid'], warnings: [] };
    }

    // Auto-detect type if not provided
    const type = skillType || detectSkillType(content);
    if (!type) {
        return { valid: false, errors: ['Could not determine skill type'], warnings: [] };
    }

    const schema = SKILL_TYPES[type];
    if (!schema) {
        return { valid: false, errors: [`Unknown skill type: ${type}`], warnings: [] };
    }

    const sectionKeys = getSectionKeys(content);

    // Check required sections
    for (const section of schema.requiredSections) {
        if (!hasSection(sectionKeys, schema, section)) {
            errors.push(`Missing required section: ## ${section}`);
        }
    }

    // Check for title (# heading at start)
    if (!content.trim().startsWith('#')) {
        errors.push('Skill file should start with a # title');
    }

    for (const section of schema.recommendedSections || []) {
        if (!hasSection(sectionKeys, schema, section)) {
            warnings.push(`Recommended section not present: ## ${section}`);
        }
    }

    // Type-specific validation
    if (type === 'tskill') {
        // Check for at least one field definition
        if (!content.includes('### ')) {
            errors.push('Table skill should define at least one field (### field_name)');
        }
    }

    if (type === 'cskill') {
        // cskill uses Input Format and Output Format sections
        // No additional validation needed beyond required sections
    }

    if (type === 'dcgskill') {
        if (!hasSection(sectionKeys, schema, 'Prompt')) {
            warnings.push('Dynamic code generation skill has no ## Prompt section; agentLib will use its default decision prompt.');
        }
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
        detectedType: type,
    };
}

/**
 * Parse sections from a skill file
 * @param {string} content - The skill file content
 * @returns {Object} - Parsed sections as key-value pairs
 */
export function parseSkillSections(content) {
    const sections = {};

    if (!content) return sections;

    // Extract title
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
        sections._title = titleMatch[1].trim();
    }

    // Extract all ## sections
    const sectionRegex = /^##\s+(.+)$\n([\s\S]*?)(?=^##\s+|\n*$)/gm;
    let match;

    while ((match = sectionRegex.exec(content)) !== null) {
        const sectionName = match[1].trim();
        const sectionContent = match[2].trim();
        sections[sectionName] = sectionContent;
    }

    return sections;
}

/**
 * Update a specific section in skill content
 * @param {string} content - Original content
 * @param {string} sectionName - Section to update (without ##)
 * @param {string} newContent - New content for the section
 * @returns {string} - Updated content
 */
export function updateSkillSection(content, sectionName, newContent) {
    const sectionRegex = new RegExp(
        `(^##\\s+${escapeRegex(sectionName)}\\s*\\n)([\\s\\S]*?)(?=^##\\s+|\\n*$)`,
        'mi'
    );

    if (sectionRegex.test(content)) {
        // Section exists, replace it
        return content.replace(sectionRegex, `$1${newContent}\n\n`);
    } else {
        // Section doesn't exist, append it
        return `${content.trim()}\n\n## ${sectionName}\n${newContent}\n`;
    }
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Load specs content from a skill directory
 * @param {string} skillDir - Path to the skill directory
 * @returns {string|null} - Specs content or null if not found
 */
export function loadSpecsContent(skillDir) {
    if (!skillDir) return null;
    const chunks = [];
    const specsDir = path.join(skillDir, 'specs');
    try {
        if (fs.existsSync(specsDir) && fs.statSync(specsDir).isDirectory()) {
            const files = [];
            const queue = [specsDir];
            while (queue.length > 0) {
                const current = queue.shift();
                const entries = fs.readdirSync(current, { withFileTypes: true });
                for (const entry of entries) {
                    const entryPath = path.join(current, entry.name);
                    if (entry.isDirectory()) {
                        if (entry.name !== '.backup') queue.push(entryPath);
                    } else if (entry.name.toLowerCase().endsWith('.md') || entry.name.toLowerCase().endsWith('.mds')) {
                        files.push(entryPath);
                    }
                }
            }
            for (const filePath of files.sort()) {
                const relPath = path.relative(skillDir, filePath);
                chunks.push(`# ${relPath}\n\n${fs.readFileSync(filePath, 'utf8')}`);
            }
        }
    } catch (error) {
        // Specs are optional, silently ignore errors
    }
    return chunks.length ? chunks.join('\n\n---\n\n') : null;
}

/**
 * Format specs content for inclusion in LLM prompts
 * @param {string|null} specsContent - The specs/ file content
 * @returns {string} - Formatted specs block or empty string
 */
export function buildSpecsContext(specsContent) {
    if (!specsContent) return '';
    return `
## Skill Specifications
The following specifications define requirements and constraints for this skill:

${specsContent}

---
IMPORTANT: Ensure all modifications comply with the above specifications.
`;
}

/**
 * Extract validation requirements from specs content
 *
 * Specs files can include a "## Validation Requirements" section that defines
 * custom validation rules for the skill.
 *
 * @param {string} specsContent - The specs content
 * @returns {Object|null} Validation requirements or null
 */
export function extractValidationRequirements(specsContent) {
    if (!specsContent) return null;

    // Look for ## Validation Requirements section
    const validationMatch = specsContent.match(
        /##\s+Validation\s+Requirements\s*\n([\s\S]*?)(?=\n##\s+|$)/i
    );

    if (validationMatch) {
        const content = validationMatch[1].trim();
        // Parse requirements (simple line-based format)
        const requirements = {
            requiredExports: [],
            requiredFields: [],
            customRules: [],
        };

        const lines = content.split('\n');
        let currentSection = null;

        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('### Required Exports')) {
                currentSection = 'requiredExports';
            } else if (trimmed.startsWith('### Required Fields')) {
                currentSection = 'requiredFields';
            } else if (trimmed.startsWith('### Custom Rules')) {
                currentSection = 'customRules';
            } else if (trimmed.startsWith('- ') && currentSection) {
                requirements[currentSection].push(trimmed.slice(2));
            }
        }

        return requirements;
    }

    return null;
}

/**
 * Validate a tskill using requirements from its specs content
 * @param {string} skillName - The skill name
 * @param {string} content - The tskill.md content
 * @param {string} specsContent - The specs content
 * @returns {{isValid: boolean, errors: string[], warnings: string[]}}
 */
export function validateTskillWithSpecs(skillName, content, specsContent = null) {
    // First run generic validation
    const genericResult = validateSkillContent(content, 'tskill');
    const errors = [...genericResult.errors];
    const warnings = [...genericResult.warnings];

    // If specs has validation requirements, apply them
    if (specsContent) {
        const requirements = extractValidationRequirements(specsContent);

        if (requirements) {
            // Check required fields
            for (const field of requirements.requiredFields) {
                const fieldPattern = new RegExp(`###\\s+${field}`, 'i');
                if (!fieldPattern.test(content)) {
                    errors.push(`Missing required field: ### ${field}`);
                }
            }

            // Custom rules are informational warnings
            for (const rule of requirements.customRules) {
                warnings.push(`Custom rule: ${rule}`);
            }
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        detectedType: genericResult.detectedType,
    };
}

/**
 * Validate generated code using requirements from specs content
 * @param {string} code - The generated .mjs code
 * @param {string} skillName - The skill name
 * @param {string} specsContent - The specs content
 * @returns {{isValid: boolean, errors: string[], warnings: string[]}}
 */
export function validateGeneratedCodeWithSpecs(code, skillName, specsContent = null) {
    const errors = [];
    const warnings = [];

    if (!code || typeof code !== 'string') {
        return { isValid: false, errors: ['Code is empty'], warnings: [] };
    }

    // Generic code validation
    if (!code.includes('export default')) {
        warnings.push('Missing default export');
    }

    // If specs has validation requirements, check required exports
    if (specsContent) {
        const requirements = extractValidationRequirements(specsContent);

        if (requirements?.requiredExports) {
            for (const exportName of requirements.requiredExports) {
                const exportPattern = new RegExp(
                    `export\\s+(async\\s+)?function\\s+${exportName}|export\\s+const\\s+${exportName}`
                );
                if (!exportPattern.test(code)) {
                    errors.push(`Missing required export: ${exportName}`);
                }
            }
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}

export default {
    SKILL_TYPES,
    SKILL_TEMPLATES,
    detectSkillType,
    validateSkillContent,
    parseSkillSections,
    updateSkillSection,
    loadSpecsContent,
    buildSpecsContext,
    // Specs-based validation (uses specs content for custom requirements)
    extractValidationRequirements,
    validateTskillWithSpecs,
    validateGeneratedCodeWithSpecs,
};
