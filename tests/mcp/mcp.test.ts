import { describe, it, expect } from 'vitest';
import { OmniForgeMCPServer } from '../../mcp/src/server.js';

describe('MCP Protocol Tests', () => {
  it('should initialize MCP server with valid protocol info', () => {
    const server = new OmniForgeMCPServer();
    const res = server.handleRPC({
      jsonrpc: '2.0',
      id: 'init-1',
      method: 'initialize',
    });

    expect(res.jsonrpc).toBe('2.0');
    expect((res.result as any).serverInfo.name).toBe('OmniForge MCP Server');
  });
});
