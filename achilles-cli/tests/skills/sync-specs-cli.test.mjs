import fs from 'node:fs';
import path from 'node:path';
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import AchillesCLI from '../../achilles-cli.mjs';
import { makeWorkspace, createLLM, cleanupWorkspaces } from './helpers/skillTestUtils.mjs';

after(() => cleanupWorkspaces());

test('sync-specs runs via CLI /run and documents workspace files', { timeout: 20_000 }, async () => {
    const workspaceRoot = makeWorkspace('sync-specs-cli');
    fs.writeFileSync(path.join(workspaceRoot, 'src', 'app.mjs'), 'export const app = () => true;\n');
    const handlers = {
        'sync-specs-plan': () => JSON.stringify([
            { action: 'createURS', title: 'URS sync', description: 'Auto coverage.' },
            { action: 'createFS', title: 'FS sync', description: 'Auto coverage FS.', ursId: 'URS-001' },
            { action: 'createDS', title: 'DS sync', description: 'Auto coverage DS.', architecture: 'Auto', ursId: 'URS-001', reqId: 'FS-001' },
            { action: 'describeFile', dsId: 'DS-001', filePath: 'src/app.mjs', description: 'Document app file.' },
        ]),
    };
    const cli = new AchillesCLI({
        workspaceRoot,
        llmAgent: createLLM(handlers),
    });

    const result = await cli.processTaskInput('/run sync-specs "Sync specs from code"');
    const exec = result?.executions?.[0];
    const dsDir = path.join(workspaceRoot, '.specs', 'DS');
    const dsFiles = fs.existsSync(dsDir) ? fs.readdirSync(dsDir).filter((f) => f.endsWith('.md')) : [];
    const ursDoc = fs.readFileSync(path.join(workspaceRoot, '.specs', 'URS.md'), 'utf8');
    const fsDoc = fs.readFileSync(path.join(workspaceRoot, '.specs', 'FS.md'), 'utf8');
    const dsDoc = dsFiles.length ? fs.readFileSync(path.join(dsDir, dsFiles[0]), 'utf8') : '';

    assert.ok(ursDoc.includes('URS sync'), 'URS anchor should be created');
    assert.ok(fsDoc.includes('FS sync'), 'FS anchor should be created');
    assert.ok(dsFiles.length >= 1, 'At least one DS document should be generated');
    assert.ok(dsDoc.includes('app.mjs'), 'DS should include documented file');
    assert.ok(exec?.status === 'ok', 'Skill execution should succeed');
});
