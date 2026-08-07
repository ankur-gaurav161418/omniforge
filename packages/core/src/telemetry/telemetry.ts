export interface TelemetryEvent {
  event: string;
  timestamp: string;
  properties?: Record<string, unknown>;
}

export class TelemetryService {
  private enabled: boolean = false;
  private anonymousId: string = '';
  private eventsQueue: TelemetryEvent[] = [];

  constructor(enabled: boolean = false, anonymousId: string = '') {
    this.enabled = enabled;
    this.anonymousId = anonymousId || 'anon-' + Math.random().toString(36).substring(2, 9);
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public track(event: string, properties?: Record<string, unknown>): void {
    if (!this.enabled) return;

    const telemetryEvent: TelemetryEvent = {
      event,
      timestamp: new Date().toISOString(),
      properties: {
        ...properties,
        anonymousId: this.anonymousId,
        framework: 'OmniForge',
      },
    };
    this.eventsQueue.push(telemetryEvent);
  }

  public getQueuedEvents(): TelemetryEvent[] {
    return [...this.eventsQueue];
  }

  public clearQueue(): void {
    this.eventsQueue = [];
  }
}
