import { describe, it, expect } from 'vitest';
import { UpdateManager } from '../../packages/core/src/update/update-manager.js';

describe('Update Manager Suite', () => {
  it('should check for updates and return status', async () => {
    const manager = new UpdateManager('1.6.0');
    const status = await manager.checkForUpdates();
    expect(status.currentVersion).toBe('1.6.0');
    expect(status.updateAvailable).toBe(false);
  });
});
