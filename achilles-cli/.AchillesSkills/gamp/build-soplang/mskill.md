# build-soplang

Invoke the `soplangAgent` MCP tool to run the SoplangBuilder Markdown build.

## Summary
- Calls the `soplang-tool` MCP tool on `soplangAgent` using the router-authenticated `AgentMcpClient`.
- Uses the SoplangBuilder plugin with `buildFromMarkdown` (no extra params).
- Returns the raw MCP response so downstream steps can log or inspect it.

## Instructions
- Do not alter the request payload: `pluginName="SoplangBuilder"`, `methodName="buildFromMarkdown"`, `params=null`.
- Surface transport or auth errors clearly; fail fast if the MCP call does not succeed.
- Ensure the MCP client connection is closed after the tool call.
