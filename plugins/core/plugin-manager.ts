export interface OmniForgePlugin {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  onLoad?: () => Promise<void> | void;
  onExecute?: (context: Record<string, any>) => Promise<Record<string, any>> | Record<string, any>;
  onUnload?: () => Promise<void> | void;
}

export class PluginManager {
  private plugins: Map<string, OmniForgePlugin> = new Map();

  public async registerPlugin(plugin: OmniForgePlugin): Promise<void> {
    if (!plugin.id || !plugin.name) {
      throw new Error('Plugin must have a valid id and name');
    }
    this.plugins.set(plugin.id, plugin);
    if (plugin.onLoad) {
      await plugin.onLoad();
    }
  }

  public getPlugin(id: string): OmniForgePlugin | undefined {
    return this.plugins.get(id);
  }

  public listPlugins(): OmniForgePlugin[] {
    return Array.from(this.plugins.values());
  }

  public async executePlugin(id: string, context: Record<string, any> = {}): Promise<Record<string, any>> {
    const plugin = this.getPlugin(id);
    if (!plugin) {
      throw new Error(`Plugin '${id}' is not registered`);
    }
    if (plugin.onExecute) {
      return await plugin.onExecute(context);
    }
    return { status: 'success', plugin: id, context };
  }

  public async unloadPlugin(id: string): Promise<void> {
    const plugin = this.getPlugin(id);
    if (plugin && plugin.onUnload) {
      await plugin.onUnload();
    }
    this.plugins.delete(id);
  }
}
