import * as path from 'path';
import { BaseClientInstaller } from './base-installer.js';

export class ChatGPTInstaller extends BaseClientInstaller {
  public readonly id = 'chatgpt';
  public readonly name = 'ChatGPT Actions';

  public detect(): boolean {
    return true;
  }

  public getConfigPath(): string {
    return path.join(process.cwd(), '.omniforge', 'chatgpt_action_schema.json');
  }

  public generateConfig(): object {
    return {
      openapi: "3.1.0",
      info: {
        title: "OmniForge MCP API",
        version: "1.7.0"
      },
      servers: [{ url: "http://localhost:8080" }]
    };
  }

  public getRestartInstructions(): string {
    return "Import chatgpt_action_schema.json into your Custom GPT Action settings.";
  }
}
