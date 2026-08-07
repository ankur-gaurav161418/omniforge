import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Documentation Suite Integrity Test', () => {
  const docsDir = path.join(process.cwd(), 'docs');

  const requiredDocs = [
    'README.md',
    'ARCHITECTURE.md',
    'INSTALLATION.md',
    'QUICKSTART.md',
    'DEVELOPER.md',
    'CONTRIBUTION.md',
    'API_REFERENCE.md',
    'CLI.md',
    'SKILLS.md',
    'PROMPTS.md',
    'MCP.md',
    'TROUBLESHOOTING.md',
    'FAQ.md',
    'RELEASE_PROCESS.md',
    'MIGRATION.md',
  ];

  it('should verify all 15 required documentation guides exist', () => {
    for (const doc of requiredDocs) {
      const docPath = path.join(docsDir, doc);
      expect(fs.existsSync(docPath)).toBe(true);
    }
  });

  it('should verify all documentation files attribute Ankur Gaurav', () => {
    for (const doc of requiredDocs) {
      const docPath = path.join(docsDir, doc);
      const content = fs.readFileSync(docPath, 'utf-8');
      expect(content).toContain('Ankur Gaurav');
    }
  });
});
