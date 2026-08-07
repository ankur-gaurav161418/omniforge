import * as fs from 'fs';
import * as path from 'path';

export class MCPConfigurer {
  public static generateClaudeDesktopConfig(mcpServerPath?: string): object {
    const serverPath = mcpServerPath || path.join(process.cwd(), 'mcp', 'dist', 'server.js');
    return {
      mcpServers: {
        "omniforge-mcp": {
          command: "node",
          args: [serverPath],
          env: {
            NODE_ENV: "production"
          }
        }
      }
    };
  }

  public static writeClaudeConfig(outputPath?: string): string {
    const config = this.generateClaudeDesktopConfig();
    const file = outputPath || path.join(process.cwd(), '.omniforge', 'claude_desktop_config.json');
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(file, JSON.stringify(config, null, 2), 'utf-8');
    return file;
  }
}
