export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
}

export class Logger {
  private level: LogLevel = 'info';
  private prefix: string;

  constructor(prefix: string = 'OmniForge', level: LogLevel = 'info') {
    this.prefix = prefix;
    this.level = level;
  }

  public setLevel(level: LogLevel): void {
    this.level = level;
  }

  private shouldLog(targetLevel: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(targetLevel) >= levels.indexOf(this.level);
  }

  private format(level: LogLevel, message: string, context?: Record<string, unknown>): string {
    const time = new Date().toISOString();
    const ctxStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${time}] [${this.prefix}] [${level.toUpperCase()}]: ${message}${ctxStr}`;
  }

  public debug(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog('debug')) {
      console.debug(this.format('debug', message, context));
    }
  }

  public info(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog('info')) {
      console.info(this.format('info', message, context));
    }
  }

  public warn(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog('warn')) {
      console.warn(this.format('warn', message, context));
    }
  }

  public error(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog('error')) {
      console.error(this.format('error', message, context));
    }
  }
}

export const logger = new Logger('OmniForge');
