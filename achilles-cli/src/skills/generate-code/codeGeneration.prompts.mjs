/**
 * Code Generation Prompts
 * Prompts used by the generate-code skill for generating .mjs code from skill definitions
 *
 * This module is project-agnostic. Skills can define their own code generation
 * requirements in their specs/ files using a "## Code Generation Prompt" section.
 */

/**
 * Extract code generation prompt from specs content
 *
 * Specs content can include a "## Code Generation Prompt" section that contains
 * the full prompt template for generating code for this specific skill.
 *
 * Template variables supported:
 * - {{skillName}} - The skill name
 * - {{entityName}} - Entity name extracted from skill name
 * - {{content}} - The full skill definition content
 * - {{sections}} - JSON of parsed sections (for advanced use)
 *
 * @param {string} specsContent - Specs content content
 * @returns {string|null} The code generation prompt template or null
 */
function extractCodeGenPromptFromSpecs(specsContent) {
    if (!specsContent) return null;

    // Look for ## Code Generation Prompt section
    const promptMatch = specsContent.match(
        /##\s+Code\s+Generation\s+Prompt\s*\n([\s\S]*?)(?=\n##\s+|$)/i
    );

    if (promptMatch) {
        return promptMatch[1].trim();
    }

    return null;
}

/**
 * Extract validation requirements from specs content
 *
 * @param {string} specsContent - Specs content content
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
 * Apply template variables to a prompt template
 *
 * @param {string} template - The prompt template with {{variable}} placeholders
 * @param {Object} vars - Variables to substitute
 * @returns {string} The processed prompt
 */
function applyTemplateVars(template, vars) {
    let result = template;

    for (const [key, value] of Object.entries(vars)) {
        const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        const stringValue = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
        result = result.replace(placeholder, stringValue);
    }

    return result;
}

/**
 * Extract entity name from skill name
 * @param {string} skillName - The skill name
 * @returns {string} The entity name
 */
function extractEntityName(skillName) {
    return skillName
        .replace(/-skill.*$/, '')
        .replace(/-tskill$/, '')
        .replace(/-dbtable$/, '')
        .toLowerCase();
}

/**
 * Build the prompt for code generation from a tskill definition
 *
 * Priority:
 * 1. If specs content has a "## Code Generation Prompt" section, use that
 * 2. Otherwise, use the generic prompt with specs content as context
 *
 * @param {string} skillName - The name of the skill
 * @param {string} content - The full skill definition content
 * @param {Object} sections - Parsed sections from the skill definition
 * @param {string|null} specsContent - Optional specs content
 * @returns {string} The prompt for the LLM
 */
export function buildCodeGenPrompt(skillName, content, sections, specsContent = null) {
    // Check if specs has a code generation prompt
    const customPrompt = extractCodeGenPromptFromSpecs(specsContent);

    if (customPrompt) {
        // Use custom prompt from specs content
        const entityName = extractEntityName(skillName);
        return applyTemplateVars(customPrompt, {
            skillName,
            entityName,
            content,
            sections,
        });
    }

    // Fall back to generic prompt with specs as context
    return buildGenericTskillPrompt(skillName, content, sections, specsContent);
}

/**
 * Generic tskill code generation prompt (project-agnostic)
 */
function buildGenericTskillPrompt(skillName, content, sections, specsContent = null) {
    const specsBlock = specsContent ? `
## Skill Specifications
The following specifications define requirements and constraints for this skill:

${specsContent}

---
IMPORTANT: Ensure generated code complies with all specifications above.
` : '';

    return `Generate JavaScript/ESM code for a database table skill based on this definition.

## Skill Name: ${skillName}
${specsBlock}
## Skill Definition:
${content}

## Requirements:
1. Generate clean, modern ESM code (export functions, no CommonJS)
2. Include all validators defined in the skill
3. Include all enumerators defined in the skill
4. Include all presenters defined in the skill
5. Include all resolvers defined in the skill
6. Include a selectRecords function for filtering
7. Include a prepareRecord function for pre-DB transformation
8. Include a validateRecord function for full record validation
9. Use JSDoc comments for documentation
10. Export all functions individually AND as a default object

## Expected Exports:
- validator_<fieldName>(value, record) - returns error string or empty/null if valid
- enumerator_<fieldName>() - returns array of allowed values
- presenter_<fieldName>(value) - returns formatted display value
- resolver_<fieldName>(humanValue, record) - converts human input to DB format
- selectRecords(records, filters) - filters array of records
- prepareRecord(record) - transforms record before DB insert
- validateRecord(record) - validates entire record, returns {valid, errors}

## Code Style:
- Use arrow functions for simple operations
- Use async/await if needed
- Handle null/undefined gracefully
- Return meaningful error messages

Generate ONLY the JavaScript code, no markdown code blocks, no explanations.`;
}

/**
 * Build the prompt for code generation from a cskill (code) definition
 * @param {string} skillName - The name of the skill
 * @param {string} content - The full skill definition content
 * @param {Object} sections - Parsed sections from the skill definition
 * @param {string|null} specsContent - Optional specs content
 * @returns {string} The prompt for the LLM
 */
export function buildCskillCodeGenPrompt(skillName, content, sections, specsContent = null) {
    const specsBlock = specsContent ? `
## Skill Specifications
${specsContent}

---
` : '';

    return `Generate JavaScript/ESM code for a cskill runtime module compatible with achillesAgentLib CodeSkillsSubsystem.

## Skill Name: ${skillName}
${specsBlock}
## Skill Definition:
${content}

## Requirements:
1. Generate clean modern ESM code, no CommonJS.
2. Export an async \`action(invocation = {})\` function.
3. The function receives a single invocation object from agentLib, including \`promptText\`, \`mainAgent\`, \`llmAgent\`, \`context\`, \`user\`, \`attachments\`, and optional \`signal\`.
4. Use the descriptor's "Input Format" section as the public argument contract.
5. Return a string or JSON-serializable value.
6. Do not require a second context argument; CodeSkillsSubsystem calls \`module.action(invocation)\`.

## Expected Structure:

\`\`\`javascript
export async function action(invocation = {}) {
    const { promptText = '', llmAgent = null, signal = null } = invocation;
    if (signal?.aborted) {
        const error = new Error('Skill execution cancelled.');
        error.name = 'AbortError';
        throw error;
    }
    return String(promptText || '').trim();
}
\`\`\`

## Code Style:
- Keep the module self-contained.
- Use async/await for asynchronous work.
- Check \`signal.aborted\` before expensive operations.
- Throw clear errors for invalid input.

Generate ONLY the JavaScript code, no markdown code blocks, no explanations.`;
}

export default {
    buildCodeGenPrompt,
    buildCskillCodeGenPrompt,
};
