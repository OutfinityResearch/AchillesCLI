import fs from 'node:fs';
import path from 'node:path';
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import AchillesCLI from '../../achilles-cli.mjs';
import { makeWorkspace, createLLM, cleanupWorkspaces } from './helpers/skillTestUtils.mjs';

after(() => cleanupWorkspaces());

test('generate-summary runs via CLI and produces only the summary', { timeout: 20_000 }, async () => {
    const workspaceRoot = makeWorkspace('docs-summary');
    const cli = new AchillesCLI({
        workspaceRoot,
        llmAgent: createLLM({}),
    });

    const result = await cli.processTaskInput('/run generate-summary "preview specs"');
    const summaryPath = path.join(workspaceRoot, '.specs', 'mock', 'spec-summary.html');

    assert.ok(fs.existsSync(summaryPath), 'spec-summary.html should be generated');
    assert.ok(fs.readFileSync(summaryPath, 'utf8').includes('Specification Summary'), 'Summary HTML should contain heading');
    assert.ok(!fs.existsSync(path.join(workspaceRoot, '.specs', 'html_docs', 'index.html')), 'HTML docs should not be generated');
    assert.ok(result?.executions?.length === 1, 'Should execute one skill');
});
