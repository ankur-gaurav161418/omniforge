import * as http from 'http';
import { Logger } from '@omniforge/core';
import { ToolRegistry } from './handlers/tools.js';
import { PromptRegistry } from './handlers/prompts.js';
import { ResourceRegistry } from './handlers/resources.js';
import { AuthMiddleware } from './middleware/auth.js';
import { STDIOTransport } from './transports/stdio.js';
import { SSETransport } from './transports/sse.js';

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
  private transportMode: 'stdio' | 'http' | 'sse' | 'multi';
  private server?: http.Server;
  private startTime: number = Date.now();

  public readonly toolRegistry: ToolRegistry;
  public readonly promptRegistry: PromptRegistry;
  public readonly resourceRegistry: ResourceRegistry;
  public readonly authMiddleware: AuthMiddleware;
  public readonly sseTransport: SSETransport;

  constructor(options: { port?: number; host?: string; transport?: 'stdio' | 'http' | 'sse' | 'multi'; secretToken?: string } = {}) {
    this.port = options.port || (process.env.OMNIFORGE_MCP_PORT ? parseInt(process.env.OMNIFORGE_MCP_PORT, 10) : 8080);
    this.host = options.host || '0.0.0.0';
    this.transportMode = options.transport || 'multi';

    this.toolRegistry = new ToolRegistry();
    this.promptRegistry = new PromptRegistry();
    this.resourceRegistry = new ResourceRegistry();
    this.authMiddleware = new AuthMiddleware(options.secretToken);
    this.sseTransport = new SSETransport();
  }

  public handleRPC(request: MCPRequest): MCPResponse {
    logger.info(`JSON-RPC request: ${request.method}`);

    try {
      switch (request.method) {
        case 'initialize':
          return {
            jsonrpc: '2.0',
            id: request.id,
            result: {
              protocolVersion: '2024-11-05',
              capabilities: {
                tools: { listChanged: true },
                prompts: { listChanged: true },
                resources: { subscribe: true, listChanged: true },
                sampling: {},
                logging: {},
              },
              serverInfo: {
                name: 'OmniForge MCP Server',
                version: '1.2.0',
                upstream: 'obra/superpowers',
              },
            },
          };

        case 'tools/list':
          return {
            jsonrpc: '2.0',
            id: request.id,
            result: { tools: this.toolRegistry.listTools() },
          };

        case 'tools/call':
          const toolName = (request.params as any)?.name;
          const toolArgs = (request.params as any)?.arguments || {};
          const execRes = this.toolRegistry.executeTool(toolName, toolArgs);
          return {
            jsonrpc: '2.0',
            id: request.id,
            result: { content: [{ type: 'text', text: execRes.result }] },
          };

        case 'prompts/list':
          return {
            jsonrpc: '2.0',
            id: request.id,
            result: { prompts: this.promptRegistry.listPrompts() },
          };

        case 'prompts/get':
          const promptName = (request.params as any)?.name;
          const promptArgs = (request.params as any)?.arguments || {};
          const promptRes = this.promptRegistry.getPrompt(promptName, promptArgs);
          return {
            jsonrpc: '2.0',
            id: request.id,
            result: {
              description: promptRes.name,
              messages: [{ role: 'user', content: { type: 'text', text: promptRes.rendered } }],
            },
          };

        case 'resources/list':
          return {
            jsonrpc: '2.0',
            id: request.id,
            result: { resources: this.resourceRegistry.listResources() },
          };

        case 'resources/read':
          const uri = (request.params as any)?.uri;
          const resRes = this.resourceRegistry.readResource(uri);
          return {
            jsonrpc: '2.0',
            id: request.id,
            result: { contents: [{ uri: resRes.uri, mimeType: resRes.mimeType, text: resRes.text }] },
          };

        default:
          return {
            jsonrpc: '2.0',
            id: request.id,
            error: { code: -32601, message: `Method not found: ${request.method}` },
          };
      }
    } catch (err: any) {
      return {
        jsonrpc: '2.0',
        id: request.id,
        error: { code: -32603, message: err.message || 'Internal server error' },
      };
    }
  }

  public getDiagnostics() {
    return {
      status: 'healthy',
      version: '1.2.0',
      upstream: 'obra/superpowers (MIT License)',
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      transportsSupported: ['stdio', 'http', 'sse'],
      toolsRegistered: this.toolRegistry.listTools().length,
      promptsRegistered: this.promptRegistry.listPrompts().length,
      resourcesRegistered: this.resourceRegistry.listResources().length,
      activeSSEConnections: this.sseTransport.getClientCount(),
      memoryUsage: process.memoryUsage(),
    };
  }

  public startSTDIO(): void {
    logger.info('Starting OmniForge MCP STDIO Transport...');
    const stdio = new STDIOTransport((req) => this.handleRPC(req));
    stdio.listen();
  }

  public startHTTPServer(): Promise<void> {
    return new Promise((resolve) => {
      this.server = http.createServer((req, res) => {
        // Authenticate HTTP requests
        const auth = this.authMiddleware.authenticateRequest(req);
        if (!auth.authenticated && req.url !== '/health') {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Unauthorized: Invalid API key or Bearer token' }));
          return;
        }

        if (req.url === '/health' || req.url === '/metrics') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(this.getDiagnostics(), null, 2));
          return;
        }

        if (req.url === '/sse') {
          this.sseTransport.handleConnection(req, res);
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
              res.end(JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Invalid JSON' } }));
            }
          });
          return;
        }

        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('OmniForge MCP Endpoint Not Found. Endpoints: /health, /rpc, /sse');
      });

      this.server.listen(this.port, this.host, () => {
        logger.info(`OmniForge Production MCP Server running on http://${this.host}:${this.port}`);
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
  const isStdio = process.argv.includes('--stdio');
  const server = new OmniForgeMCPServer();
  if (isStdio) {
    server.startSTDIO();
  } else {
    server.startHTTPServer();
  }
}
