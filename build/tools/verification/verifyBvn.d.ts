import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { McpToolResult } from "../../types/mcp.js";
import { VerifyBvnInputSchema } from "../../schemas/extended/verification.js";
declare const definition: Tool;
declare function handler(args: unknown): Promise<McpToolResult>;
export { definition, VerifyBvnInputSchema as inputSchema, handler };
//# sourceMappingURL=verifyBvn.d.ts.map