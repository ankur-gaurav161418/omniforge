export interface MCPPromptDefinition {
  name: string;
  description: string;
  arguments?: Array<{ name: string; description: string; required?: boolean }>;
}

export class PromptRegistry {
  private prompts: Map<string, MCPPromptDefinition> = new Map();

  constructor() {
    this.registerDefaultPrompts();
  }

  private registerDefaultPrompts(): void {
    const promptList = [
      { name: 'architecture-review', desc: 'Perform software architecture audit and SOLID verification' },
      { name: 'security-scan', desc: 'Analyze codebase for OWASP vulnerabilities and secret leaks' },
      { name: 'prd-generation', desc: 'Draft Product Requirements Document with user stories' },
      { name: 'code-review', desc: 'Perform structured code review for pull requests' },
      { name: 'refactoring-guide', desc: 'Analyze legacy code and output clean refactoring plan' },
      { name: 'debugging-guide', desc: 'Scientific hypothesis testing for bug isolation' },
      { name: 'testing-strategy', desc: 'Draft unit, integration, and regression test plan' },
      { name: 'release-notes', desc: 'Generate semantic version changelog and release notes' },
      { name: 'documentation-audit', desc: 'Audit API reference and user guides for accuracy' },
      { name: 'deployment-checklist', desc: 'Production deployment safety checklist' },
    ];

    for (const p of promptList) {
      this.prompts.set(p.name, {
        name: p.name,
        description: p.desc,
        arguments: [
          { name: 'target', description: 'Target file, module, or PR name', required: true },
          { name: 'context', description: 'Additional background context', required: false },
        ],
      });
    }
  }

  public listPrompts(): MCPPromptDefinition[] {
    return Array.from(this.prompts.values());
  }

  public getPrompt(name: string, args: Record<string, string> = {}): { name: string; rendered: string } {
    const prompt = this.prompts.get(name);
    if (!prompt) {
      throw new Error(`MCP Prompt '${name}' not found in registry`);
    }

    return {
      name,
      rendered: `[OmniForge Prompt: ${prompt.name}]\nTarget: ${args.target || 'N/A'}\nContext: ${args.context || 'None'}`,
    };
  }
}
