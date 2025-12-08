import fs from 'node:fs';
import path from 'node:path';
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import AchillesCLI from '../../achilles-cli.mjs';
import { makeWorkspace, createLLM, cleanupWorkspaces } from './helpers/skillTestUtils.mjs';

after(() => cleanupWorkspaces());

test('generate-docs runs via CLI /run and writes html docs', { timeout: 15_000 }, async () => {
    const workspaceRoot = makeWorkspace('generate-docs-cli');
    const cli = new AchillesCLI({
        workspaceRoot,
        llmAgent: createLLM({}),
    });

    const result = await cli.processTaskInput('/run generate-docs "Generate docs"');
    const docsIndex = path.join(workspaceRoot, '.specs', 'html_docs', 'index.html');
    assert.ok(fs.existsSync(docsIndex), 'html_docs index should be generated');
    assert.ok(result?.executions?.length === 1, 'Should execute one skill');
});
