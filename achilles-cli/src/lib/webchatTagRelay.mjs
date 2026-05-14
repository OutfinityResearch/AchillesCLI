import fs from 'node:fs';
import path from 'node:path';

const MENTION_RE = /(^|\s)@([A-Za-z][A-Za-z0-9_-]{0,63})(?=\s|$|[.,:;!?])/;
const DEFAULT_TIMEOUT_MS = 450000;
const MAX_RESOURCE_BYTES = 128 * 1024;
const MAX_RESOURCE_TOTAL_BYTES = 384 * 1024;
const TEXT_LIKE_EXT_RE = /\.(txt|md|markdown|json|yaml|yml|csv|tsv|xml|js|mjs|ts|tsx|jsx|py|rb|go|rs|java|c|cc|cpp|h|hpp)$/i;

function boolFromFlag(value) {
    return /^(1|true|yes|on)$/i.test(String(value || '').trim());
}

function normalizeTagList(value) {
    const raw = Array.isArray(value) ? value.join(',') : String(value || '');
    const tags = raw
        .split(/[,\s]+/)
        .map((entry) => entry.trim().replace(/^@+/, '').toLowerCase())
        .filter((entry) => /^[a-z][a-z0-9_-]{0,63}$/.test(entry));
    return new Set(tags);
}

export function normalizeWebchatMessage(raw) {
    const text = String(raw || '').trim();
    if (!text) {
        return { text: '', rawText: '', attachments: [], invocationToken: '' };
    }
    try {
        const parsed = JSON.parse(text);
        if (!parsed || typeof parsed !== 'object' || !parsed.__webchatMessage) {
            return { text, rawText: text, attachments: [], invocationToken: '' };
        }
        const messageText = typeof parsed.text === 'string' ? parsed.text : '';
        const attachments = Array.isArray(parsed.attachments) ? parsed.attachments : [];
        const invocationToken = typeof parsed.invocation?.token === 'string'
            ? parsed.invocation.token
            : '';
        if (!attachments.length) {
            return { text: messageText, rawText: messageText, attachments: [], invocationToken };
        }
        const lines = attachments
            .filter((entry) => entry && typeof entry === 'object')
            .map((entry) => {
                const name = entry.filename || entry.id || 'attachment';
                const localPath = entry.localPath ? ` path=${entry.localPath}` : '';
                const mime = entry.mime ? ` mime=${entry.mime}` : '';
                return `- ${name}${mime}${localPath}`;
            });
        return {
            text: lines.length
                ? `${messageText}\n\nAttachments:\n${lines.join('\n')}`
                : messageText,
            rawText: messageText,
            attachments,
            invocationToken,
        };
    } catch {
        return { text, rawText: text, attachments: [], invocationToken: '' };
    }
}

export function parseTagRelayMention(text) {
    const value = String(text || '');
    const match = value.match(MENTION_RE);
    if (!match) {
        return null;
    }
    const tag = match[2].toLowerCase();
    const start = match.index + match[1].length;
    const prompt = `${value.slice(0, start)}${value.slice(start + tag.length + 1)}`
        .replace(/\s{2,}/g, ' ')
        .trim();
    return {
        tag,
        prompt: prompt || value.trim(),
    };
}

function isTextLikeAttachment(mime, filename = '') {
    const normalized = String(mime || '').toLowerCase();
    if (normalized.startsWith('text/')) return true;
    if (/(json|xml|yaml|markdown|javascript|typescript)/.test(normalized)) return true;
    return TEXT_LIKE_EXT_RE.test(String(filename || ''));
}

function resolveSharedAttachmentPath(localPath, sharedRoot = '/shared') {
    const raw = String(localPath || '').trim().replace(/\\/g, '/');
    const normalized = raw.replace(/^\/+/, '');
    if (!normalized.startsWith('shared/')) {
        return null;
    }
    const id = path.basename(normalized);
    if (!id || !/^[A-Za-z0-9_.-]+$/.test(id)) {
        return null;
    }
    const root = path.resolve(sharedRoot || '/shared');
    const resolved = path.resolve(root, id);
    const relative = path.relative(root, resolved);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
        return null;
    }
    try {
        const realRoot = fs.realpathSync(root);
        const realResolved = fs.realpathSync(resolved);
        const realRelative = path.relative(realRoot, realResolved);
        if (realRelative.startsWith('..') || path.isAbsolute(realRelative)) {
            return null;
        }
        return realResolved;
    } catch {
        return null;
    }
}

