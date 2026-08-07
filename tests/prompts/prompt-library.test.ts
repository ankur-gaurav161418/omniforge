import { describe, it, expect } from 'vitest';
import { PromptEngine, PromptValidator } from '../../prompts/src/index.js';
import * as path from 'path';

describe('Prompt Library & Engine Suite', () => {
  it('should discover and load all 10 enterprise prompt library templates', () => {
    const engine = new PromptEngine(path.join(process.cwd(), 'prompts'));
    const prompts = engine.listPrompts();
    expect(prompts.length).toBeGreaterThanOrEqual(10);
  });

  it('should render variable interpolation correctly', () => {
    const engine = new PromptEngine(path.join(process.cwd(), 'prompts'));
    const rendered = engine.renderPrompt('engineering', {
      moduleName: 'CoreService',
      featureDescription: 'Add JWT Auth',
      language: 'TypeScript',
      requirements: 'Strict typing',
    });

    expect(rendered).toContain('CoreService');
    expect(rendered).toContain('Add JWT Auth');
  });

  it('should support search indexing via PromptIndexer', () => {
    const engine = new PromptEngine(path.join(process.cwd(), 'prompts'));
    const matches = engine.searchPrompts('architecture');
    expect(matches.length).toBeGreaterThan(0);
  });

  it('should validate prompt schema via PromptValidator', () => {
    const engine = new PromptEngine(path.join(process.cwd(), 'prompts'));
    const prompt = engine.getPrompt('architecture');
    expect(prompt).toBeDefined();
    if (prompt) {
      const val = engine.validatePrompt(prompt);
      expect(val.valid).toBe(true);
    }
  });
});
