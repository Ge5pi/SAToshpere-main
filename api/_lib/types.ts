import type { IncomingMessage, ServerResponse } from 'node:http';

// Minimal Vercel-compatible request/response types
// (Vercel injects body/query at runtime — no need for @vercel/node package)
export interface VercelRequest extends IncomingMessage {
  body?: any;
  query: Record<string, string | string[]>;
  cookies: Record<string, string>;
}

export interface VercelResponse extends ServerResponse {
  json(body: any): VercelResponse;
  status(code: number): VercelResponse;
  send(body: any): VercelResponse;
}
