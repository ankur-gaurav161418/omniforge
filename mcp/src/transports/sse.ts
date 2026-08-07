import { IncomingMessage, ServerResponse } from 'http';

export class SSETransport {
  private clients: Set<ServerResponse> = new Set();

  public handleConnection(req: IncomingMessage, res: ServerResponse): void {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });

    this.clients.add(res);

    // Initial connection event
    res.write(`event: endpoint\ndata: ${JSON.stringify({ uri: '/rpc', protocol: '2024-11-05' })}\n\n`);

    req.on('close', () => {
      this.clients.delete(res);
    });
  }

  public broadcast(event: string, data: unknown): void {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const client of this.clients) {
      client.write(payload);
    }
  }

  public getClientCount(): number {
    return this.clients.size;
  }
}
