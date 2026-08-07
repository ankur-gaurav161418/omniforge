export interface SkillFrontmatter {
  name: string;
  description: string;
  category: 'architecture' | 'engineering' | 'testing' | 'workflow' | 'debugging' | 'general';
  version: string;
  author: string;
  tags: string[];
  examples?: string[];
}

export interface SkillValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export class SkillValidator {
  public static validate(frontmatter: Partial<SkillFrontmatter>): SkillValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!frontmatter.name || typeof frontmatter.name !== 'string') {
      errors.push('Skill name is required and must be a string');
    }
    if (!frontmatter.description || typeof frontmatter.description !== 'string') {
      errors.push('Skill description is required and must be a string');
    }
    if (!frontmatter.category) {
      warnings.push('Skill category is missing; defaulting to general');
    }
    if (!frontmatter.version) {
      warnings.push('Skill version is missing; defaulting to 1.0.0');
    }
    if (!frontmatter.tags || !Array.isArray(frontmatter.tags)) {
      warnings.push('Skill tags array is missing');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
