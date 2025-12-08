import fs from 'node:fs';
import path from 'node:path';
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import AchillesCLI from '../../achilles-cli.mjs';
import GampRSP from '../../GampRSP.mjs';
import { makeWorkspace, createLLM, cleanupWorkspaces } from './helpers/skillTestUtils.mjs';

after(() => cleanupWorkspaces());

test('build-code runs via CLI /run and generates files from DS', { timeout: 25_000 }, async () => {
    const workspaceRoot = makeWorkspace('build-code-cli');
    GampRSP.configure(workspaceRoot);
    const ursId = GampRSP.createURS('URS codegen', 'Auto build.');
    const fsId = GampRSP.createFS('FS codegen', 'Auto build FS.', ursId);
    const dsId = GampRSP.createDS('DS codegen', 'Design codegen.', 'Architecture TBD.', ursId, fsId);
    GampRSP.describeFile(
        dsId,
        'src/generated/demo.mjs',
        'Generated file.',
        ['demo'],
        [],
        {
            why: 'Provide demo function.',
            how: 'LLM builds stub.',
            what: 'Exports demo().',
            sideEffects: 'None',
            concurrency: 'Stateless',
        },
    );

    const handlers = {
        'build-code-generate': () => 'export const demo = () => "built";',
    };

    const cli = new AchillesCLI({
        workspaceRoot,
        llmAgent: createLLM(handlers),
    });

    const result = await cli.processTaskInput('/run build-code "Build code from DS"');
    const generatedPath = path.join(workspaceRoot, 'src', 'generated', 'demo.mjs');
    const content = fs.readFileSync(generatedPath, 'utf8');
    assert.ok(content.includes('demo'), 'Generated file should include demo export');
    assert.ok(result?.executions?.length === 1, 'Should execute one skill');
});
