import { Command } from 'commander';
import { printBanner } from '../banner.js';
import { ConfigManager, Logger } from '@omniforge/core';

export function registerInitCommand(program: Command): void {
  program
    .command('init')
    .description('Initialize OmniForge project configuration in the current workspace')
    .action(() => {
      printBanner();
      const logger = new Logger('OmniForge-CLI');
      const configManager = new ConfigManager();
      const config = configManager.saveConfig({});
      logger.info(`Initialized OmniForge workspace at ${process.cwd()}`);
      console.log(`[OmniForge] Created .omniforge/config.json with default options.`);
    });
}
