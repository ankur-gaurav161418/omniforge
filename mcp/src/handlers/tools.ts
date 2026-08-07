export interface MCPToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export class ToolRegistry {
  private tools: Map<string, MCPToolDefinition> = new Map();

  constructor() {
    this.registerDefaultTools();
  }

  private registerDefaultTools(): void {
    // Standard Execution Tools
    this.registerTool({
      name: 'omniforge_run_skill',
      description: 'Execute an OmniForge agent skill (e.g., brainstorming, TDD, systematic-debugging)',
      inputSchema: {
        type: 'object',
        properties: {
          skillId: { type: 'string', description: 'ID of the skill to run' },
          context: { type: 'object', description: 'Execution context & parameters' },
        },
        required: ['skillId'],
      },
    });

    this.registerTool({
      name: 'omniforge_run_workflow',
      description: 'Execute an engineering workflow sequence (e.g., engineering-workflow, architecture-workflow)',
      inputSchema: {
        type: 'object',
        properties: {
          workflowId: { type: 'string', description: 'ID of the workflow' },
          options: { type: 'object', description: 'Workflow options' },
        },
        required: ['workflowId'],
      },
    });

    // 14 Individual Skill Tools
    const skillList = [
      { id: 'brainstorming', desc: 'Interactive design & brainstorming session' },
      { id: 'systematic-debugging', desc: 'Root-cause isolation & defect resolution' },
      { id: 'test-driven-development', desc: 'Red-Green-Refactor implementation' },
      { id: 'subagent-driven-development', desc: 'Parallel autonomous subagent execution' },
      { id: 'verification-before-completion', desc: 'Mandatory verification criteria enforcement' },
      { id: 'executing-plans', desc: 'Step-by-step implementation plan execution' },
      { id: 'writing-plans', desc: 'Structured engineering plan drafting' },
      { id: 'writing-skills', desc: 'Custom agent skill creation' },
      { id: 'using-git-worktrees', desc: 'Isolated Git worktrees feature development' },
      { id: 'dispatching-parallel-agents', desc: 'Multi-agent scheduling & dispatch' },
      { id: 'receiving-code-review', desc: 'Objective code review feedback processing' },
      { id: 'requesting-code-review', desc: 'Pull request review preparation' },
      { id: 'finishing-a-development-branch', desc: 'Branch merging & changelog update' },
      { id: 'using-omniforge', desc: 'OmniForge framework operational guide' },
    ];

    for (const s of skillList) {
      this.registerTool({
        name: `omniforge_skill_${s.id.replace(/-/g, '_')}`,
        description: `[Skill Tool] ${s.desc}`,
        inputSchema: {
          type: 'object',
          properties: {
            parameters: { type: 'object', description: 'Optional skill parameters' },
          },
        },
      });
    }

    // 10 Workflow Tools
    const workflowList = [
      { id: 'engineering_workflow', desc: 'Full engineering cycle workflow' },
      { id: 'architecture_workflow', desc: 'System architecture audit workflow' },
      { id: 'prd_workflow', desc: 'Product Requirements Document workflow' },
      { id: 'testing_workflow', desc: 'Automated test suite execution workflow' },
      { id: 'debug_workflow', desc: 'Defect isolation & resolution workflow' },
      { id: 'release_workflow', desc: 'Semantic release automation workflow' },
      { id: 'documentation_workflow', desc: 'Documentation generation workflow' },
      { id: 'planning_workflow', desc: 'Architecture & sprint planning workflow' },
      { id: 'code_review_workflow', desc: 'Pull request code review workflow' },
      { id: 'deployment_workflow', desc: 'Production deployment workflow' },
    ];

    for (const w of workflowList) {
      this.registerTool({
        name: `omniforge_workflow_${w.id}`,
        description: `[Workflow Tool] ${w.desc}`,
        inputSchema: {
          type: 'object',
          properties: {
            environment: { type: 'string', description: 'Target environment (dev/staging/prod)' },
          },
        },
      });
    }
  }

  public registerTool(tool: MCPToolDefinition): void {
    this.tools.set(tool.name, tool);
  }

  public listTools(): MCPToolDefinition[] {
    return Array.from(this.tools.values());
  }

  public executeTool(name: string, args: Record<string, unknown> = {}): { status: string; result: string } {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`MCP Tool '${name}' not found in registry`);
    }

    return {
      status: 'success',
      result: `Successfully executed MCP tool '${name}' with arguments ${JSON.stringify(args)}`,
    };
  }
}
