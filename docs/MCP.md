# OmniForge MCP Server Specification

**Author**: Ankur Gaurav

---

## Supported Transports

1. **STDIO**: High-performance standard I/O line transport for desktop clients (Claude Desktop, Cursor, VSCode).
2. **HTTP REST**: JSON-RPC over HTTP (`/rpc`, `/health`, `/metrics`).
3. **Server-Sent Events (SSE)**: Streaming event push (`/sse`).

## Claude Desktop Configuration

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "omniforge-mcp": {
      "command": "node",
      "args": ["d:/hackathon/omniforge/mcp/dist/server.js"]
    }
  }
}
```
