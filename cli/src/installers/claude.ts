import * as path from 'path';
import { BaseClientInstaller } from './base-installer.js';

export class ClaudeInstaller extends BaseClientInstaller {
  public readonly id = 'claude';
  public readonly name = 'Claude Desktop';

  public detect(): boolean {
    return true;
  }

  public getConfigPath(): string {
    return path.join(process.cwd(), '.omniforge', 'claude_desktop_config.json');
  }

  public generateConfig(mcpServerPath: string): object {
    return {
      mcpServers: {
        "omniforge-mcp": {
          command: "node",
          args: [mcpServerPath]
        }
      }
    };
  }

  public getRestartInstructions(): string {
    return "Restart Claude Desktop app to load OmniForge MCP Server.";
  }
}
