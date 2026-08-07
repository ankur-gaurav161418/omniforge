import * as path from 'path';
import { BaseClientInstaller } from './base-installer.js';

export class VSCodeInstaller extends BaseClientInstaller {
  public readonly id = 'vscode';
  public readonly name = 'VS Code';

  public detect(): boolean {
    return true;
  }

  public getConfigPath(): string {
    return path.join(process.cwd(), '.vscode', 'settings.json');
  }

  public generateConfig(mcpServerPath: string): object {
    return {
      "mcp.servers": {
        "omniforge": {
          "type": "stdio",
          "command": "node",
          "args": [mcpServerPath]
        }
      }
    };
  }

  public getRestartInstructions(): string {
    return "Restart VS Code workspace to connect OmniForge MCP Server.";
  }
}
