import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import AchillesCLI from '../../achilles-cli.mjs';
import { makeWorkspace, createLLM, cleanupWorkspaces } from './helpers/skillTestUtils.mjs';

after(() => cleanupWorkspaces());

test('spec-review runs via CLI /run and returns LLM review', async () => {
    const workspaceRoot = makeWorkspace('spec-review-cli');
    const handlers = {
        'spec-review-analysis': () => JSON.stringify({
            summary: 'Specs look ok.',
            issues: [{ id: 'FS-001', severity: 'low', finding: 'Minor detail', recommendation: 'Clarify' }],
            testGaps: ['Add TEST-001'],
        }),
    };
    const cli = new AchillesCLI({
        workspaceRoot,
        llmAgent: createLLM(handlers),
    });

    const result = await cli.processTaskInput('/run spec-review "focus on FS"');
    const exec = result?.executions?.[0];
    let payload = exec?.result || exec;
    for (let i = 0; i < 3; i += 1) {
        if (payload?.review?.summary) break;
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
    assert.equal(payload?.review?.summary, 'Specs look ok.');
    assert.ok(payload?.review?.issues?.length === 1, 'Should surface parsed issues');
});
