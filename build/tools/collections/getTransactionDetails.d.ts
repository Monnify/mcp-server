import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import type { McpToolResult } from "../../types/mcp.js";
declare const InputSchema: z.ZodObject<{
    transactionReference: z.ZodString;
}, "strip", z.ZodTypeAny, {
    transactionReference: string;
}, {
    transactionReference: string;
}>;
declare const definition: Tool;
declare function handler(args: unknown): Promise<McpToolResult>;
export { definition, InputSchema as inputSchema, handler };
//# sourceMappingURL=getTransactionDetails.d.ts.map