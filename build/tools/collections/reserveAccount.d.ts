import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { McpToolResult } from "../../types/mcp.js";
import { ReserveAccountInputSchema } from "../../schemas/extended/collections.js";
declare const definition: Tool;
declare function handler(args: unknown): Promise<McpToolResult>;
export { definition, ReserveAccountInputSchema as inputSchema, handler };
//# sourceMappingURL=reserveAccount.d.ts.map