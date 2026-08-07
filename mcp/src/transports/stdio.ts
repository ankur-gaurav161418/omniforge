import { createInterface } from 'readline';

export interface STDIOHandler {
  (request: any): any;
}

export class STDIOTransport {
  private handler: STDIOHandler;

  constructor(handler: STDIOHandler) {
    this.handler = handler;
  }

  public listen(): void {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    rl.on('line', (line) => {
      if (!line.trim()) return;
      try {
        const jsonReq = JSON.parse(line);
        const jsonRes = this.handler(jsonReq);
        process.stdout.write(JSON.stringify(jsonRes) + '\n');
      } catch (err) {
        process.stdout.write(
          JSON.stringify({
            jsonrpc: '2.0',
            id: null,
            error: { code: -32700, message: 'Parse error' },
          }) + '\n'
        );
      }
    });
  }
}
