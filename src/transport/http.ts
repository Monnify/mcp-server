import express, { type Request, type Response, type NextFunction } from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import type { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

// In-memory rate limiter: 100 requests per minute per IP
const rlMap = new Map<string, { count: number; resetAt: number }>();

function rateLimit(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip ?? "unknown";
  const now = Date.now();
  const entry = rlMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rlMap.set(ip, { count: 1, resetAt: now + 60_000 });
    next();
    return;
  }
  if (entry.count >= 100) {
    res.setHeader("Retry-After", "60");
    res.status(429).json({ error: "Rate limit exceeded. Try again in 60 seconds." });
    return;
  }
  entry.count++;
  next();
}

function bearerAuth(token: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const auth = req.headers["authorization"];
    if (!auth || auth !== `Bearer ${token}`) {
      res
        .status(401)
        .json({ error: "Unauthorized. Provide a valid Authorization: Bearer <token> header." });
      return;
    }
    next();
  };
}

export async function startHttpTransport(server: Server): Promise<void> {
  const app = express();
  app.use(express.json());

  const httpToken = env().MONNIFY_HTTP_TOKEN;
  if (!httpToken) {
    logger.warn(
      "HTTP transport is running WITHOUT authentication. " +
        "Set MONNIFY_HTTP_TOKEN to secure the /mcp endpoint before exposing it beyond localhost."
    );
  }

  // Health check — unauthenticated, no sensitive data
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "monnify-mcp" });
  });

  const transport = new StreamableHTTPServerTransport();
  await server.connect(transport as unknown as Transport);

  const guards: express.RequestHandler[] = [rateLimit];
  if (httpToken) guards.push(bearerAuth(httpToken));

  app.post("/mcp", guards, async (req: Request, res: Response) => {
    await transport.handleRequest(req, res, req.body);
  });
  app.get("/mcp", guards, async (req: Request, res: Response) => {
    await transport.handleRequest(req, res);
  });
  app.delete("/mcp", guards, async (req: Request, res: Response) => {
    await transport.handleRequest(req, res);
  });

  const port = env().PORT;
  app.listen(port, () => {
    logger.info("Monnify MCP server started", {
      transport: "http",
      port,
      auth: httpToken ? "bearer-token" : "none (unauthenticated — set MONNIFY_HTTP_TOKEN)",
    });
  });
}
