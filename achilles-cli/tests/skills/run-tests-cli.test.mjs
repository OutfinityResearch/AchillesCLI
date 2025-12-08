import fs from 'node:fs';
import path from 'node:path';
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import AchillesCLI from '../../achilles-cli.mjs';
import { makeWorkspace, createLLM, cleanupWorkspaces } from './helpers/skillTestUtils.mjs';

after(() => cleanupWorkspaces());

test('run-tests executes runAlltests.js via CLI /run', { timeout: 15_000 }, async () => {
    const workspaceRoot = makeWorkspace('run-tests-cli');
    const scriptPath = path.join(workspaceRoot, 'runAlltests.js');
    fs.writeFileSync(scriptPath, '#!/usr/bin/env node\nconsole.log(\"tests ok\");\nprocess.exit(0);\n');
    fs.chmodSync(scriptPath, 0o755);

    const cli = new AchillesCLI({
        workspaceRoot,
        llmAgent: createLLM({}),
    });

    const result = await cli.processTaskInput('/run run-tests "FS-001"');
    const exec = result?.executions?.[0];
    const payload = (() => {
        let current = exec?.result || exec;
        for (let i = 0; i < 3; i += 1) {
            if (current?.exitCode !== undefined || current?.status !== undefined) {
                return current;
            }
            if (current?.result && typeof current.result === 'object') {
                current = current.result;
                continue;
            }
            if (current?.output && typeof current.output === 'object') {
                current = current.output;
                continue;
            }
            break;
        }
        return current;
    })();
    assert.ok((payload?.stdout || '').includes('tests ok'), 'run-tests should stream child stdout');
    assert.ok(payload?.exitCode === 0 || payload?.status === 'passed', 'run-tests should report success');
});
