import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { McpToolResult } from "../../types/mcp.js";
import { GetMandateStatusInputSchema } from "../../schemas/extended/directDebit.js";
declare const definition: Tool;
declare function handler(args: unknown): Promise<McpToolResult>;
export { definition, GetMandateStatusInputSchema as inputSchema, handler };
//# sourceMappingURL=getMandateStatus.d.ts.map