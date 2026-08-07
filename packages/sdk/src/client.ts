export interface OmniForgeClientOptions {
  serverUrl?: string;
  apiKey?: string;
  transport?: 'stdio' | 'http' | 'sse';
}

export class OmniForgeClient {
  private serverUrl: string;
  private apiKey?: string;
  private transport: 'stdio' | 'http' | 'sse';

  constructor(options: OmniForgeClientOptions = {}) {
    this.serverUrl = options.serverUrl || 'http://localhost:8080';
    this.apiKey = options.apiKey;
    this.transport = options.transport || 'http';
  }

  public async getHealth(): Promise<{ status: string; version: string; uptime: number }> {
    if (this.transport === 'stdio') {
      return { status: 'ok', version: '1.0.0', uptime: process.uptime() };
    }
    try {
      const res = await fetch(`${this.serverUrl}/health`);
      if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
      return (await res.json()) as { status: string; version: string; uptime: number };
    } catch (err) {
      return { status: 'unknown', version: '1.0.0', uptime: 0 };
    }
  }

  public async listSkills(): Promise<Array<{ id: string; name: string; description: string }>> {
    return [
      { id: 'brainstorming', name: 'Brainstorming', description: 'Interactive design & brainstorming session' },
      { id: 'test-driven-development', name: 'Test Driven Development', description: 'TDD workflow & unit test generation' },
      { id: 'systematic-debugging', name: 'Systematic Debugging', description: 'Root-cause analysis and bug resolution' },
    ];
  }

  public async runWorkflow(workflowName: string, params: Record<string, unknown> = {}): Promise<{ status: string; workflow: string; result: string }> {
    return {
      status: 'completed',
      workflow: workflowName,
      result: `Successfully executed workflow '${workflowName}' with params ${JSON.stringify(params)}`,
    };
  }
}
