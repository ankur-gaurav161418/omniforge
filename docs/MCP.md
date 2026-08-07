# OmniForge Model Context Protocol (MCP) Guide

OmniForge includes a production-ready MCP Server supporting the 2024-11-05 protocol standard.

## Transports Supported

1. **STDIO**: Ideal for desktop IDE integrations (Cursor, VSCode, Claude Desktop).
2. **HTTP**: REST endpoints at `http://localhost:8080/rpc` and health check at `http://localhost:8080/health`.
3. **SSE (Server-Sent Events)**: Real-time streaming transport at `http://localhost:8080/sse`.

## Registered MCP Tools

- `omniforge_run_skill`: Execute OmniForge skill (e.g. `brainstorming`, `test-driven-development`).
- `omniforge_run_workflow`: Execute multi-step engineering workflow.
- `omniforge_health_check`: Get server uptime, capabilities, and transport state.

## Connecting Claude Desktop / Cursor
Add to your MCP configuration:
```json
{
  "mcpServers": {
    "omniforge": {
      "command": "node",
      "args": ["d:/hackathon/omniforge/mcp/dist/server.js"]
    }
  }
}
```
