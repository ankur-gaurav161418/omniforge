import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('CI Pipeline & Container Validator Suite', () => {
  it('should verify GitHub Actions workflow manifest exists', () => {
    const ciPath = path.join(process.cwd(), '.github', 'workflows', 'ci.yml');
    expect(fs.existsSync(ciPath)).toBe(true);
    const content = fs.readFileSync(ciPath, 'utf-8');
    expect(content).toContain('name: OmniForge CI Pipeline');
  });

  it('should verify Dockerfile configuration exists', () => {
    const dockerPath = path.join(process.cwd(), 'docker', 'Dockerfile');
    expect(fs.existsSync(dockerPath)).toBe(true);
    const content = fs.readFileSync(dockerPath, 'utf-8');
    expect(content).toContain('FROM node:20-alpine');
  });
});
