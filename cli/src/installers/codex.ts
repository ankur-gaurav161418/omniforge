import * as path from 'path';
import { BaseClientInstaller } from './base-installer.js';

export class CodexInstaller extends BaseClientInstaller {
  public readonly id = 'codex';
  public readonly name = 'OpenAI Codex CLI';

  public detect(): boolean {
    return true;
  }

  public getConfigPath(): string {
    return path.join(process.cwd(), '.omniforge', 'codex_mcp.json');
  }

  public generateConfig(mcpServerPath: string): object {
    return {
      "codex": {
        "mcp_server": mcpServerPath,
        "protocol": "stdio"
      }
    };
  }

  public getRestartInstructions(): string {
    return "Re-run codex CLI session to inherit OmniForge MCP Server context.";
  }
}
