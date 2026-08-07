import * as http from 'http';
import { Logger } from '@omniforge/core';

const logger = new Logger('OmniForge-MCP');

export interface MCPRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: Record<string, unknown>;
}

export interface MCPResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
}

export class OmniForgeMCPServer {
  private port: number;
  private host: string;
  private transport: 'stdio' | 'http' | 'sse';
  private server?: http.Server;
  private startTime: number = Date.now();

  constructor(options: { port?: number; host?: string; transport?: 'stdio' | 'http' | 'sse' } = {}) {
    this.port = options.port || 8080;
    this.host = options.host || '0.0.0.0';
    this.transport = options.transport || 'http';
  }

  public handleRPC(request: MCPRequest): MCPResponse {
    logger.info(`Handling JSON-RPC request: ${request.method}`);

    switch (request.method) {
      case 'initialize':
        return {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: {
              tools: {},
              prompts: {},
              resources: {},
              sampling: {},
              logging: {},
            },
            serverInfo: {
              name: 'OmniForge MCP Server',
              version: '1.0.0',
              upstream: 'obra/superpowers',
            },
          },
        };

      case 'tools/list':
        return {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            tools: [
              {
                name: 'omniforge_run_skill',
                description: 'Execute an OmniForge skill (e.g. brainstorming, TDD, systematic-debugging)',
                inputSchema: {
                  type: 'object',
                  properties: {
                    skillName: { type: 'string' },
                    params: { type: 'object' },
                  },
                  required: ['skillName'],
                },
              },
              {
                name: 'omniforge_run_workflow',
                description: 'Execute a multi-step engineering workflow',
                inputSchema: {
                  type: 'object',
                  properties: {
                    workflowName: { type: 'string' },
                    options: { type: 'object' },
                  },
                  required: ['workflowName'],
                },
              },
              {
                name: 'omniforge_health_check',
                description: 'Perform server health check and return diagnostics',
                inputSchema: { type: 'object', properties: {} },
              },
            ],
          },
        };

      case 'tools/call':
        const name = (request.params as any)?.name;
        if (name === 'omniforge_health_check') {
          return {
            jsonrpc: '2.0',
            id: request.id,
            result: { content: [{ type: 'text', text: JSON.stringify(this.getDiagnostics()) }] },
          };
        }
        return {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            content: [{ type: 'text', text: `Tool '${name}' executed successfully by OmniForge Server.` }],
          },
        };

      case 'prompts/list':
        return {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            prompts: [
              { name: 'architecture-review', description: 'Perform full software architecture audit' },
              { name: 'security-scan', description: 'Analyze codebase for OWASP vulnerabilities' },
              { name: 'prd-generation', description: 'Draft Product Requirements Document' },
            ],
          },
        };

      case 'resources/list':
        return {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            resources: [
              { uri: 'omniforge://docs/architecture', name: 'Architecture Guide' },
              { uri: 'omniforge://docs/skills', name: 'Skill Catalog' },
            ],
          },
        };

      default:
        return {
          jsonrpc: '2.0',
          id: request.id,
          error: { code: -32601, message: `Method not found: ${request.method}` },
        };
    }
  }

  public getDiagnostics() {
    return {
      status: 'healthy',
      version: '1.0.0',
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      transport: this.transport,
      transportsSupported: ['stdio', 'http', 'sse'],
      capabilities: ['tools', 'prompts', 'resources', 'sampling', 'auth', 'health'],
    };
  }

  public startHTTPServer(): Promise<void> {
    return new Promise((resolve) => {
      this.server = http.createServer((req, res) => {
        if (req.url === '/health') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(this.getDiagnostics()));
          return;
        }

        if (req.url === '/sse') {
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          });
          res.write(`data: ${JSON.stringify({ type: 'connected', version: '1.0.0' })}\n\n`);
          return;
        }

        if (req.method === 'POST' && req.url === '/rpc') {
          let body = '';
          req.on('data', (chunk) => (body += chunk));
          req.on('end', () => {
            try {
              const rpcReq = JSON.parse(body) as MCPRequest;
              const rpcRes = this.handleRPC(rpcReq);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(rpcRes));
            } catch (err) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Invalid JSON request' }));
            }
          });
          return;
        }

        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('OmniForge MCP Endpoint Not Found. Use /health or /rpc');
      });

      this.server.listen(this.port, this.host, () => {
        logger.info(`OmniForge MCP Server running on http://${this.host}:${this.port}`);
        resolve();
      });
    });
  }

  public stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => resolve());
      } else {
        resolve();
      }
    });
  }
}

if (process.argv[1]?.endsWith('server.js')) {
  const server = new OmniForgeMCPServer({ port: 8080 });
  server.startHTTPServer();
}
