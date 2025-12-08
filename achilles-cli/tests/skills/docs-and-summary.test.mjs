import fs from 'node:fs';
import path from 'node:path';
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import AchillesCLI from '../../achilles-cli.mjs';
import { makeWorkspace, createLLM, cleanupWorkspaces } from './helpers/skillTestUtils.mjs';

after(() => cleanupWorkspaces());

test('docs-and-summary runs via CLI and produces summary + html docs', { timeout: 20_000 }, async () => {
    const workspaceRoot = makeWorkspace('docs-summary');
    const cli = new AchillesCLI({
        workspaceRoot,
        llmAgent: createLLM({}),
    });

    const result = await cli.processTaskInput('/run docs-and-summary "preview specs"');
    const summaryPath = path.join(workspaceRoot, '.specs', 'mock', 'spec-summary.html');
    const docsIndex = path.join(workspaceRoot, '.specs', 'html_docs', 'index.html');

    assert.ok(fs.existsSync(summaryPath), 'spec-summary.html should be generated');
    assert.ok(fs.readFileSync(summaryPath, 'utf8').includes('Specification Summary'), 'Summary HTML should contain heading');
    assert.ok(fs.existsSync(docsIndex), 'html_docs index should be generated');
    assert.ok(fs.statSync(docsIndex).size > 0, 'html_docs index should not be empty');
    assert.ok(result?.executions?.length === 1, 'Should execute one skill');
});
