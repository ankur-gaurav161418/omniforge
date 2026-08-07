import { describe, it, expect } from 'vitest';
import { ConfigManager, Logger } from '../../packages/core/src/index.js';
import { OmniForgeClient } from '../../packages/sdk/src/index.js';

describe('API Backwards Compatibility Regression Suite', () => {
  it('ConfigManager contract should maintain defaults without breaking keys', () => {
    const mgr = new ConfigManager();
    const cfg = mgr.getConfig();
    expect(cfg.projectName).toBe('OmniForge Project');
    expect(cfg.version).toBe('1.0.0');
    expect(cfg.mcpServer.port).toBe(8080);
  });

  it('Logger contract should support all standard logging levels', () => {
    const logger = new Logger('RegressionTest');
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.debug).toBe('function');
  });

  it('OmniForgeClient contract should maintain health and workflow endpoints', () => {
    const client = new OmniForgeClient({ serverUrl: 'http://localhost:8080' });
    expect(typeof client.getHealth).toBe('function');
    expect(typeof client.listSkills).toBe('function');
    expect(typeof client.runWorkflow).toBe('function');
  });
});
