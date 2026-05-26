import express from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
export async function startHttpTransport(server) {
    const app = express();
    app.use(express.json());
    app.get("/health", (_req, res) => {
        res.json({
            status: "ok",
            service: "monnify-mcp",
            environment: env().MONNIFY_ENV,
            timestamp: new Date().toISOString(),
        });
    });
    // Stateless mode — omit sessionIdGenerator to disable session management
    const transport = new StreamableHTTPServerTransport();
    // Cast required due to exactOptionalPropertyTypes interaction with SDK's Transport interface
    await server.connect(transport);
    app.post("/mcp", async (req, res) => {
        await transport.handleRequest(req, res, req.body);
    });
    app.get("/mcp", async (req, res) => {
        await transport.handleRequest(req, res);
    });
    app.delete("/mcp", async (req, res) => {
        await transport.handleRequest(req, res);
    });
    const port = env().PORT;
    app.listen(port, () => {
        logger.info("Monnify MCP server started", { transport: "http", port });
    });
}
//# sourceMappingURL=http.js.map