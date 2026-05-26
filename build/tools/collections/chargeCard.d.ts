import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { McpToolResult } from "../../types/mcp.js";
import { ChargeCardInputSchema } from "../../schemas/extended/collections.js";
declare const definition: Tool;
declare function handler(args: unknown): Promise<McpToolResult>;
export { definition, ChargeCardInputSchema as inputSchema, handler };
//# sourceMappingURL=chargeCard.d.ts.map