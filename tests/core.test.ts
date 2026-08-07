import { describe, it, expect } from 'vitest';
import { ConfigManager, Logger, TelemetryService, PluginLoader } from '../packages/core/src/index.js';

describe('OmniForge Core Package', () => {
  it('ConfigManager should initialize with defaults and save config', () => {
    const configManager = new ConfigManager();
    const config = configManager.getConfig();
    expect(config.projectName).toBe('OmniForge Project');
    expect(config.version).toBe('1.0.0');

    const validation = configManager.validateConfig();
    expect(validation.valid).toBe(true);
  });

  it('Logger should format log entries correctly', () => {
    const logger = new Logger('TestPrefix', 'debug');
    expect(() => logger.info('Test log message')).not.toThrow();
  });

  it('TelemetryService should track events when enabled', () => {
    const telemetry = new TelemetryService(true, 'test-anon-123');
    telemetry.track('cli_command_executed', { command: 'doctor' });
    const events = telemetry.getQueuedEvents();
    expect(events.length).toBe(1);
    expect(events[0].event).toBe('cli_command_executed');
  });

  it('PluginLoader should register and initialize plugins', async () => {
    const loader = new PluginLoader();
    let initCalled = false;

    loader.registerPlugin({
      name: 'test-plugin',
      version: '1.0.0',
      description: 'Test plugin',
      init: async () => {
        initCalled = true;
      },
    });

    expect(loader.listPlugins().length).toBe(1);
    await loader.initializeAll({});
    expect(initCalled).toBe(true);
  });
});
