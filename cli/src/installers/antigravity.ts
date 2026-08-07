import * as path from 'path';
import { BaseClientInstaller } from './base-installer.js';

export class AntigravityInstaller extends BaseClientInstaller {
  public readonly id = 'antigravity';
  public readonly name = 'Google Antigravity';

  public detect(): boolean {
    return true;
  }

  public getConfigPath(): string {
    return path.join(process.cwd(), '.omniforge', 'antigravity_mcp.json');
  }

  public generateConfig(mcpServerPath: string): object {
    return {
      "antigravity_agent": {
        "mcp_server": mcpServerPath,
        "protocol": "stdio",
        "author": "Ankur Gaurav"
      }
    };
  }

  public getRestartInstructions(): string {
    return "Reload Google Antigravity session to register OmniForge MCP Server.";
  }
}
