const REFRESH_STATE = Symbol.for('achilles-cli.workspaceSkillRefresh');

function getState(agent) {
    if (!agent || typeof agent !== 'object') {
        return null;
    }
    if (!agent[REFRESH_STATE]) {
        Object.defineProperty(agent, REFRESH_STATE, {
            value: {
                pending: false,
                requests: [],
            },
            enumerable: false,
            configurable: false,
            writable: false,
        });
    }
    return agent[REFRESH_STATE];
}

export function installWorkspaceSkillRefreshHook(agent) {
    const state = getState(agent);
    if (!state) {
        return null;
    }

    const requestWorkspaceSkillsRefresh = (metadata = {}) => {
        state.pending = true;
        state.requests.push({
            operation: typeof metadata.operation === 'string' ? metadata.operation : '',
            skillName: typeof metadata.skillName === 'string' ? metadata.skillName : '',
            filePath: typeof metadata.filePath === 'string' ? metadata.filePath : '',
            at: new Date().toISOString(),
        });
    };

    Object.defineProperty(requestWorkspaceSkillsRefresh, '__achillesCliHook', {
        value: true,
        enumerable: false,
    });

    agent.requestWorkspaceSkillsRefresh = requestWorkspaceSkillsRefresh;
    agent.hasPendingWorkspaceSkillsRefresh = () => state.pending;

    return agent.requestWorkspaceSkillsRefresh;
}

export function requestWorkspaceSkillsRefresh(agent, metadata = {}) {
    if (typeof agent?.requestWorkspaceSkillsRefresh === 'function') {
        agent.requestWorkspaceSkillsRefresh(metadata);
        return true;
    }
    return false;
}

export async function drainWorkspaceSkillsRefresh(agent, { logger = null } = {}) {
    const state = getState(agent);
    if (!state || !state.pending) {
        return null;
    }

    const requests = state.requests.slice();
    state.pending = false;
    state.requests = [];

    if (typeof agent?.refreshSkills !== 'function') {
        logger?.warn?.('Workspace skills changed, but this MainAgent does not expose refreshSkills().');
        return null;
    }

    const summary = await agent.refreshSkills();
    logger?.debug?.(`WorkspaceSkillsRefresh: refreshed after ${requests.length} request(s)`);
    return {
        ...(summary || {}),
        requests,
    };
}

export async function refreshWorkspaceSkillsNow(agent, { logger = null } = {}) {
    const state = getState(agent);
    if (state) {
        state.pending = false;
        state.requests = [];
    }

    if (typeof agent?.refreshSkills === 'function') {
        const summary = await agent.refreshSkills();
        logger?.debug?.('WorkspaceSkillsRefresh: explicit refresh complete');
        return summary;
    }

    if (typeof agent?.buildSkills === 'function') {
        await agent.buildSkills();
    }

    return {
        registered: typeof agent?.getSkills === 'function' ? agent.getSkills().length : 0,
        added: [],
        updated: [],
        removed: [],
    };
}
