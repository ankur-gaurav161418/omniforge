import { describe, it, expect } from 'vitest';
import { EnvironmentValidator } from '../../cli/src/utils/environment.js';
import { Installer } from '../../cli/src/utils/installer.js';
import { MCPConfigurer } from '../../cli/src/utils/mcp-configurer.js';

describe('CLI Utility & Command Suite', () => {
  it('EnvironmentValidator should return node version and platform diagnostics', () => {
    const res = EnvironmentValidator.check();
    expect(res.nodeVersion).toBe(process.version);
    expect(res.platform).toBe(process.platform);
    expect(res.configValid).toBe(true);
  });

  it('Installer should return success result', async () => {
    const res = await Installer.installComponent('core-skills');
    expect(res.success).toBe(true);
    expect(res.message).toContain('core-skills');
  });

  it('MCPConfigurer should generate valid Claude Desktop configuration object', () => {
    const config = MCPConfigurer.generateClaudeDesktopConfig('/test/path/server.js') as any;
    expect(config.mcpServers['omniforge-mcp']).toBeDefined();
    expect(config.mcpServers['omniforge-mcp'].command).toBe('node');
    expect(config.mcpServers['omniforge-mcp'].args[0]).toBe('/test/path/server.js');
  });
});
