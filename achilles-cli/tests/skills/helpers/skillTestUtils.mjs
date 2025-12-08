import fs from 'node:fs';
import path from 'node:path';
import { LLMAgent } from 'achillesAgentLib/LLMAgents';

export const TEMP_ROOT = path.join(process.cwd(), 'tests', '.tmp', 'skill-e2e');

const ensureDir = (dir) => fs.mkdirSync(dir, { recursive: true });

export const makeWorkspace = (label) => {
    ensureDir(TEMP_ROOT);
    const dir = path.join(TEMP_ROOT, `${label}-${Date.now()}-${Math.random().toString(16).slice(2)}`);
    ensureDir(dir);
    ensureDir(path.join(dir, 'src'));
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ name: label, version: '1.0.0', type: 'module' }, null, 2));
    return dir;
};

export const createLLM = (handlers = {}) => new LLMAgent({
    invokerStrategy: async ({ context }) => {
        const intent = context?.intent;
        if (intent && Object.prototype.hasOwnProperty.call(handlers, intent)) {
            const handler = handlers[intent];
            if (typeof handler === 'function') {
                return handler(context);
            }
            return handler;
        }
        return '[]';
    },
});

export const cleanupWorkspaces = () => {
    if (fs.existsSync(TEMP_ROOT)) {
        fs.rmSync(TEMP_ROOT, { recursive: true, force: true });
    }
};
