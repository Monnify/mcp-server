import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { McpToolResult } from "../../types/mcp.js";
import { VerifyNinInputSchema } from "../../schemas/extended/verification.js";
declare const definition: Tool;
declare function handler(args: unknown): Promise<McpToolResult>;
export { definition, VerifyNinInputSchema as inputSchema, handler };
//# sourceMappingURL=verifyNin.d.ts.map