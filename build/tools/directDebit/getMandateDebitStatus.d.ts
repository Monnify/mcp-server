import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { McpToolResult } from "../../types/mcp.js";
import { GetMandateDebitStatusInputSchema } from "../../schemas/extended/directDebit.js";
declare const definition: Tool;
declare function handler(args: unknown): Promise<McpToolResult>;
export { definition, GetMandateDebitStatusInputSchema as inputSchema, handler };
//# sourceMappingURL=getMandateDebitStatus.d.ts.map