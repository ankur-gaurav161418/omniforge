import { describe, it, expect } from 'vitest';
import { ConfigManager, Logger, TelemetryService, PluginLoader, OmniForgeError, ConfigError } from '../../packages/core/src/index.js';

describe('Unit Tests: @omniforge/core', () => {
  it('should instantiate OmniForgeError with custom error code', () => {
    const err = new ConfigError('Invalid configuration setting');
    expect(err.code).toBe('CONFIG_ERROR');
    expect(err.name).toBe('ConfigError');
    expect(err.message).toBe('Invalid configuration setting');
  });

  it('should handle environment variable overrides in ConfigManager', () => {
    process.env.OMNIFORGE_MCP_PORT = '9090';
    const configManager = new ConfigManager();
    const config = configManager.getConfig();
    expect(config.mcpServer.port).toBe(9090);
    delete process.env.OMNIFORGE_MCP_PORT;
  });

  it('should format logs and handle logger levels', () => {
    const logger = new Logger('Test', 'debug', false);
    expect(() => logger.debug('Debug log')).not.toThrow();
  });
});
