import * as fs from 'fs';
import * as path from 'path';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  prefix: string;
  message: string;
  context?: Record<string, unknown>;
}

export class Logger {
  private level: LogLevel = 'info';
  private prefix: string;
  private logFilePath?: string;

  constructor(prefix: string = 'OmniForge', level: LogLevel = 'info', enableFileSink: boolean = true) {
    this.prefix = prefix;
    this.level = (process.env.OMNIFORGE_LOG_LEVEL as LogLevel) || level;

    if (enableFileSink) {
      try {
        const logDir = path.join(process.cwd(), '.omniforge', 'logs');
        if (!fs.existsSync(logDir)) {
          fs.mkdirSync(logDir, { recursive: true });
        }
        this.logFilePath = path.join(logDir, 'omniforge.log');
      } catch (err) {
        // Fallback cleanly
      }
    }
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

  private writeToFile(formattedMessage: string): void {
    if (this.logFilePath) {
      try {
        fs.appendFileSync(this.logFilePath, formattedMessage + '\n', 'utf-8');
      } catch (err) {
        // Ignore file append errors
      }
    }
  }

  public debug(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog('debug')) {
      const formatted = this.format('debug', message, context);
      console.debug(formatted);
      this.writeToFile(formatted);
    }
  }

  public info(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog('info')) {
      const formatted = this.format('info', message, context);
      console.info(formatted);
      this.writeToFile(formatted);
    }
  }

  public warn(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog('warn')) {
      const formatted = this.format('warn', message, context);
      console.warn(formatted);
      this.writeToFile(formatted);
    }
  }

  public error(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog('error')) {
      const formatted = this.format('error', message, context);
      console.error(formatted);
      this.writeToFile(formatted);
    }
  }
}

export const logger = new Logger('OmniForge');
