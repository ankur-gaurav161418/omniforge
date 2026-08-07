import * as fs from 'fs';
import * as path from 'path';

export interface SkillMetadata {
  name: string;
  description: string;
  category: 'architecture' | 'engineering' | 'testing' | 'workflow' | 'debugging' | 'general';
  version: string;
  author: string;
  tags: string[];
}

export interface SkillDefinition {
  id: string;
  metadata: SkillMetadata;
  content: string;
  filePath: string;
}

export class SkillEngine {
  private skillsMap: Map<string, SkillDefinition> = new Map();
  private baseDir: string;

  constructor(customBaseDir?: string) {
    this.baseDir = customBaseDir || path.join(process.cwd(), 'skills');
    this.discoverSkills();
  }

  public discoverSkills(): void {
    try {
      if (!fs.existsSync(this.baseDir)) return;
      const entries = fs.readdirSync(this.baseDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const skillFilePath = path.join(this.baseDir, entry.name, 'SKILL.md');
          if (fs.existsSync(skillFilePath)) {
            const content = fs.readFileSync(skillFilePath, 'utf-8');
            const parsed = this.parseSkillMarkdown(entry.name, content, skillFilePath);
            this.skillsMap.set(parsed.id, parsed);
          }
        }
      }
    } catch (err) {
      // Fallback cleanly
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
      author: 'OmniForge Team (Derived from obra/superpowers)',
      tags: [id, 'omniforge'],
    };

    if (match) {
      const rawYaml = match[1];
      rawYaml.split('\n').forEach((line) => {
        const [k, ...v] = line.split(':');
        if (k && v.length) {
          const val = v.join(':').trim().replace(/^['"]|['"]$/g, '');
          if (k.trim() === 'name') metadata.name = val;
          if (k.trim() === 'description') metadata.description = val;
          if (k.trim() === 'category') metadata.category = val as any;
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
    const q = query.toLowerCase();
    return Array.from(this.skillsMap.values()).filter(
      (s) =>
        s.id.toLowerCase().includes(q) ||
        s.metadata.name.toLowerCase().includes(q) ||
        s.metadata.description.toLowerCase().includes(q)
    );
  }

  public validateSkill(skill: SkillDefinition): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!skill.id) errors.push('Skill ID is required');
    if (!skill.metadata.name) errors.push('Skill name is required');
    if (!skill.metadata.description) errors.push('Skill description is required');
    return {
      valid: errors.length === 0,
      errors,
    };
  }

  public listSkills(): SkillDefinition[] {
    return Array.from(this.skillsMap.values());
  }
}
