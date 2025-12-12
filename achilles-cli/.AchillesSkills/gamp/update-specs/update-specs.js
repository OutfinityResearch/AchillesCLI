import GampRSP from '../../../GampRSP.mjs';
import {
    ensureLLM,
    summariseSpecs,
    parsePlan,
    executePlan,
} from '../utils/specPlanner.mjs';

const buildPlannerPrompt = ({ task, specs }) => {
    const instructions = [
        '# Specification Update Planner',
        'Act as a senior regulated-software architect. Produce concrete specification text, not reminders to "create" specs.',
        '- Prefer narrative sentences with clear subject and predicate; avoid bullet lists unless the content is a short enumeration. Architecture chapters must be written as cohesive paragraphs that explain relationships between components.',
        '- URS: articulate business intent, regulatory drivers, constraints, and traceability toward FS/NFS.',
        '- FS: describe observable behaviour (actors, flows, data validation, error handling, audit trail expectations) and forward-link to DS.',
        '- NFS: quantify quality envelopes (performance, security, availability, operability) with explicit metrics.',
        '- DS: for each requirement, provide architecture notes (components, data flows, telemetry, rollout) as paragraph-form explanations of how pieces interact, and include a "File Impact" chapter listing each touched file (path, exports, dependencies, side effects, concurrency). Do not use bullet point list. When the architecture or export interactions are complex, add an ASCII/text diagram to illustrate the flow.',
        '- For every impacted file, emit a describeFile action that includes why/how/what details and export/dependency arrays.',
        '- When a file already has DS coverage, mention the related DS identifiers and summarise their responsibilities before describing the new behaviour so generators have full context.',
        '- Detail the semantics of every function/class expected inside the file so downstream builders know exactly what to emit, including inputs/outputs, side effects, and error handling; add a lightweight ASCII/text diagram when the control flow is non-trivial.',
        '- Update each DS "Exports" chapter so every exported symbol has an intelligible, task-focused description (what it orchestrates, key inputs/outputs, side effects, concurrency assumptions) and include ASCII/text diagrams when a flow is complex.',
        '- For every test-related action, describe explicitly what files are created/modified/deleted and what assertions a reader should expect (e.g., which DS/URS/FS files are touched, which source files are generated, which logs/HTML summaries should appear). Make the tests self-explanatory so a reader can tell which filesystem effects are being verified.',
        '- For every DS, emit createTest actions describing folder layout, env var expectations (.env discovery), temporary-folder conventions, runAlltests suite names, and clean-up policy — limit yourself to at most 3 tests per request and only when traceability needs them.',
        '- In describeFile actions, include exports as an array of objects { "name": "fnName", "description": "what this export does", "diagram?": "ASCII/text diagram when helpful" } with specific, implementation-ready explanations (avoid vague one-liners).',
        '- Never trigger sync-specs, build-code, or run-tests from this skill; focus strictly on documentation updates.',
        '- Only act on the instructions supplied in the Change Request; do not perform reverse engineering unless the user explicitly requests it.',
        '- Never delete specs; mark them inactive via retire/update actions if needed.',
        '- Reuse existing IDs when possible; only create new URS/FS/DS when a new requirement is introduced.',
        '',
        '## SOPLang Integration',
        'The system automatically generates SOPLang code in Traceability sections based on the IDs you provide.',
        'When creating DS specs, you can specify multiple dependencies:',
        '- ursIds: array of URS IDs (e.g., ["URS-001", "URS-002"]) → become $URS-001 $URS-002 in SOPLang',
        '- reqIds: array of FS/NFS IDs (e.g., ["FS-001", "NFS-002"]) → become $FS-001 $NFS-002 in SOPLang',
        '- dsIds: array of related DS IDs (e.g., ["DS-005"]) → become $DS-005 in SOPLang (for DS dependencies)',
        '- implementationPath: relative path to the JS file that will be generated (e.g., "src/features/auth.js")',
        'Example generated SOPLang: @prompt := $DS-XXX $URS-001 $FS-001 $NFS-002 $DS-005\\n@compiledFile createJSCode $prompt\\n@result store "path" $compiledFile',
        '',
        'Allowed actions:',
        '- createURS { "title", "description" }',
        '- updateURS { "id", "title", "description" }',
        '- retireURS { "id" }',
        '- createFS { "title", "description", "ursId", "reqId?" }',
        '- updateFS { "id", "title", "description", "ursId" }',
        '- createNFS { "title", "description", "ursId", "reqId?" }',
        '- updateNFS { "id", "title", "description", "ursId" }',
        '- createDS { "title", "description", "architecture", "ursIds":[], "reqIds":[], "dsIds":[], "implementationPath?" }',
        '- updateDS { "id", "description", "architecture" }',
        '- createTest { "dsId", "title", "description" }',
        '- describeFile { "dsId", "filePath", "why", "how", "what", "description", "exports":[], "dependencies":[], "sideEffects", "concurrency" }',
        '',
        '## Current Specs Snapshot',
        specs || '<empty>',
        '',
        '## Change Request',
        task || '<empty>',
        '',
        '## Response Format',
        '[{"action":"createURS","title":"Demo requirement","description":"..."}]',
    ];
    return instructions.join('\n');
};

export async function action({ prompt, context }) {
    const workspaceRoot = context.workspaceRoot || process.cwd();
    GampRSP.configure(workspaceRoot);
    const llm = ensureLLM(context);
    const specsSnapshot = summariseSpecs();
    let plan = [];

    try {
        const rawPlan = await llm.executePrompt(buildPlannerPrompt({ task: prompt, specs: specsSnapshot }), {
            responseShape: 'json',
            context: { intent: 'update-specs-plan' },
        });
        plan = parsePlan(rawPlan);
    } catch (error) {
        throw new Error(`Unable to obtain specification plan from the LLM: ${error.message}`);
    }

    if (!plan.length) {
        throw new Error('The LLM did not return any specification actions. Refine the prompt or rerun when the LLM is available.');
    }

    const outcomes = executePlan(plan);
    return {
        message: 'Specifications updated via planner.',
        actions: outcomes,
    };
}

export default action;
