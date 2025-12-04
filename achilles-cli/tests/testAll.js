#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(__dirname, '..');
const TEST_ROOT = path.join(WORKSPACE_ROOT, 'tests');
const isTestFile = (file) => file.toLowerCase().endsWith('.test.mjs');

const collectTests = (root) => {
    const entries = fs.readdirSync(root, { withFileTypes: true });
    const files = [];
    entries.forEach((entry) => {
        const fullPath = path.join(root, entry.name);
        if (entry.isDirectory()) {
            files.push(...collectTests(fullPath));
        } else if (entry.isFile() && isTestFile(entry.name)) {
            files.push(fullPath);
        }
    });
    return files;
};

const formatMs = (ms) => `${ms.toFixed(1)} ms`;

const SUMMARY_PATTERNS = [
    /^1\.\.\d+$/i,
    /^tap version/i,
    /^#\s+(tests|suites|pass|fail|cancelled|skipped|todo|duration_ms)\b/i,
    /^\s*duration_ms:\s+\d+/i,
    /^ok\s+\d+\s+-\s+/i,
    /^\s*\.\.\.\s*$/,
    /^\s*-{3,}\s*$/,
];

const COLOR_RESET = '\x1b[0m';
const COLOR_GREEN = '\x1b[32m';
const COLOR_RED = '\x1b[31m';

const runTestFile = (filePath) => new Promise((resolve) => {
    const label = path.relative(WORKSPACE_ROOT, filePath);
    console.log(`\nRunning: ${label}`);
    const start = performance.now();
    const child = spawn('node', ['--test', '--test-reporter=tap', filePath], {
        cwd: WORKSPACE_ROOT,
        stdio: ['ignore', 'pipe', 'pipe'],
    });

    const handleStream = (stream, isErr = false) => {
        stream.on('data', (chunk) => {
            const text = chunk.toString();
            text.split(/\r?\n/).forEach((line) => {
                if (!line.trim()) {
                    return;
                }
                if (SUMMARY_PATTERNS.some((p) => p.test(line.trim()))) {
                    return;
                }
                if (isErr) {
                    console.error(line);
                } else {
                    console.log(line);
                }
            });
        });
    };

    handleStream(child.stdout, false);
    handleStream(child.stderr, true);

    child.on('close', (code) => {
        const end = performance.now();
        const status = code === 0 ? 'passed' : 'failed';
        const statusLabel = status === 'passed' ? '[PASS]' : '[FAIL]';
        const color = status === 'passed' ? COLOR_GREEN : COLOR_RED;
        console.log(`${color}${statusLabel} ${label} (${formatMs(end - start)})${COLOR_RESET}`);
        resolve({
            file: label,
            status,
            durationMs: end - start,
        });
    });
});

const main = async () => {
    if (!fs.existsSync(TEST_ROOT)) {
        console.error(`[testAll] tests directory not found at ${TEST_ROOT}`);
        process.exit(1);
    }

    const testFiles = collectTests(TEST_ROOT);
    if (!testFiles.length) {
        console.log('[testAll] No tests found.');
        return;
    }

    console.log(`[testAll] Running ${testFiles.length} test file(s)...`);
    const results = [];
    for (const file of testFiles) {
        // eslint-disable-next-line no-await-in-loop
        results.push(await runTestFile(file));
    }

    const passed = results.filter((r) => r.status === 'passed');
    const failed = results.filter((r) => r.status !== 'passed');
    const totalDuration = results.reduce((acc, r) => acc + r.durationMs, 0);

    results.forEach((r) => {
        const icon = r.status === 'passed' ? '✅' : '❌';
        const color = r.status === 'passed' ? COLOR_GREEN : COLOR_RED;
        console.log(`${color}${icon} ${r.file} (${formatMs(r.durationMs)})${COLOR_RESET}`);
    });

    console.log('');
    console.log(`[testAll] Summary: passed ${passed.length}/${results.length}, failed ${failed.length}/${results.length}, total time ${formatMs(totalDuration)}`);

    if (failed.length) {
        process.exitCode = 1;
    }
};

main().catch((error) => {
    console.error('[testAll] Unexpected error:', error);
    process.exit(1);
});
