import { createAgentClient } from '/Agent/client/AgentClient.js';

const TARGET_AGENT = 'soplangAgent';
const TOOL_NAME = 'soplang-tool';
const TOOL_ARGUMENTS = {
    pluginName: 'SoplangBuilder',
    methodName: 'buildFromMarkdown',
    params: [],
};

export async function action({ prompt = '', context = {} }) {
    let soplangAgentURL = process.env.PLOINKY_ROUTER_URL + "/mcps/soplangAgent/mcp";
    const client = createAgentClient(soplangAgentURL);

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
