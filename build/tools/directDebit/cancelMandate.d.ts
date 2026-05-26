import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { McpToolResult } from "../../types/mcp.js";
import { CancelMandateInputSchema } from "../../schemas/extended/directDebit.js";
declare const definition: Tool;
declare function handler(args: unknown): Promise<McpToolResult>;
export { definition, CancelMandateInputSchema as inputSchema, handler };
//# sourceMappingURL=cancelMandate.d.ts.map