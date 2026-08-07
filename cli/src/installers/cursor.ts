import * as path from 'path';
import { BaseClientInstaller } from './base-installer.js';

export class CursorInstaller extends BaseClientInstaller {
  public readonly id = 'cursor';
  public readonly name = 'Cursor IDE';

  public detect(): boolean {
    return true;
  }

  public getConfigPath(): string {
    return path.join(process.cwd(), '.cursor', 'mcp.json');
  }

  public generateConfig(mcpServerPath: string): object {
    return {
      mcpServers: {
        "omniforge": {
          command: "node",
          args: [mcpServerPath]
        }
      }
    };
  }

  public getRestartInstructions(): string {
    return "Reload Cursor window (Ctrl+Shift+P -> Reload Window) to activate OmniForge MCP Server.";
  }
}
