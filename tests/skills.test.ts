import { describe, it, expect } from 'vitest';
import { SkillEngine } from '../skills/src/skill-engine.js';
import * as path from 'path';

describe('OmniForge Skill Engine', () => {
  it('should discover and load skills from skills directory', () => {
    const engine = new SkillEngine(path.join(process.cwd(), 'skills'));
    const skills = engine.listSkills();
    expect(skills.length).toBeGreaterThanOrEqual(14);
  });

  it('should search skills by keyword', () => {
    const engine = new SkillEngine(path.join(process.cwd(), 'skills'));
    const matches = engine.searchSkills('brainstorming');
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].id).toBe('brainstorming');
  });
});
