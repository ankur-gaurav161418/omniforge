export type ErrorCode =
  | 'CONFIG_ERROR'
  | 'PLUGIN_ERROR'
  | 'MCP_ERROR'
  | 'SKILL_ERROR'
  | 'WORKFLOW_ERROR'
  | 'CLI_ERROR'
  | 'UNKNOWN_ERROR';

export class OmniForgeError extends Error {
  public readonly code: ErrorCode;
  public readonly details?: Record<string, unknown>;

  constructor(message: string, code: ErrorCode = 'UNKNOWN_ERROR', details?: Record<string, unknown>) {
    super(message);
    this.name = 'OmniForgeError';
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ConfigError extends OmniForgeError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'CONFIG_ERROR', details);
    this.name = 'ConfigError';
  }
}

export class PluginError extends OmniForgeError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'PLUGIN_ERROR', details);
    this.name = 'PluginError';
  }
}

export class MCPError extends OmniForgeError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'MCP_ERROR', details);
    this.name = 'MCPError';
  }
}

export class SkillError extends OmniForgeError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'SKILL_ERROR', details);
    this.name = 'SkillError';
  }
}

export class WorkflowError extends OmniForgeError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'WORKFLOW_ERROR', details);
    this.name = 'WorkflowError';
  }
}
