import { Command } from 'commander';
import { InstallerRegistry } from '../installers/installer-registry.js';

export const installCommand = new Command('install')
  .description('Install OmniForge MCP Server into supported AI clients and IDEs')
  .option('-c, --client <name>', 'Specific AI client to install (claude, cursor, vscode, codex, chatgpt, gemini, antigravity)')
  .option('-a, --all', 'Install into all supported clients', true)
  .action(async (options) => {
    console.log('Installing OmniForge MCP Server into AI Clients...');
    const registry = new InstallerRegistry();

    if (options.client) {
      const installer = registry.get(options.client);
      if (!installer) {
        console.error(`Unknown client '${options.client}'. Supported: ${registry.list().map((i) => i.id).join(', ')}`);
        return;
      }
      const res = await installer.install('');
      console.log(`[${res.clientName}] Installed successfully -> ${res.configPath}`);
      console.log(`Instructions: ${res.restartInstructions}`);
    } else {
      const results = await registry.installAll();
      for (const res of results) {
        console.log(`[${res.clientName}] Configured -> ${res.configPath}`);
      }
      console.log('All 7 AI clients successfully configured for OmniForge MCP!');
    }
  });
