import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline';
import AchillesCLI from '../achilles-cli.mjs';
import { envAutoConfig } from 'achillesAgentLib/LLMAgents';

envAutoConfig(); // configure real LLM from environment (no mocks)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CASES_DIR = path.join(__dirname, 'cases');

const COLORS = {
    RESET: '\x1b[0m',
    RED: '\x1b[31m',
    GREEN: '\x1b[32m',
    YELLOW: '\x1b[33m',
};

const normalize = (value) => String(value || '').trim().toLowerCase();

const loadCases = async (caseFilter = null) => {
    const entries = await fs.readdir(CASES_DIR);
    const cases = [];
    for (const file of entries.filter((f) => f.endsWith('.json')).sort()) {
        const raw = await fs.readFile(path.join(CASES_DIR, file), 'utf8');
        const parsed = JSON.parse(raw);
        if (caseFilter && parsed.id !== caseFilter) {
            continue;
        }
        cases.push({
            id: parsed.id || file.replace(/\.json$/, ''),
            prompt: parsed.prompt || '',
            expected: parsed.expected || {},
        });
    }
    return cases;
};

const parseArgs = () => {
    const args = process.argv.slice(2);
    let times = 1;
    let caseId = null;
    args.forEach((arg, idx) => {
        if (arg === '--times' || arg === '-t') {
            const next = Number.parseInt(args[idx + 1], 10);
            if (Number.isFinite(next) && next > 0) {
                times = next;
            }
        }
        if (arg === '--case' || arg === '-c') {
            caseId = args[idx + 1] || null;
        }
    });
    return { times, caseId };
};

const makeWorkspace = async (label) => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), `achilles-eval-${label}-`));
    await fs.mkdir(path.join(tmp, 'src'), { recursive: true });
    await fs.writeFile(path.join(tmp, 'package.json'), JSON.stringify({ name: label, version: '1.0.0', type: 'module' }, null, 2));
    return tmp;
};

const evaluatePlan = (plan, expected) => {
    const skills = Array.isArray(plan) ? plan.map((step) => normalize(step.skill)) : [];
    const expectedSkills = Array.isArray(expected.plan) && expected.plan.length
        ? expected.plan.map(normalize)
        : (expected.skill ? [normalize(expected.skill)] : []);
    if (!expectedSkills.length) {
        return { ok: false, reason: 'No expected skills provided.' };
    }
    const ok = expectedSkills.every((skill, idx) => skills[idx] === skill);
    const reason = ok ? '' : `Expected plan to start with [${expectedSkills.join(', ')}], got [${skills.join(', ')}]`;
    return { ok, reason, skills };
};

const runCase = async (testCase, runIndex = 0) => {
    const workspaceRoot = await makeWorkspace(`${testCase.id}-${runIndex}`);
    const cli = new AchillesCLI({
        workspaceRoot,
        interactive: false,
    });
    const plan = await cli.preparePlan(testCase.prompt);
    return {
        plan,
        workspaceRoot,
    };
};

const printLine = (text, color = COLORS.RESET) => {
    // eslint-disable-next-line no-console
    console.log(`${color}${text}${COLORS.RESET}`);
};

const spinner = (label) => {
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let idx = 0;
    const interval = setInterval(() => {
        const frame = frames[idx % frames.length];
        idx += 1;
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`${frame} ${label}`);
    }, 120);
    return () => {
        clearInterval(interval);
        readline.cursorTo(process.stdout, 0);
        readline.clearLine(process.stdout, 0);
    };
};

async function main() {
    const { times, caseId } = parseArgs();
    const cases = await loadCases(caseId);
    if (!cases.length) {
        printLine('No eval cases found.', COLORS.RED);
        process.exit(1);
    }

    let passed = 0;
    let failed = 0;
    for (const testCase of cases) {
        for (let i = 0; i < times; i += 1) {
            const stop = spinner(`Running ${testCase.id} (${i + 1}/${times})`);
            try {
                const { plan } = await runCase(testCase, i);
                stop();
                const evalResult = evaluatePlan(plan, testCase.expected);
                if (evalResult.ok) {
                    passed += 1;
                    printLine(`[PASS] ${testCase.id} (${i + 1}/${times})`, COLORS.GREEN);
                } else {
                    failed += 1;
                    printLine(`[FAIL] ${testCase.id} (${i + 1}/${times}) - ${evalResult.reason}`, COLORS.RED);
                }
            } catch (error) {
                stop();
                failed += 1;
                printLine(`[FAIL] ${testCase.id} (${i + 1}/${times}) - Error: ${error.message}`, COLORS.RED);
            }
        }
    }

    printLine(`\nSummary: ${passed} passed, ${failed} failed (runs=${passed + failed})`, failed ? COLORS.RED : COLORS.GREEN);
}

main().catch((error) => {
    printLine(`[fatal] ${error.message}`, COLORS.RED);
    process.exit(1);
});
