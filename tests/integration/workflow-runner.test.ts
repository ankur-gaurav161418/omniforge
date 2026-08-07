import { describe, it, expect } from 'vitest';
import { WorkflowRunner } from '../../workflows/src/workflow-runner.js';
import * as path from 'path';

describe('Integration Tests: WorkflowRunner', () => {
  it('should load all 5+ workflow definitions from workflows directory', () => {
    const runner = new WorkflowRunner(path.join(process.cwd(), 'workflows'));
    const workflows = runner.listWorkflows();
    expect(workflows.length).toBeGreaterThanOrEqual(5);
  });

  it('should run engineering workflow successfully', async () => {
    const runner = new WorkflowRunner(path.join(process.cwd(), 'workflows'));
    const res = await runner.runWorkflow('engineering-workflow', { env: 'staging' });
    expect(res.status).toBe('completed');
    expect(res.executedSteps).toBe(5);
  });
});
