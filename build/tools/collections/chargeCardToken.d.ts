import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { McpToolResult } from "../../types/mcp.js";
import { ChargeCardTokenInputSchema } from "../../schemas/extended/collections.js";
declare const definition: Tool;
declare function handler(args: unknown): Promise<McpToolResult>;
export { definition, ChargeCardTokenInputSchema as inputSchema, handler };
//# sourceMappingURL=chargeCardToken.d.ts.map