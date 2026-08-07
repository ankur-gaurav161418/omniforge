import { describe, it, expect } from 'vitest';
import { OmniForgeMCPServer } from '../mcp/src/server.js';

describe('OmniForge MCP Server', () => {
  it('should return valid JSON-RPC initialization response', () => {
    const server = new OmniForgeMCPServer();
    const res = server.handleRPC({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
    });

    expect(res.jsonrpc).toBe('2.0');
    expect(res.id).toBe(1);
    expect((res.result as any).serverInfo.name).toBe('OmniForge MCP Server');
  });

  it('should list MCP tools', () => {
    const server = new OmniForgeMCPServer();
    const res = server.handleRPC({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
    });

    expect(res.result).toBeDefined();
    const tools = (res.result as any).tools;
    expect(tools.length).toBeGreaterThanOrEqual(3);
    expect(tools[0].name).toBe('omniforge_run_skill');
  });

  it('should return server diagnostics for health check', () => {
    const server = new OmniForgeMCPServer();
    const diag = server.getDiagnostics();
    expect(diag.status).toBe('healthy');
    expect(diag.transportsSupported).toContain('stdio');
    expect(diag.transportsSupported).toContain('http');
    expect(diag.transportsSupported).toContain('sse');
  });
});
