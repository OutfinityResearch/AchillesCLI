import fs from 'node:fs';
import path from 'node:path';
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import AchillesCLI from '../../achilles-cli.mjs';
import { makeWorkspace, createLLM, cleanupWorkspaces } from './helpers/skillTestUtils.mjs';

after(() => cleanupWorkspaces());

test('fix-tests-and-code runs via CLI /run and reports attempts', { timeout: 20_000 }, async () => {
    const workspaceRoot = makeWorkspace('fix-tests-cli');
    const scriptPath = path.join(workspaceRoot, 'runAlltests.js');
    fs.writeFileSync(scriptPath, '#!/usr/bin/env node\nconsole.log(\"suite ok\");\nprocess.exit(0);\n');
    fs.chmodSync(scriptPath, 0o755);

    const cli = new AchillesCLI({
        workspaceRoot,
        llmAgent: createLLM({}),
    });

    const result = await cli.processTaskInput('/run fix-tests-and-code "stabilize tests"');
    const exec = result?.executions?.[0];
    const payload = (() => {
        let current = exec?.result || exec;
        for (let i = 0; i < 3; i += 1) {
            if (current?.attempts) return current;
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
    assert.ok(payload?.attempts?.length >= 1, 'Should record at least one attempt');
});
