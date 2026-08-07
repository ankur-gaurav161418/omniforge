import { SkillDefinition } from './skill-engine.js';

export class SkillIndexer {
  private index: Map<string, Set<string>> = new Map();

  public indexSkill(skill: SkillDefinition): void {
    const tokens = new Set<string>();

    // Tokenize ID, name, description, category, and tags
    tokens.add(skill.id.toLowerCase());
    skill.metadata.name.toLowerCase().split(/\s+/).forEach((t) => tokens.add(t));
    skill.metadata.description.toLowerCase().split(/\s+/).forEach((t) => tokens.add(t));
    if (skill.metadata.category) tokens.add(skill.metadata.category.toLowerCase());
    if (skill.metadata.tags) {
      skill.metadata.tags.forEach((tag) => tokens.add(tag.toLowerCase()));
    }

    for (const token of tokens) {
      if (!this.index.has(token)) {
        this.index.set(token, new Set());
      }
      this.index.get(token)!.add(skill.id);
    }
  }

  public search(query: string, allSkills: Map<string, SkillDefinition>): SkillDefinition[] {
    const qTokens = query.toLowerCase().trim().split(/\s+/);
    const matchedIds = new Set<string>();

    for (const token of qTokens) {
      for (const [indexToken, skillIds] of this.index.entries()) {
        if (indexToken.includes(token)) {
          skillIds.forEach((id) => matchedIds.add(id));
        }
      }
    }

    const results: SkillDefinition[] = [];
    for (const id of matchedIds) {
      const skill = allSkills.get(id);
      if (skill) results.push(skill);
    }
    return results;
  }
}
