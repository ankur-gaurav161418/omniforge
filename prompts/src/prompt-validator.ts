export interface PromptFrontmatter {
  name: string;
  description: string;
  category: 'engineering' | 'architecture' | 'prd' | 'testing' | 'debugging' | 'release' | 'documentation' | 'planning' | 'code-review' | 'deployment' | 'general';
  version: string;
  author: string;
  tags: string[];
  variables?: string[];
}

export interface PromptValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export class PromptValidator {
  public static validate(frontmatter: Partial<PromptFrontmatter>, rawTemplate?: string): PromptValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!frontmatter.name || typeof frontmatter.name !== 'string') {
      errors.push('Prompt name is required and must be a string');
    }
    if (!frontmatter.description || typeof frontmatter.description !== 'string') {
      errors.push('Prompt description is required and must be a string');
    }

    if (rawTemplate) {
      const varsInTemplate = Array.from(rawTemplate.matchAll(/\{\{([a-zA-Z0-9_]+)\}\}/g)).map((m) => m[1]);
      if (varsInTemplate.length === 0) {
        warnings.push('Prompt template contains no variable placeholders {{var}}');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
