import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import AchillesCLI from '../../achilles-cli.mjs';
import { makeWorkspace, createLLM, cleanupWorkspaces } from './helpers/skillTestUtils.mjs';

after(() => cleanupWorkspaces());

test('spec-help runs via CLI /run and returns help payload', async () => {
    const workspaceRoot = makeWorkspace('spec-help-cli');
    const cli = new AchillesCLI({
        workspaceRoot,
        llmAgent: createLLM({}),
    });

    const result = await cli.processTaskInput('/run spec-help "explain flow"');
    const exec = result?.executions?.[0];
    let payload = exec?.result || exec;
    for (let i = 0; i < 3; i += 1) {
        if (payload?.help?.introduction) break;
        if (payload?.result && typeof payload.result === 'object') {
            payload = payload.result;
            continue;
        }
        if (payload?.output && typeof payload.output === 'object') {
            payload = payload.output;
            continue;
        }
        break;
    }
    assert.ok(payload?.help?.introduction, 'Help introduction should be present');
});
