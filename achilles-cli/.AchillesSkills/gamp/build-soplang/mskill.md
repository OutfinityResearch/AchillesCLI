# build-soplang

Trigger the `soplang-tool` MCP entrypoint to run SoplangBuilder’s `buildFromMarkdown`.

## Summary
- Calls `soplang-tool` on `soplangAgent` via the MCP AgentClient.
- Uses `pluginName=SoplangBuilder`, `methodName=buildFromMarkdown`, `params=[]` (no user input needed).
- Returns both the planned call and the raw MCP response for logging.

## Allowed Tools
- soplang-tool

## Instructions
- Always call `soplang-tool` with the fixed payload: `{"pluginName":"SoplangBuilder","methodName":"buildFromMarkdown","params":[]}`.
- Ignore free-form user prompt content for arguments; rely on the fixed payload.
- Fail loudly if the transport or tool call errors; include the MCP response when successful.

## Light-SOP-Lang
@build soplang-tool '{"pluginName":"SoplangBuilder","methodName":"buildFromSpecsMarkdown","params":[]}' "Run SoplangBuilder from Markdown"
