import { describe, it, expect } from 'vitest';
import { SkillEngine, SkillValidator } from '../../skills/src/index.js';
import * as path from 'path';

describe('Skill Catalog & Validation Suite', () => {
  it('should discover and load all 14 catalog skills', () => {
    const engine = new SkillEngine(path.join(process.cwd(), 'skills'));
    const skills = engine.listSkills();
    expect(skills.length).toBeGreaterThanOrEqual(14);
  });

  it('should pass schema validation for every skill in catalog', () => {
    const engine = new SkillEngine(path.join(process.cwd(), 'skills'));
    const skills = engine.listSkills();

    for (const skill of skills) {
      const val = SkillValidator.validate(skill.metadata);
      expect(val.valid).toBe(true);
      expect(val.errors.length).toBe(0);
    }
  });

  it('should support full-text and tag searching via SkillIndexer', () => {
    const engine = new SkillEngine(path.join(process.cwd(), 'skills'));
    const tddMatches = engine.searchSkills('tdd');
    expect(tddMatches.length).toBeGreaterThan(0);

    const debugMatches = engine.searchSkills('debugging');
    expect(debugMatches.length).toBeGreaterThan(0);
  });
});
