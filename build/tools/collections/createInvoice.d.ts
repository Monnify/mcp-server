import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { McpToolResult } from "../../types/mcp.js";
import { CreateInvoiceInputSchema } from "../../schemas/extended/collections.js";
declare const definition: Tool;
declare function handler(args: unknown): Promise<McpToolResult>;
export { definition, CreateInvoiceInputSchema as inputSchema, handler };
//# sourceMappingURL=createInvoice.d.ts.map