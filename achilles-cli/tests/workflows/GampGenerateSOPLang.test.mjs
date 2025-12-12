import fs from 'node:fs';
import path from 'node:path';
import { test, after, describe } from 'node:test';
import assert from 'node:assert/strict';
import { makeWorkspace, cleanupWorkspaces } from '../skills/helpers/skillTestUtils.mjs';
import GampRSP from '../../GampRSP.mjs';

after(() => cleanupWorkspaces());

/**
 * Tests for GampRSP SOPLang code generation.
 *
 * Validates that GampRSP generates valid SOPLang code embedded in HTML comments
 * for all specification file types (URS, FS, NFS, DS, matrix.md).
 *
 * SOPLang code format:
 * <!--{"achiles-ide-document":{"commands":"@soplang code"}}-->
 */

const extractSoplangComments = (content) => {
    const comments = [];
    const commentRegex = /<!--([\s\S]*?)-->/g;
    let match;
    while ((match = commentRegex.exec(content)) !== null) {
        try {
            const parsed = JSON.parse(match[1].trim());
            if (parsed['achiles-ide-document']?.commands) {
                comments.push({
                    raw: match[0],
                    parsed,
                    commands: parsed['achiles-ide-document'].commands
                });
            }
        } catch (_) {
            // Not a JSON comment, skip
        }
    }
    return comments;
};