export function materializeTagRelayAttachments(attachments = [], options = {}) {
    const resources = [];
    const warnings = [];
    let totalBytes = 0;
    const sharedRoot = options.sharedRoot || process.env.PLOINKY_SHARED_DIR || '/shared';
    for (const attachment of Array.isArray(attachments) ? attachments : []) {
        if (!attachment || typeof attachment !== 'object') {
            continue;
        }
        const filePath = resolveSharedAttachmentPath(attachment.localPath, sharedRoot);
        const filename = String(attachment.filename || attachment.id || 'attachment').trim() || 'attachment';
        const mime = String(attachment.mime || 'application/octet-stream').trim() || 'application/octet-stream';
        if (!filePath) {
            warnings.push(`Attachment '${filename}' is not in shared blob storage and was not forwarded.`);
            continue;
        }
        let stat;
        try {
            stat = fs.statSync(filePath);
        } catch {
            warnings.push(`Attachment '${filename}' is no longer available on disk.`);
            continue;
        }
        if (!stat.isFile()) {
            warnings.push(`Attachment '${filename}' is not a regular file.`);
            continue;
        }
        if (stat.size > MAX_RESOURCE_BYTES) {
            warnings.push(`Attachment '${filename}' exceeds ${MAX_RESOURCE_BYTES} bytes and was not forwarded.`);
            continue;
        }
        if (totalBytes + stat.size > MAX_RESOURCE_TOTAL_BYTES) {
            warnings.push('Attachment forwarding reached the total byte cap; remaining files were skipped.');
            break;
        }
        const buffer = fs.readFileSync(filePath);
        totalBytes += buffer.length;
        const textLike = isTextLikeAttachment(mime, filename);
        resources.push({
            name: filename,
            mime,
            size: buffer.length,
            downloadUrl: attachment.downloadUrl || null,
            localPath: attachment.localPath || null,
            ...(textLike
                ? { content: buffer.toString('utf8') }
                : { base64: buffer.toString('base64') })
        });
    }
    return { resources, warnings };
}

function resolveRouterUrl(env = process.env) {
    const explicit = String(env.PLOINKY_ROUTER_URL || '').trim();
    if (explicit) {
        return explicit.replace(/\/+$/, '');
    }
    const host = String(env.PLOINKY_ROUTER_HOST || '127.0.0.1').trim() || '127.0.0.1';
    const port = String(env.PLOINKY_ROUTER_PORT || '8080').trim() || '8080';
    return `http://${host}:${port}`;
}

async function callAgentTool(agent, toolName, input = {}, options = {}) {
    const base = resolveRouterUrl(options.env || process.env);
    const url = new URL(`/mcps/${encodeURIComponent(agent)}/mcp`, base);
    const payload = {
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: { name: toolName, arguments: input || {} },
    };
    const headers = {
        'content-type': 'application/json',
        accept: 'application/json',
    };
    if (options.invocationToken) {
        headers['x-ploinky-caller-jwt'] = options.invocationToken;
    }

    const controller = new AbortController();
    const timeoutMs = Math.max(1000, Number(options.timeoutMs) || DEFAULT_TIMEOUT_MS);
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const abortFromCaller = () => controller.abort();
    if (options.signal) {
        if (options.signal.aborted) {
            controller.abort();
        } else {
            options.signal.addEventListener('abort', abortFromCaller, { once: true });
        }
    }
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
            signal: controller.signal,
        });
        const text = await response.text();
        let parsed = {};
        try {
            parsed = text ? JSON.parse(text) : {};
        } catch (error) {
            throw new Error(`invalid MCP response: ${error.message}`);
        }
        if (!response.ok || parsed?.error) {
            const message = parsed?.error?.message || parsed?.error?.detail || `router responded ${response.status}`;
            throw new Error(message);
        }
        return parsed;
    } finally {
        clearTimeout(timer);
        if (options.signal) {
            options.signal.removeEventListener('abort', abortFromCaller);
        }
    }
}

function extractToolText(response) {
    const result = response && response.result ? response.result : response;
    if (typeof result === 'string') return result;
    if (result && Array.isArray(result.content)) {
        return result.content
            .filter((entry) => entry && entry.type === 'text' && typeof entry.text === 'string')
            .map((entry) => entry.text)
            .join('\n');
    }
    if (result && typeof result.text === 'string') return result.text;
    return '';
}

