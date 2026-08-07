import { IncomingMessage } from 'http';

export interface AuthContext {
  authenticated: boolean;
  user?: string;
  token?: string;
}

export class AuthMiddleware {
  private secretToken?: string;

  constructor(secretToken?: string) {
    this.secretToken = secretToken || process.env.OMNIFORGE_API_KEY;
  }

  public authenticateRequest(req: IncomingMessage): AuthContext {
    // If no secret token is configured, allow requests (auth disabled)
    if (!this.secretToken) {
      return { authenticated: true, user: 'anonymous' };
    }

    const authHeader = req.headers['authorization'];
    const apiKeyHeader = req.headers['x-api-key'];

    if (apiKeyHeader === this.secretToken) {
      return { authenticated: true, user: 'api-key-client', token: apiKeyHeader as string };
    }

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      if (token === this.secretToken) {
        return { authenticated: true, user: 'bearer-client', token };
      }
    }

    return { authenticated: false };
  }
}
