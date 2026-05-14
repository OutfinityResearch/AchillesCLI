/**
 * repoManager - Manages cloned repositories within .achilles-cli/repos/.
 *
 * Provides add, list, and remove operations for git repositories.
 * Repositories are cloned into .achilles-cli/repos/<name>/ and are
 * automatically discovered by MainAgent's recursive skill scanning.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';

const ACHILLES_CLI_DIR = '.achilles-cli';
const REPOS_SUBDIR = 'repos';
const require = createRequire(import.meta.url);

/**
 * Ensure the .achilles-cli directory structure exists.
 * Creates .achilles-cli/ and .achilles-cli/repos/ if they don't exist.
 *
 * @param {string} [baseDir=process.cwd()] - Base directory to create .achilles-cli in
 * @returns {{ achillesCliDir: string, reposDir: string }}
 */
export function ensureAchillesCliDir(baseDir = process.cwd()) {
    const achillesCliDir = path.join(baseDir, ACHILLES_CLI_DIR);
    const reposDir = path.join(achillesCliDir, REPOS_SUBDIR);

    if (!fs.existsSync(achillesCliDir)) {
        fs.mkdirSync(achillesCliDir, { recursive: true });
    }
    if (!fs.existsSync(reposDir)) {
        fs.mkdirSync(reposDir, { recursive: true });
    }

    return { achillesCliDir, reposDir };
}

/**
 * Get the repos directory path.
 *
 * @param {string} [baseDir=process.cwd()]
 * @returns {string}
 */
export function getReposDir(baseDir = process.cwd()) {
    const { reposDir } = ensureAchillesCliDir(baseDir);
    return reposDir;
}

/**
 * Resolve the achillesAgentLib package directory visible to this AchillesCLI runtime.
 *
 * @returns {string}
 */
export function resolveAgentLibDir() {
    const explicitDir = String(process.env.ACHILLES_AGENT_LIB_DIR || '').trim();
    if (explicitDir) {
        return fs.realpathSync(path.resolve(explicitDir));
    }
    const packagePath = require.resolve('achillesAgentLib/package.json');
    return fs.realpathSync(path.dirname(packagePath));
}

function readLinkTarget(linkPath) {
    const rawTarget = fs.readlinkSync(linkPath);
    return path.resolve(path.dirname(linkPath), rawTarget);
}

/**
 * Ensure one cloned skill repository can resolve bare imports from achillesAgentLib.
 *
 * @param {string} repoPath - Absolute or relative path to a cloned repo.
 * @returns {{ status: string, path: string, target: string }}
 */
export function ensureAgentLibLinkForRepo(repoPath) {
    if (!repoPath || !fs.existsSync(repoPath)) {
        throw new Error(`Repository path does not exist: ${repoPath}`);
    }

    const resolvedRepoPath = path.resolve(repoPath);
    const agentLibDir = resolveAgentLibDir();
    const nodeModulesDir = path.join(resolvedRepoPath, 'node_modules');
    const linkPath = path.join(nodeModulesDir, 'achillesAgentLib');

    fs.mkdirSync(nodeModulesDir, { recursive: true });

    let existing = null;
    try {
        existing = fs.lstatSync(linkPath);
    } catch (error) {
        if (error?.code !== 'ENOENT') {
            throw error;
        }
    }

    if (existing) {
        if (!existing.isSymbolicLink()) {
            return { status: 'preserved', path: linkPath, target: agentLibDir };
        }

        const currentTarget = readLinkTarget(linkPath);
        if (currentTarget === agentLibDir) {
            return { status: 'exists', path: linkPath, target: agentLibDir };
        }

        fs.unlinkSync(linkPath);
    }

    fs.symlinkSync(agentLibDir, linkPath, 'dir');
    return { status: 'linked', path: linkPath, target: agentLibDir };
}

/**
 * Repair achillesAgentLib symlinks for all cloned repos in .achilles-cli/repos/.
 *
 * @param {string} [baseDir=process.cwd()]
 * @returns {Array<{ repo: string, status: string, path: string, target: string }>}
 */
