import * as fs from 'fs';
import * as path from 'path';
import { PromptValidator } from './prompt-validator.js';
import { PromptIndexer } from './prompt-indexer.js';

export interface PromptTemplate {
  id: string;
  name: string;
  category: string;
  template: string;
  variables: string[];
  tags?: string[];
  version?: string;
  author?: string;
}

export class PromptEngine {
  private promptsDir: string;
  private promptMap: Map<string, PromptTemplate> = new Map();
  private indexer: PromptIndexer = new PromptIndexer();

  constructor(customDir?: string) {
    this.promptsDir = customDir || path.join(process.cwd(), 'prompts');
    this.loadPrompts();
  }

  public loadPrompts(): void {
    try {
      const searchDirs = [this.promptsDir, path.join(this.promptsDir, 'library')];
      for (const dir of searchDirs) {
        if (!fs.existsSync(dir)) continue;
        const files = fs.readdirSync(dir);

        for (const file of files) {
          if (file.endsWith('.md')) {
            const id = path.basename(file, '.md');
            const filePath = path.join(dir, file);
            const raw = fs.readFileSync(filePath, 'utf-8');
            const parsed = this.parsePromptMarkdown(id, raw);
            this.promptMap.set(parsed.id, parsed);
            this.indexer.indexPrompt(parsed);
          }
        }
      }
    } catch (err) {
      // Fallback
    }
  }

  private parsePromptMarkdown(id: string, raw: string): PromptTemplate {
    const vars = Array.from(raw.matchAll(/\{\{([a-zA-Z0-9_]+)\}\}/g)).map((m) => m[1]);

    const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = raw.match(frontmatterRegex);

    let name = id.replace(/-/g, ' ').toUpperCase();
    let category = 'general';
    let tags = [id, 'omniforge'];
    let version = '1.0.0';
    let author = 'Ankur Gaurav';

    if (match) {
      const rawYaml = match[1];
      rawYaml.split('\n').forEach((line) => {
        const [k, ...v] = line.split(':');
        if (k && v.length) {
          const val = v.join(':').trim().replace(/^['"]|['"]$/g, '');
          const key = k.trim();
          if (key === 'name') name = val;
          if (key === 'category') category = val;
          if (key === 'version') version = val;
          if (key === 'author') author = val;
          if (key === 'tags') {
            try {
              tags = JSON.parse(val.replace(/'/g, '"'));
            } catch (e) {
              tags = val.replace(/[\[\]'"]/g, '').split(',').map((t) => t.trim());
            }
          }
        }
      });
    }

    return {
      id,
      name,
      category,
      template: raw,
      variables: Array.from(new Set(vars)),
      tags,
      version,
      author,
    };
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

  public searchPrompts(query: string): PromptTemplate[] {
    return this.indexer.search(query, this.promptMap);
  }

  public validatePrompt(prompt: PromptTemplate) {
    return PromptValidator.validate({
      name: prompt.name,
      description: `Prompt ${prompt.id}`,
      category: prompt.category as any,
      version: prompt.version,
      author: prompt.author,
      tags: prompt.tags,
      variables: prompt.variables,
    }, prompt.template);
  }

  public listPrompts(): PromptTemplate[] {
    return Array.from(this.promptMap.values());
  }
}
