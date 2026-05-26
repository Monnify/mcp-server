import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { McpToolResult } from "../../types/mcp.js";
import { InitiatePaymentInputSchema } from "../../schemas/extended/collections.js";
declare const definition: Tool;
declare function handler(args: unknown): Promise<McpToolResult>;
export { definition, InitiatePaymentInputSchema as inputSchema, handler };
//# sourceMappingURL=initiatePayment.d.ts.map