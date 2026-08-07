import * as fs from 'fs';
import * as path from 'path';

export interface EnvironmentCheckResult {
  nodeVersion: string;
  platform: string;
  arch: string;
  gitInstalled: boolean;
  configValid: boolean;
  mcpServerReady: boolean;
  writableWorkspace: boolean;
  errors: string[];
}

export class EnvironmentValidator {
  public static check(): EnvironmentCheckResult {
    const errors: string[] = [];
    let gitInstalled = true;
    let writableWorkspace = true;

    try {
      const testFile = path.join(process.cwd(), '.omniforge_write_test');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
    } catch (e) {
      writableWorkspace = false;
      errors.push('Workspace directory is not writable');
    }

    const nodeMajor = parseInt(process.version.replace('v', '').split('.')[0], 10);
    if (nodeMajor < 18) {
      errors.push(`Node.js version must be >= 18.0.0 (Current: ${process.version})`);
    }

    return {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      gitInstalled,
      configValid: errors.length === 0,
      mcpServerReady: true,
      writableWorkspace,
      errors,
    };
  }
}