export function ensureAgentLibLinksForRepos(baseDir = process.cwd()) {
    const { reposDir } = ensureAchillesCliDir(baseDir);
    const entries = fs.readdirSync(reposDir, { withFileTypes: true });
    const results = [];

    for (const entry of entries) {
        if (!entry.isDirectory() || entry.name.startsWith('.')) {
            continue;
        }

        const result = ensureAgentLibLinkForRepo(path.join(reposDir, entry.name));
        results.push({ repo: entry.name, ...result });
    }

    return results;
}

/**
 * Extract a repo name from a git URL.
 * Strips .git suffix and takes the last path segment.
 *
 * @param {string} url - Git repository URL
 * @returns {string}
 */
export function extractRepoNameFromUrl(url) {
    const trimmed = url.replace(/\/+$/, '');
    const parts = trimmed.split('/');
    let name = parts[parts.length - 1];
    if (name.endsWith('.git')) {
        name = name.slice(0, -4);
    }
    return name;
}

/**
 * Add (clone) a repository into .achilles-cli/repos/.
 *
 * @param {string} url - Git repository URL
 * @param {string} [name] - Optional name for the repo directory (derived from URL if not provided)
 * @param {string} [baseDir=process.cwd()] - Base directory for .achilles-cli
 * @returns {{ status: string, path: string, name: string }}
 */
export function addRepo(url, name, baseDir = process.cwd()) {
    if (!url || !url.trim()) {
        throw new Error('Missing repository URL.');
    }

    const repoUrl = url.trim();
    const repoName = (name && name.trim()) || extractRepoNameFromUrl(repoUrl);

    if (!repoName) {
        throw new Error('Could not determine repository name. Provide a name explicitly.');
    }

    const { reposDir } = ensureAchillesCliDir(baseDir);
    const repoPath = path.join(reposDir, repoName);

    if (fs.existsSync(repoPath)) {
        ensureAgentLibLinkForRepo(repoPath);
        return { status: 'exists', path: repoPath, name: repoName };
    }

    console.log(`Cloning ${repoUrl} into ${repoName}...`);
    execSync(`git clone --quiet "${repoUrl}" "${repoPath}"`, { stdio: 'inherit' });
    ensureAgentLibLinkForRepo(repoPath);

    console.log(`✓ Repository '${repoName}' cloned.`);
    return { status: 'cloned', path: repoPath, name: repoName };
}

/**
 * List all cloned repositories in .achilles-cli/repos/.
 *
 * @param {string} [baseDir=process.cwd()]
 * @returns {Array<{name: string, path: string, url: string|null}>}
 */
export function listRepos(baseDir = process.cwd()) {
    const { reposDir } = ensureAchillesCliDir(baseDir);
    const entries = fs.readdirSync(reposDir, { withFileTypes: true });

    const repos = [];
    for (const entry of entries) {
        if (!entry.isDirectory() || entry.name.startsWith('.')) {
            continue;
        }

        const repoPath = path.join(reposDir, entry.name);
        let remoteUrl = null;
        try {
            remoteUrl = execSync('git remote get-url origin', {
                cwd: repoPath,
                encoding: 'utf-8',
                stdio: ['pipe', 'pipe', 'pipe'],
            }).trim();
        } catch {
            // Not a git repo or no remote
        }

        repos.push({
            name: entry.name,
            path: repoPath,
            url: remoteUrl,
        });
    }

    return repos;
}

/**
 * Remove a cloned repository from .achilles-cli/repos/.
 *
 * @param {string} name - Repository name (directory name)
 * @param {string} [baseDir=process.cwd()]
 * @returns {{ status: string, path: string }}
 */
export function removeRepo(name, baseDir = process.cwd()) {
    if (!name || !name.trim()) {
        throw new Error('Missing repository name.');
    }

    const { reposDir } = ensureAchillesCliDir(baseDir);
    const repoPath = path.join(reposDir, name.trim());

    if (!fs.existsSync(repoPath)) {
        throw new Error(`Repository '${name}' not found in .achilles-cli/repos/.`);
    }

    fs.rmSync(repoPath, { recursive: true, force: true });
    console.log(`✓ Repository '${name}' removed.`);
    return { status: 'removed', path: repoPath };
}

export default {
    ensureAchillesCliDir,
    getReposDir,
    resolveAgentLibDir,
    ensureAgentLibLinkForRepo,
    ensureAgentLibLinksForRepos,
    addRepo,
    listRepos,
    removeRepo,
    extractRepoNameFromUrl,
};
