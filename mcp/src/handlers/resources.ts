export interface MCPResourceDefinition {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}

export class ResourceRegistry {
  private resources: Map<string, MCPResourceDefinition> = new Map();

  constructor() {
    this.registerDefaultResources();
  }

  private registerDefaultResources(): void {
    const resourceList = [
      { uri: 'omniforge://docs/architecture', name: 'Architecture Guide', description: 'OmniForge Hexagonal Architecture Documentation', mimeType: 'text/markdown' },
      { uri: 'omniforge://docs/cli', name: 'CLI Guide', description: 'OmniForge CLI Subcommand Reference', mimeType: 'text/markdown' },
      { uri: 'omniforge://docs/mcp', name: 'MCP Protocol Guide', description: 'OmniForge Model Context Protocol Integration Guide', mimeType: 'text/markdown' },
      { uri: 'omniforge://skills/catalog', name: 'Skills Catalog', description: 'Complete index of 14 agent skills', mimeType: 'application/json' },
      { uri: 'omniforge://workflows/catalog', name: 'Workflows Catalog', description: 'Complete index of 10 engineering workflows', mimeType: 'application/json' },
      { uri: 'omniforge://config', name: 'Workspace Configuration', description: 'OmniForge active workspace configuration file', mimeType: 'application/json' },
    ];

    for (const r of resourceList) {
      this.resources.set(r.uri, r);
    }
  }

  public listResources(): MCPResourceDefinition[] {
    return Array.from(this.resources.values());
  }

  public readResource(uri: string): { uri: string; mimeType: string; text: string } {
    const res = this.resources.get(uri);
    if (!res) {
      throw new Error(`MCP Resource '${uri}' not found in registry`);
    }

    return {
      uri,
      mimeType: res.mimeType,
      text: `# ${res.name}\n\n${res.description}\n\nURI: ${res.uri}\nServer: OmniForge MCP Server v1.2.0`,
    };
  }
}
