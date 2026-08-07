import { PromptTemplate } from './prompt-engine.js';

export class PromptIndexer {
  private index: Map<string, Set<string>> = new Map();

  public indexPrompt(prompt: PromptTemplate): void {
    const tokens = new Set<string>();

    tokens.add(prompt.id.toLowerCase());
    prompt.name.toLowerCase().split(/\s+/).forEach((t) => tokens.add(t));
    if (prompt.category) tokens.add(prompt.category.toLowerCase());
    if (prompt.tags) {
      prompt.tags.forEach((tag) => tokens.add(tag.toLowerCase()));
    }
    if (prompt.variables) {
      prompt.variables.forEach((v) => tokens.add(v.toLowerCase()));
    }

    for (const token of tokens) {
      if (!this.index.has(token)) {
        this.index.set(token, new Set());
      }
      this.index.get(token)!.add(prompt.id);
    }
  }

  public search(query: string, allPrompts: Map<string, PromptTemplate>): PromptTemplate[] {
    const qTokens = query.toLowerCase().trim().split(/\s+/);
    const matchedIds = new Set<string>();

    for (const token of qTokens) {
      for (const [indexToken, promptIds] of this.index.entries()) {
        if (indexToken.includes(token)) {
          promptIds.forEach((id) => matchedIds.add(id));
        }
      }
    }

    const results: PromptTemplate[] = [];
    for (const id of matchedIds) {
      const prompt = allPrompts.get(id);
      if (prompt) results.push(prompt);
    }
    return results;
  }
}
