import fs from 'node:fs';
import path from 'node:path';
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import AchillesCLI from '../../achilles-cli.mjs';
import { makeWorkspace, createLLM, cleanupWorkspaces } from './helpers/skillTestUtils.mjs';

after(() => cleanupWorkspaces());

test('update-specs runs via CLI /run and applies plan', { timeout: 20_000 }, async () => {
    const workspaceRoot = makeWorkspace('update-specs-cli');
    const handlers = {
        'update-specs-plan': () => JSON.stringify([
            { action: 'createURS', title: 'URS telemetry', description: 'Capture telemetry.' },
            { action: 'createFS', title: 'FS telemetry', description: 'Telemetry flow.', ursId: 'URS-001' },
            { action: 'createDS', title: 'DS telemetry', description: 'Design telemetry.', architecture: 'Simple flow', ursId: 'URS-001', reqId: 'FS-001' },
        ]),
    };
    const cli = new AchillesCLI({
        workspaceRoot,
        llmAgent: createLLM(handlers),
    });

    const result = await cli.processTaskInput('/run update-specs "Document telemetry flow"');
    const exec = result?.executions?.[0];
    const dsDir = path.join(workspaceRoot, '.specs', 'DS');
    const dsFiles = fs.existsSync(dsDir) ? fs.readdirSync(dsDir).filter((f) => f.endsWith('.md')) : [];
    const ursDoc = fs.readFileSync(path.join(workspaceRoot, '.specs', 'URS.md'), 'utf8');
    const fsDoc = fs.readFileSync(path.join(workspaceRoot, '.specs', 'FS.md'), 'utf8');
    const dsDoc = dsFiles.length ? fs.readFileSync(path.join(dsDir, dsFiles[0]), 'utf8') : '';

    assert.ok(ursDoc.includes('URS telemetry'), 'URS should be created');
    assert.ok(fsDoc.includes('FS telemetry'), 'FS should be created');
    assert.ok(dsFiles.length >= 1, 'DS should be created');
    assert.ok(dsDoc.includes('DS telemetry'), 'DS content should reflect planned title');
    assert.ok(exec?.status === 'ok', 'Should execute one skill');
});
