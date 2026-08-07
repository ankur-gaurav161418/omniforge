import { describe, it, expect } from 'vitest';
import { PluginManager } from '../../plugins/core/plugin-manager.js';
import { GitEnhancerPlugin } from '../../plugins/library/git-enhancer.js';
import { SecurityAuditorPlugin } from '../../plugins/library/security-auditor.js';

describe('Plugin Ecosystem & Lifecycle Suite', () => {
  it('should register and list plugins', async () => {
    const manager = new PluginManager();
    await manager.registerPlugin(GitEnhancerPlugin);
    await manager.registerPlugin(SecurityAuditorPlugin);

    const plugins = manager.listPlugins();
    expect(plugins.length).toBe(2);
    expect(plugins.map((p) => p.id)).toContain('git-enhancer');
    expect(plugins.map((p) => p.id)).toContain('security-auditor');
  });

  it('should execute plugin hooks correctly', async () => {
    const manager = new PluginManager();
    await manager.registerPlugin(GitEnhancerPlugin);

    const res = await manager.executePlugin('git-enhancer', { worktreeName: 'sprint-7-test' });
    expect(res.status).toBe('success');
    expect(res.worktree).toBe('sprint-7-test');
  });

  it('should unload plugin cleanly', async () => {
    const manager = new PluginManager();
    await manager.registerPlugin(GitEnhancerPlugin);
    await manager.unloadPlugin('git-enhancer');
    expect(manager.getPlugin('git-enhancer')).toBeUndefined();
  });
});
