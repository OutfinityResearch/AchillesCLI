import fs from 'node:fs';
import path from 'node:path';
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import AchillesCLI from '../../achilles-cli.mjs';
import { makeWorkspace, createLLM, cleanupWorkspaces } from './helpers/skillTestUtils.mjs';

after(() => cleanupWorkspaces());

test('ignore-files runs via CLI /run and appends entries', async () => {
    const workspaceRoot = makeWorkspace('ignore-files-cli');
    const cli = new AchillesCLI({
        workspaceRoot,
        llmAgent: createLLM({}),
    });

    await cli.processTaskInput('/run ignore-files "tmp,build"');
    const ignorePath = path.join(workspaceRoot, '.specs', '.ignore');
    const content = fs.readFileSync(ignorePath, 'utf8');
    assert.ok(content.includes('tmp'), 'Ignore list should include tmp');
    assert.ok(content.includes('build'), 'Ignore list should include build');
});
