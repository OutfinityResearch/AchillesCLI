import { createAgentClient, getRouterUrl } from '/Agent/client/AgentMcpClient.mjs';

const TARGET_AGENT = 'soplangAgent';
const TOOL_NAME = 'soplang-tool';
const TOOL_ARGUMENTS = {
    pluginName: 'SoplangBuilder',
    methodName: 'buildFromMarkdown',
    params: null,
};

export async function action({ prompt = '', context = {} }) {
    const routerUrl = getRouterUrl();
    const client = await createAgentClient(TARGET_AGENT);

    try {
        // Optional health check; ignore failures so the tool call still attempts.
        let ping = null;
        try {
            ping = await client.ping();
        } catch (error) {
            ping = { ok: false, error: error?.message || String(error) };
        }

        const response = await client.callTool(TOOL_NAME, { ...TOOL_ARGUMENTS });

        return {
            message: 'Triggered soplang build via MCP.',
            agent: TARGET_AGENT,
            routerUrl,
            tool: TOOL_NAME,
            request: TOOL_ARGUMENTS,
            prompt,
            ping,
            response,
        };
    } catch (error) {
        const detail = error?.message || String(error);
        throw new Error(`build-soplang failed: ${detail}`);
    } finally {
        try {
            await client.close();
        } catch (_) {
            // Ignore close errors
        }
    }
}

export default action;
