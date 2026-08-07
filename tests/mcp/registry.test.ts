import { describe, it, expect } from 'vitest';
import { ToolRegistry } from '../../mcp/src/handlers/tools.js';
import { PromptRegistry } from '../../mcp/src/handlers/prompts.js';
import { ResourceRegistry } from '../../mcp/src/handlers/resources.js';

describe('MCP Handler Registries', () => {
  it('ToolRegistry should register 14 skill tools and 10 workflow tools', () => {
    const registry = new ToolRegistry();
    const tools = registry.listTools();
    expect(tools.length).toBeGreaterThanOrEqual(26);

    const tddTool = tools.find((t) => t.name === 'omniforge_skill_test_driven_development');
    expect(tddTool).toBeDefined();

    const workflowTool = tools.find((t) => t.name === 'omniforge_workflow_engineering_workflow');
    expect(workflowTool).toBeDefined();
  });

  it('PromptRegistry should register 10 prompt library templates', () => {
    const registry = new PromptRegistry();
    const prompts = registry.listPrompts();
    expect(prompts.length).toBe(10);

    const rendered = registry.getPrompt('architecture-review', { target: 'AuthService' });
    expect(rendered.rendered).toContain('AuthService');
  });

  it('ResourceRegistry should expose omniforge:// URIs', () => {
    const registry = new ResourceRegistry();
    const resources = registry.listResources();
    expect(resources.length).toBeGreaterThanOrEqual(6);

    const docRes = registry.readResource('omniforge://docs/architecture');
    expect(docRes.text).toContain('Architecture Guide');
  });
});
