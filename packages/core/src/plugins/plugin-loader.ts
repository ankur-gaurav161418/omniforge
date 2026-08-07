export interface OmniForgePlugin {
  name: string;
  version: string;
  description: string;
  init?: (coreContext: Record<string, unknown>) => Promise<void>;
  skills?: string[];
  prompts?: string[];
}

export class PluginLoader {
  private plugins: Map<string, OmniForgePlugin> = new Map();

  public registerPlugin(plugin: OmniForgePlugin): void {
    if (!plugin.name) {
      throw new Error('Plugin name is required');
    }
    this.plugins.set(plugin.name, plugin);
  }

  public getPlugin(name: string): OmniForgePlugin | undefined {
    return this.plugins.get(name);
  }

  public listPlugins(): OmniForgePlugin[] {
    return Array.from(this.plugins.values());
  }

  public async initializeAll(context: Record<string, unknown> = {}): Promise<void> {
    for (const plugin of this.plugins.values()) {
      if (plugin.init) {
        await plugin.init(context);
      }
    }
  }
}
