import * as fs from 'fs';
import * as path from 'path';
import { ConfigError } from '../errors/errors.js';

export interface OmniForgeConfig {
  projectName: string;
  version: string;
  mcpServer: {
    transport: 'stdio' | 'http' | 'sse';
    port: number;
    host: string;
    authEnabled: boolean;
  };
  telemetry: {
    enabled: boolean;
    anonymousId: string;
  };
  skills: {
    autoLoad: boolean;
    customDirectory?: string;
  };
  prompts: {
    customDirectory?: string;
  };
  plugins: string[];
}

export const DEFAULT_CONFIG: OmniForgeConfig = {
  projectName: 'OmniForge Project',
  version: '1.0.0',
  mcpServer: {
    transport: 'stdio',
    port: 8080,
    host: 'localhost',
    authEnabled: false,
  },
  telemetry: {
    enabled: false,
    anonymousId: 'of-anon-' + Math.random().toString(36).substring(2, 9),
  },
  skills: {
    autoLoad: true,
  },
  prompts: {},
  plugins: [],
};

export class ConfigManager {
  private configPath: string;
  private currentConfig: OmniForgeConfig;

  constructor(customPath?: string) {
    this.configPath = customPath || path.join(process.cwd(), '.omniforge', 'config.json');
    this.currentConfig = this.loadConfig();
  }

  public loadConfig(): OmniForgeConfig {
    let loadedConfig: OmniForgeConfig = { ...DEFAULT_CONFIG };
    try {
      if (fs.existsSync(this.configPath)) {
        const raw = fs.readFileSync(this.configPath, 'utf-8');
        const parsed = JSON.parse(raw);
        loadedConfig = { ...DEFAULT_CONFIG, ...parsed };
      }
    } catch (err) {
      // Fallback cleanly
    }

    // Apply Environment Variable Overrides
    if (process.env.OMNIFORGE_MCP_PORT) {
      const parsedPort = parseInt(process.env.OMNIFORGE_MCP_PORT, 10);
      if (!isNaN(parsedPort)) loadedConfig.mcpServer.port = parsedPort;
    }
    if (process.env.OMNIFORGE_MCP_TRANSPORT) {
      const transport = process.env.OMNIFORGE_MCP_TRANSPORT.toLowerCase();
      if (['stdio', 'http', 'sse'].includes(transport)) {
        loadedConfig.mcpServer.transport = transport as any;
      }
    }
    if (process.env.OMNIFORGE_TELEMETRY) {
      loadedConfig.telemetry.enabled = process.env.OMNIFORGE_TELEMETRY === 'true';
    }

    return loadedConfig;
  }

  public saveConfig(config: Partial<OmniForgeConfig>): OmniForgeConfig {
    this.currentConfig = { ...this.currentConfig, ...config };
    const dir = path.dirname(this.configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(this.configPath, JSON.stringify(this.currentConfig, null, 2), 'utf-8');
    return this.currentConfig;
  }

  public getConfig(): OmniForgeConfig {
    return this.currentConfig;
  }

  public validateConfig(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!this.currentConfig.projectName) errors.push('projectName is required');
    if (!['stdio', 'http', 'sse'].includes(this.currentConfig.mcpServer.transport)) {
      errors.push('mcpServer.transport must be stdio, http, or sse');
    }
    if (this.currentConfig.mcpServer.port <= 0 || this.currentConfig.mcpServer.port > 65535) {
      errors.push('mcpServer.port must be a valid port number (1-65535)');
    }
    return {
      valid: errors.length === 0,
      errors,
    };
  }

  public assertValidConfig(): void {
    const validation = this.validateConfig();
    if (!validation.valid) {
      throw new ConfigError(`Invalid OmniForge configuration: ${validation.errors.join(', ')}`);
    }
  }
}
