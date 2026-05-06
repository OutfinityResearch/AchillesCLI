function normalizePath(value) {
    return String(value || '').trim();
}

function buildCopilotUrl(context) {
    const selectedFsPath = normalizePath(context?.selectedFsPath);
    if (!selectedFsPath) {
        return '';
    }
    const workingDir = context?.isDirectory ? selectedFsPath : '';
    if (!workingDir) {
        return '';
    }
    const params = new URLSearchParams({
        agent: 'achilles-cli',
        dir: workingDir
    });
    return `/webchat?${params.toString()}`;
}

export async function getMenuItems({ context, plugin }) {
    if (!context?.isDirectory || !normalizePath(context?.selectedFsPath)) {
        return [];
    }
    return [{
        id: 'achilles-cli:open-copilot-here',
        label: 'Open Copilot here',
        icon: plugin?.icon || '',
        action: 'open-copilot-here'
    }];
}

export async function executeMenuAction({ action, context }) {
    if (action !== 'open-copilot-here') {
        return;
    }
    const targetUrl = buildCopilotUrl(context);
    if (!targetUrl) {
        throw new Error('Missing file context for Copilot launch.');
    }
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
}
