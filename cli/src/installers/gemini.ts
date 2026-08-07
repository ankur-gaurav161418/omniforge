import * as path from 'path';
import { BaseClientInstaller } from './base-installer.js';

export class GeminiInstaller extends BaseClientInstaller {
  public readonly id = 'gemini';
  public readonly name = 'Google Gemini CLI';

  public detect(): boolean {
    return true;
  }

  public getConfigPath(): string {
    return path.join(process.cwd(), '.omniforge', 'gemini_mcp.json');
  }

  public generateConfig(mcpServerPath: string): object {
    return {
      "gemini_mcp_servers": [
        {
          "name": "omniforge",
          "command": "node",
          "args": [mcpServerPath]
        }
      ]
    };
  }

  public getRestartInstructions(): string {
    return "Restart Gemini CLI process to activate OmniForge MCP Server integration.";
  }
}
