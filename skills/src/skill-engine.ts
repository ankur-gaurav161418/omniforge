import * as fs from 'fs';
import * as path from 'path';
import { SkillValidator } from './skill-validator.js';
import { SkillIndexer } from './skill-indexer.js';

export interface SkillMetadata {
  name: string;
  description: string;
  category: 'architecture' | 'engineering' | 'testing' | 'workflow' | 'debugging' | 'general';
  version: string;
  author: string;
  tags: string[];
  examples?: string[];
}

export interface SkillDefinition {
  id: string;
  metadata: SkillMetadata;
  content: string;
  filePath: string;
}

export class SkillEngine {
  private skillsMap: Map<string, SkillDefinition> = new Map();
  private indexer: SkillIndexer = new SkillIndexer();
  private baseDir: string;

  constructor(customBaseDir?: string) {
    this.baseDir = customBaseDir || path.join(process.cwd(), 'skills');
    this.discoverSkills();
  }

  public discoverSkills(): void {
    try {
      const searchDirs = [this.baseDir, path.join(this.baseDir, 'catalog')];
      for (const dir of searchDirs) {
        if (!fs.existsSync(dir)) continue;
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
          if (entry.isDirectory()) {
            const skillFilePath = path.join(dir, entry.name, 'SKILL.md');
            if (fs.existsSync(skillFilePath)) {
              const content = fs.readFileSync(skillFilePath, 'utf-8');
              const parsed = this.parseSkillMarkdown(entry.name, content, skillFilePath);
              this.skillsMap.set(parsed.id, parsed);
              this.indexer.indexSkill(parsed);
            }
          }
        }
      }
    } catch (err) {
      // Fallback
    }
  }

  private parseSkillMarkdown(id: string, content: string, filePath: string): SkillDefinition {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = content.match(frontmatterRegex);

    let metadata: SkillMetadata = {
      name: id,
      description: `OmniForge skill for ${id}`,
      category: 'general',
      version: '1.0.0',
      author: 'Ankur Gaurav',
      tags: [id, 'omniforge'],
    };

    if (match) {
      const rawYaml = match[1];
      rawYaml.split('\n').forEach((line) => {
        const [k, ...v] = line.split(':');
        if (k && v.length) {
          const val = v.join(':').trim();
          const key = k.trim();
          if (key === 'name') metadata.name = val.replace(/^['"]|['"]$/g, '');
          if (key === 'description') metadata.description = val.replace(/^['"]|['"]$/g, '');
          if (key === 'category') metadata.category = val.replace(/^['"]|['"]$/g, '') as any;
          if (key === 'version') metadata.version = val.replace(/^['"]|['"]$/g, '');
          if (key === 'author') metadata.author = val.replace(/^['"]|['"]$/g, '');
          if (key === 'tags') {
            try {
              const cleaned = val.replace(/'/g, '"');
              metadata.tags = JSON.parse(cleaned);
            } catch (e) {
              metadata.tags = val.replace(/[\[\]'"]/g, '').split(',').map((t) => t.trim());
            }
          }
        }
      });
    }

    return {
      id,
      metadata,
      content,
      filePath,
    };
  }

  public getSkill(id: string): SkillDefinition | undefined {
    return this.skillsMap.get(id);
  }

  public searchSkills(query: string): SkillDefinition[] {
    return this.indexer.search(query, this.skillsMap);
  }

  public validateSkill(skill: SkillDefinition) {
    return SkillValidator.validate(skill.metadata);
  }

  public listSkills(): SkillDefinition[] {
    return Array.from(this.skillsMap.values());
  }
}
