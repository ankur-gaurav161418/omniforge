export interface InstallResult {
  clientId: string;
  clientName: string;
  installed: boolean;
  configPath: string;
  restartInstructions: string;
  error?: string;
}

export abstract class BaseClientInstaller {
  public abstract readonly id: string;
  public abstract readonly name: string;

  public abstract detect(): Promise<boolean> | boolean;
  public abstract generateConfig(mcpServerPath: string): object;
  public abstract getConfigPath(): string;
  public abstract getRestartInstructions(): string;

  public async install(mcpServerPath: string): Promise<InstallResult> {
    try {
      const configPath = this.getConfigPath();
      return {
        clientId: this.id,
        clientName: this.name,
        installed: true,
        configPath,
        restartInstructions: this.getRestartInstructions(),
      };
    } catch (e: any) {
      return {
        clientId: this.id,
        clientName: this.name,
        installed: false,
        configPath: '',
        restartInstructions: '',
        error: e.message,
      };
    }
  }
}
