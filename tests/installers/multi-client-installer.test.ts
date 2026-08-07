import { describe, it, expect } from 'vitest';
import { InstallerRegistry } from '../../cli/src/installers/installer-registry.js';
import { ClaudeInstaller } from '../../cli/src/installers/claude.js';
import { CursorInstaller } from '../../cli/src/installers/cursor.js';
import { VSCodeInstaller } from '../../cli/src/installers/vscode.js';
import { CodexInstaller } from '../../cli/src/installers/codex.js';
import { ChatGPTInstaller } from '../../cli/src/installers/chatgpt.js';
import { GeminiInstaller } from '../../cli/src/installers/gemini.js';
import { AntigravityInstaller } from '../../cli/src/installers/antigravity.js';

describe('Multi-Client MCP Installer Suite', () => {
  it('InstallerRegistry should register all 7 client installers', () => {
    const registry = new InstallerRegistry();
    const list = registry.list();
    expect(list.length).toBe(7);
    expect(list.map((i) => i.id)).toEqual([
      'claude',
      'cursor',
      'vscode',
      'codex',
      'chatgpt',
      'gemini',
      'antigravity',
    ]);
  });

  it('ClaudeInstaller should generate valid MCP config and restart instructions', () => {
    const installer = new ClaudeInstaller();
    const config = installer.generateConfig('/path/to/server.js') as any;
    expect(config.mcpServers['omniforge-mcp']).toBeDefined();
    expect(installer.getRestartInstructions()).toContain('Claude Desktop');
  });

  it('CursorInstaller should generate valid Cursor MCP config', () => {
    const installer = new CursorInstaller();
    const config = installer.generateConfig('/path/to/server.js') as any;
    expect(config.mcpServers.omniforge).toBeDefined();
  });

  it('VSCodeInstaller should generate valid VS Code settings config', () => {
    const installer = new VSCodeInstaller();
    const config = installer.generateConfig('/path/to/server.js') as any;
    expect(config['mcp.servers'].omniforge).toBeDefined();
  });

  it('CodexInstaller should generate valid Codex MCP config', () => {
    const installer = new CodexInstaller();
    const config = installer.generateConfig('/path/to/server.js') as any;
    expect(config.codex.mcp_server).toBe('/path/to/server.js');
  });

  it('ChatGPTInstaller should generate valid OpenAI Action OpenAPI schema', () => {
    const installer = new ChatGPTInstaller();
    const config = installer.generateConfig('/path/to/server.js') as any;
    expect(config.openapi).toBe('3.1.0');
  });

  it('GeminiInstaller should generate valid Gemini CLI MCP config', () => {
    const installer = new GeminiInstaller();
    const config = installer.generateConfig('/path/to/server.js') as any;
    expect(config.gemini_mcp_servers[0].name).toBe('omniforge');
  });

  it('AntigravityInstaller should generate valid Antigravity agent config', () => {
    const installer = new AntigravityInstaller();
    const config = installer.generateConfig('/path/to/server.js') as any;
    expect(config.antigravity_agent.author).toBe('Ankur Gaurav');
  });

  it('InstallerRegistry installAll should execute all 7 installations', async () => {
    const registry = new InstallerRegistry();
    const results = await registry.installAll('/path/to/server.js');
    expect(results.length).toBe(7);
    expect(results.every((r) => r.installed)).toBe(true);
  });
});