describe('GampRSP SOPLang Generation', () => {

    describe('matrix.md SOPLang', () => {

        test('generates load commands for all spec types', { timeout: 10_000 }, async () => {
            const workspaceRoot = makeWorkspace('gamp-soplang-matrix');
            GampRSP.configure(workspaceRoot);

            const ursId = GampRSP.createURS('Matrix URS', 'Test URS.');
            const fsId = GampRSP.createFS('Matrix FS', 'Test FS.', ursId);
            const nfsId = GampRSP.createNFS('Matrix NFS', 'Test NFS.', ursId);
            const dsId = GampRSP.createDS('Matrix DS', 'Test DS.', 'Arch.', ursId, fsId);

            const matrixPath = path.join(workspaceRoot, '.specs', 'matrix.md');
            const content = fs.readFileSync(matrixPath, 'utf8');
            const comments = extractSoplangComments(content);

            assert.ok(comments.length > 0, 'matrix.md should contain SOPLang comments');

            const commands = comments.map(c => c.commands).join('\n');
            assert.ok(commands.includes('@URS-001 load URS.md#URS-001'), 'Should have load for URS-001');
            assert.ok(commands.includes('@FS-001 load FS.md#FS-001'), 'Should have load for FS-001');
            assert.ok(commands.includes('@NFS-001 load NFS.md#NFS-001'), 'Should have load for NFS-001');
            assert.ok(commands.includes('@DS-001 load DS/DS-001'), 'Should have load for DS-001');
        });

        test('uses correct load syntax with file path and anchor', { timeout: 10_000 }, async () => {
            const workspaceRoot = makeWorkspace('gamp-soplang-load-syntax');
            GampRSP.configure(workspaceRoot);

            GampRSP.createURS('Load Syntax URS', 'Testing load syntax.');
            GampRSP.createFS('Load Syntax FS', 'Testing load syntax.', 'URS-001');

            const matrixPath = path.join(workspaceRoot, '.specs', 'matrix.md');
            const content = fs.readFileSync(matrixPath, 'utf8');
            const comments = extractSoplangComments(content);
            // Replace escaped newlines with actual newlines for regex matching
            const commands = comments.map(c => c.commands.replace(/\\n/g, '\n')).join('\n');

            // Verify load syntax: @VAR load path#anchor
            const loadRegex = /@[A-Z]+-\d{3} load [^\s]+/g;
            const loadMatches = commands.match(loadRegex);
            assert.ok(loadMatches && loadMatches.length >= 2, 'Should have multiple load commands');
        });

    });

    describe('URS entries in matrix.md', () => {

        test('URS entries generate load commands in matrix.md', { timeout: 10_000 }, async () => {
            const workspaceRoot = makeWorkspace('gamp-soplang-urs');
            GampRSP.configure(workspaceRoot);

            GampRSP.createURS('URS SOPLang Test', 'Testing URS SOPLang generation.');

            // URS.md itself doesn't contain SOPLang comments
            // SOPLang load commands are generated in matrix.md
            const matrixPath = path.join(workspaceRoot, '.specs', 'matrix.md');
            const content = fs.readFileSync(matrixPath, 'utf8');
            const comments = extractSoplangComments(content);

            assert.ok(comments.length > 0, 'matrix.md should contain SOPLang comments');
            const commands = comments.map(c => c.commands).join('\n');
            assert.ok(commands.includes('@URS-001 load URS.md#URS-001'), 'Should have load command for URS-001');
        });

    });

    describe('FS.md SOPLang', () => {

        test('generates dependency declaration linking to URS', { timeout: 10_000 }, async () => {
            const workspaceRoot = makeWorkspace('gamp-soplang-fs');
            GampRSP.configure(workspaceRoot);

            const ursId = GampRSP.createURS('FS Parent URS', 'Parent requirement.');
            GampRSP.createFS('FS SOPLang Test', 'Testing FS SOPLang.', ursId);

            const fsPath = path.join(workspaceRoot, '.specs', 'FS.md');
            const content = fs.readFileSync(fsPath, 'utf8');
            const comments = extractSoplangComments(content);

            assert.ok(comments.length > 0, 'FS.md should contain SOPLang comments');
            const commands = comments.map(c => c.commands).join('\n');
            assert.ok(commands.includes('@FS-001'), 'Should reference FS-001 variable');
            assert.ok(commands.includes('$URS-001'), 'Should reference parent URS as dependency');
        });

    });

    describe('NFS.md SOPLang', () => {

        test('generates dependency declaration linking to URS', { timeout: 10_000 }, async () => {
            const workspaceRoot = makeWorkspace('gamp-soplang-nfs');
            GampRSP.configure(workspaceRoot);

            const ursId = GampRSP.createURS('NFS Parent URS', 'Parent requirement.');
            GampRSP.createNFS('NFS SOPLang Test', 'Testing NFS SOPLang.', ursId);

            const nfsPath = path.join(workspaceRoot, '.specs', 'NFS.md');
            const content = fs.readFileSync(nfsPath, 'utf8');
            const comments = extractSoplangComments(content);

            assert.ok(comments.length > 0, 'NFS.md should contain SOPLang comments');
            const commands = comments.map(c => c.commands).join('\n');
            assert.ok(commands.includes('@NFS-001'), 'Should reference NFS-001 variable');
            assert.ok(commands.includes('$URS-001'), 'Should reference parent URS as dependency');
        });

    });

    describe('DS files SOPLang', () => {

        test('generates build pipeline with createJSCode and store', { timeout: 10_000 }, async () => {
            const workspaceRoot = makeWorkspace('gamp-soplang-ds-pipeline');
            GampRSP.configure(workspaceRoot);

            const ursId = GampRSP.createURS('DS Pipeline URS', 'Requirement.');
            const fsId = GampRSP.createFS('DS Pipeline FS', 'Functional.', ursId);
            GampRSP.createDS('DS Pipeline Test', 'Design.', 'Architecture.', ursId, fsId, {
                implementationPath: 'src/generated/output.mjs'
            });

            const dsDir = path.join(workspaceRoot, '.specs', 'DS');
            const dsFiles = fs.readdirSync(dsDir).filter(f => f.startsWith('DS-001'));
            assert.ok(dsFiles.length > 0, 'DS-001 file should exist');

            const content = fs.readFileSync(path.join(dsDir, dsFiles[0]), 'utf8');
            const comments = extractSoplangComments(content);

            assert.ok(comments.length > 0, 'DS file should contain SOPLang comments');
            const commands = comments.map(c => c.commands).join('\n');

            // Verify full build pipeline
            assert.ok(commands.includes('@prompt :='), 'Should have prompt assignment');
            assert.ok(commands.includes('$DS-001'), 'Should include DS self-reference');
            assert.ok(commands.includes('$URS-001'), 'Should include URS dependency');
            assert.ok(commands.includes('$FS-001'), 'Should include FS dependency');
            assert.ok(commands.includes('createJSCode'), 'Should have createJSCode command');
            assert.ok(commands.includes('store'), 'Should have store command');
            assert.ok(commands.includes('src/generated/output.mjs'), 'Should include implementation path');
        });

        test('includes multiple dependencies in prompt assignment', { timeout: 10_000 }, async () => {
            const workspaceRoot = makeWorkspace('gamp-soplang-ds-multi');
            GampRSP.configure(workspaceRoot);

            const urs1 = GampRSP.createURS('Multi URS 1', 'First.');
            const urs2 = GampRSP.createURS('Multi URS 2', 'Second.');
            const fs1 = GampRSP.createFS('Multi FS 1', 'First.', urs1);
            const fs2 = GampRSP.createFS('Multi FS 2', 'Second.', urs2);
            const nfs1 = GampRSP.createNFS('Multi NFS', 'Quality.', urs1);

            GampRSP.createDS('Multi Dep DS', 'Design.', 'Arch.', [urs1, urs2], [fs1, fs2, nfs1], {
                implementationPath: 'src/multi.mjs'
            });

            const dsDir = path.join(workspaceRoot, '.specs', 'DS');
            const dsFiles = fs.readdirSync(dsDir).filter(f => f.startsWith('DS-001'));
            const content = fs.readFileSync(path.join(dsDir, dsFiles[0]), 'utf8');
            const comments = extractSoplangComments(content);
            const commands = comments.map(c => c.commands).join('\n');

            // Verify all dependencies are included
            assert.ok(commands.includes('$URS-001'), 'Should include URS-001');
            assert.ok(commands.includes('$URS-002'), 'Should include URS-002');
            assert.ok(commands.includes('$FS-001'), 'Should include FS-001');
            assert.ok(commands.includes('$FS-002'), 'Should include FS-002');
            assert.ok(commands.includes('$NFS-001'), 'Should include NFS-001');
        });

        test('handles DS without implementation path', { timeout: 10_000 }, async () => {
            const workspaceRoot = makeWorkspace('gamp-soplang-ds-no-path');
            GampRSP.configure(workspaceRoot);

            const ursId = GampRSP.createURS('No Path URS', 'Requirement.');
            const fsId = GampRSP.createFS('No Path FS', 'Functional.', ursId);
            GampRSP.createDS('No Path DS', 'Design.', 'Arch.', ursId, fsId);

            const dsDir = path.join(workspaceRoot, '.specs', 'DS');
            const dsFiles = fs.readdirSync(dsDir).filter(f => f.startsWith('DS-001'));
            const content = fs.readFileSync(path.join(dsDir, dsFiles[0]), 'utf8');
            const comments = extractSoplangComments(content);
            const commands = comments.map(c => c.commands).join('\n');

            // Should still have store command with TBD path
            assert.ok(commands.includes('store'), 'Should have store command');
            assert.ok(commands.includes('TBD'), 'Should have TBD placeholder for path');
        });

    });

    describe('SOPLang comment format validation', () => {

        test('all comments use achiles-ide-document structure', { timeout: 10_000 }, async () => {
            const workspaceRoot = makeWorkspace('gamp-soplang-format');
            GampRSP.configure(workspaceRoot);

            GampRSP.createURS('Format Test', 'Testing format.');
            GampRSP.createFS('Format FS', 'FS.', 'URS-001');
            GampRSP.createDS('Format DS', 'DS.', 'Arch.', 'URS-001', 'FS-001');

            const specsDir = path.join(workspaceRoot, '.specs');
            const filesToCheck = [
                'matrix.md',
                'URS.md',
                'FS.md'
            ];

            for (const fileName of filesToCheck) {
                const filePath = path.join(specsDir, fileName);
                if (fs.existsSync(filePath)) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    const comments = extractSoplangComments(content);

                    for (const comment of comments) {
                        assert.ok(
                            comment.parsed['achiles-ide-document'],
                            `${fileName}: Comment should have achiles-ide-document key`
                        );
                        assert.ok(
                            typeof comment.commands === 'string',
                            `${fileName}: commands should be a string`
                        );
                    }
                }
            }
        });

        test('commands use correct newline escaping', { timeout: 10_000 }, async () => {
            const workspaceRoot = makeWorkspace('gamp-soplang-newlines');
            GampRSP.configure(workspaceRoot);

            const ursId = GampRSP.createURS('Newline Test', 'Test.');
            const fsId = GampRSP.createFS('Newline FS', 'Test.', ursId);
            GampRSP.createDS('Newline DS', 'Test.', 'Arch.', ursId, fsId, {
                implementationPath: 'src/test.mjs'
            });

            const dsDir = path.join(workspaceRoot, '.specs', 'DS');
            const dsFiles = fs.readdirSync(dsDir).filter(f => f.startsWith('DS-001'));
            const content = fs.readFileSync(path.join(dsDir, dsFiles[0]), 'utf8');

            // Extract raw JSON from comment
            const commentMatch = content.match(/<!--(\{[\s\S]*?"achiles-ide-document"[\s\S]*?\})-->/);
            assert.ok(commentMatch, 'Should find achiles-ide-document comment');

            const parsed = JSON.parse(commentMatch[1]);
            const commands = parsed['achiles-ide-document'].commands;

            // Commands should contain escaped newlines (\\n) for multi-line SOPLang
            assert.ok(
                commands.includes('\\n'),
                'Multi-line commands should use escaped newlines (\\\\n)'
            );
        });

    });

});
