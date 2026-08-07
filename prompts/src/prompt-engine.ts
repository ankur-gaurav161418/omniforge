import * as fs from 'fs';
import * as path from 'path';

export interface PromptTemplate {
  id: string;
  name: string;
  category: string;
  template: string;
  variables: string[];
}

export class PromptEngine {
  private promptsDir: string;
  private promptMap: Map<string, PromptTemplate> = new Map();

  constructor(customDir?: string) {
    this.promptsDir = customDir || path.join(process.cwd(), 'prompts', 'library');
    this.loadPrompts();
  }

  public loadPrompts(): void {
    try {
      if (!fs.existsSync(this.promptsDir)) return;
      const files = fs.readdirSync(this.promptsDir);

      for (const file of files) {
        if (file.endsWith('.md')) {
          const id = path.basename(file, '.md');
          const filePath = path.join(this.promptsDir, file);
          const raw = fs.readFileSync(filePath, 'utf-8');
          const vars = Array.from(raw.matchAll(/\{\{([a-zA-Z0-9_]+)\}\}/g)).map((m) => m[1]);

          this.promptMap.set(id, {
            id,
            name: id.replace(/-/g, ' ').toUpperCase(),
            category: 'general',
            template: raw,
            variables: Array.from(new Set(vars)),
          });
        }
      }
    } catch (err) {
      // Fallback
    }
  }

  public getPrompt(id: string): PromptTemplate | undefined {
    return this.promptMap.get(id);
  }

  public renderPrompt(id: string, variables: Record<string, string>): string {
    const prompt = this.getPrompt(id);
    if (!prompt) throw new Error(`Prompt '${id}' not found`);

    let rendered = prompt.template;
    for (const [k, v] of Object.entries(variables)) {
      rendered = rendered.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v);
    }
    return rendered;
  }

  public listPrompts(): PromptTemplate[] {
    return Array.from(this.promptMap.values());
  }
}
