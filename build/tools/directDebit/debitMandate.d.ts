import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { McpToolResult } from "../../types/mcp.js";
import { DebitMandateInputSchema } from "../../schemas/extended/directDebit.js";
declare const definition: Tool;
declare function handler(args: unknown): Promise<McpToolResult>;
export { definition, DebitMandateInputSchema as inputSchema, handler };
//# sourceMappingURL=debitMandate.d.ts.map