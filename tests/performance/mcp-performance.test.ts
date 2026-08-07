import { describe, it, expect } from 'vitest';
import { OmniForgeMCPServer } from '../../mcp/src/server.js';

describe('MCP Performance Benchmark Suite', () => {
  it('should handle 100 concurrent JSON-RPC requests under 500ms', async () => {
    const server = new OmniForgeMCPServer();
    const start = Date.now();

    const requests = Array.from({ length: 100 }).map((_, i) =>
      Promise.resolve(
        server.handleRPC({
          jsonrpc: '2.0',
          id: i,
          method: 'tools/list',
        })
      )
    );

    const responses = await Promise.all(requests);
    const duration = Date.now() - start;

    expect(responses.length).toBe(100);
    expect(responses.every((r) => r.result && r.result.tools)).toBe(true);
    expect(duration).toBeLessThan(500);
  });
});
