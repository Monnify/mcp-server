import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { McpToolResult } from "../../types/mcp.js";
import { ProcessRefundInputSchema } from "../../schemas/extended/collections.js";
declare const definition: Tool;
declare function handler(args: unknown): Promise<McpToolResult>;
export { definition, ProcessRefundInputSchema as inputSchema, handler };
//# sourceMappingURL=processRefund.d.ts.map