function extractToolJson(response) {
    const text = extractToolText(response).trim();
    if (!text) return {};
    try {
        return JSON.parse(text);
    } catch (error) {
        if (/^MCP error\b/i.test(text)) {
            throw new Error(text);
        }
        throw new Error(`invalid JSON tool response: ${error.message}`);
    }
}

function tagsFromBackends(payload) {
    const tags = new Set();
    for (const backend of Array.isArray(payload?.backends) ? payload.backends : []) {
        if (typeof backend?.id === 'string' && backend.id.trim()) {
            tags.add(backend.id.trim().replace(/^@+/, '').toLowerCase());
        }
        for (const tag of Array.isArray(backend?.tags) ? backend.tags : []) {
            if (typeof tag === 'string' && tag.trim()) {
                tags.add(tag.trim().replace(/^@+/, '').toLowerCase());
            }
        }
    }
    return tags;
}

function normalizeRelayAnswer(payload) {
    if (!payload || typeof payload !== 'object') {
        return 'Tag relay completed without a response.';
    }
    return String(
        payload.final_answer
        || payload.natural_language_output
        || payload.error
        || 'Tag relay completed without a response.'
    ).trim();
}

export function createWebchatTagRelay(rawConfig = {}) {
    const config = {
        enabled: Boolean(rawConfig.enabled),
        agent: String(rawConfig.agent || '').trim(),
        submitTool: String(rawConfig.submitTool || '').trim(),
        listTool: String(rawConfig.listTool || '').trim(),
        timeoutMs: Number(rawConfig.timeoutMs) || DEFAULT_TIMEOUT_MS,
        kind: String(rawConfig.kind || 'tag-relay').trim() || 'tag-relay',
        tags: normalizeTagList(rawConfig.tags),
    };
    let cachedTags = null;

    async function getKnownTags(invocationToken, { signal, env } = {}) {
        if (config.tags.size > 0) {
            return config.tags;
        }
        if (cachedTags) {
            return cachedTags;
        }
        if (!config.listTool) {
            return null;
        }
        const response = await callAgentTool(config.agent, config.listTool, {}, {
            invocationToken,
            timeoutMs: Math.min(config.timeoutMs, 30000),
            signal,
            env,
        });
        cachedTags = tagsFromBackends(extractToolJson(response));
        return cachedTags;
    }

    async function handle(message, context = {}) {
        if (!config.enabled || !config.agent || !config.submitTool) {
            return null;
        }
        const mention = parseTagRelayMention(message?.rawText || message?.text || '');
        if (!mention) {
            return null;
        }
        const invocationToken = String(message?.invocationToken || '').trim();
        if (!invocationToken) {
            return {
                handled: true,
                output: `[${config.kind} error] This chat session cannot delegate tagged tasks because no router invocation token was provided.`,
            };
        }
        let knownTags = null;
        try {
            knownTags = await getKnownTags(invocationToken, {
                signal: context.signal,
                env: context.env,
            });
        } catch {
            return null;
        }
        if (knownTags && !knownTags.has(mention.tag)) {
            return null;
        }
        const { resources, warnings } = materializeTagRelayAttachments(message.attachments || []);
        const prompt = warnings.length
            ? `${mention.prompt}\n\nAttachment forwarding notes:\n${warnings.map((entry) => `- ${entry}`).join('\n')}`
            : mention.prompt;
        try {
            const response = await callAgentTool(config.agent, config.submitTool, {
                backend: mention.tag,
                prompt,
                resources,
                origin: {
                    type: config.kind,
                    surface: 'webchat',
                    agent: context.agentName || 'achilles-cli',
                    working_directory: context.workingDir || '',
                }
            }, {
                invocationToken,
                timeoutMs: config.timeoutMs,
                signal: context.signal,
                env: context.env,
            });
            return {
                handled: true,
                output: normalizeRelayAnswer(extractToolJson(response)),
            };
        } catch (error) {
            return {
                handled: true,
                output: `[${config.kind} error] ${error?.message || 'Tagged task relay failed.'}`,
            };
        }
    }

    return { handle };
}

export function isTruthyRelayFlag(value) {
    return boolFromFlag(value);
}
