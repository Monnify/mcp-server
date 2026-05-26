import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { McpToolResult } from "../../types/mcp.js";
import { GetTransactionStatusInputSchema } from "../../schemas/extended/collections.js";
declare const definition: Tool;
declare function handler(args: unknown): Promise<McpToolResult>;
export { definition, GetTransactionStatusInputSchema as inputSchema, handler };
//# sourceMappingURL=getTransactionStatus.d.ts.map