import { describe, it, expect } from 'vitest';
import { AuthMiddleware } from '../../mcp/src/middleware/auth.js';
import { IncomingMessage } from 'http';

describe('MCP AuthMiddleware', () => {
  it('should allow all requests when no secret token is configured', () => {
    const auth = new AuthMiddleware();
    const req = { headers: {} } as IncomingMessage;
    const result = auth.authenticateRequest(req);
    expect(result.authenticated).toBe(true);
  });

  it('should authenticate request with matching API key header', () => {
    const auth = new AuthMiddleware('secret-key-123');
    const req = { headers: { 'x-api-key': 'secret-key-123' } } as IncomingMessage;
    const result = auth.authenticateRequest(req);
    expect(result.authenticated).toBe(true);
    expect(result.user).toBe('api-key-client');
  });

  it('should reject request with invalid API key header', () => {
    const auth = new AuthMiddleware('secret-key-123');
    const req = { headers: { 'x-api-key': 'wrong-key' } } as IncomingMessage;
    const result = auth.authenticateRequest(req);
    expect(result.authenticated).toBe(false);
  });
});
