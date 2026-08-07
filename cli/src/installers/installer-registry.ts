import { BaseClientInstaller, InstallResult } from './base-installer.js';
import { ClaudeInstaller } from './claude.js';
import { CursorInstaller } from './cursor.js';
import { VSCodeInstaller } from './vscode.js';
import { CodexInstaller } from './codex.js';
import { ChatGPTInstaller } from './chatgpt.js';
import { GeminiInstaller } from './gemini.js';
import { AntigravityInstaller } from './antigravity.js';
import * as path from 'path';

export class InstallerRegistry {
  private installers: Map<string, BaseClientInstaller> = new Map();

  constructor() {
    this.register(new ClaudeInstaller());
    this.register(new CursorInstaller());
    this.register(new VSCodeInstaller());
    this.register(new CodexInstaller());
    this.register(new ChatGPTInstaller());
    this.register(new GeminiInstaller());
    this.register(new AntigravityInstaller());
  }

  public register(installer: BaseClientInstaller): void {
    this.installers.set(installer.id, installer);
  }

  public get(id: string): BaseClientInstaller | undefined {
    return this.installers.get(id);
  }

  public list(): BaseClientInstaller[] {
    return Array.from(this.installers.values());
  }

  public async installAll(mcpServerPath?: string): Promise<InstallResult[]> {
    const serverPath = mcpServerPath || path.join(process.cwd(), 'mcp', 'dist', 'server.js');
    const results: InstallResult[] = [];
    for (const installer of this.installers.values()) {
      const res = await installer.install(serverPath);
      results.push(res);
    }
    return results;
  }
}
