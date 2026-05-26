import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { logger } from "../utils/logger.js";
export async function startStdioTransport(server) {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    logger.info("Monnify MCP server started", { transport: "stdio" });
}
//# sourceMappingURL=stdio.js.map