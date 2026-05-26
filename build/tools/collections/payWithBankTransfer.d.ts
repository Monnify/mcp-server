import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { McpToolResult } from "../../types/mcp.js";
import { PayWithBankTransferInputSchema } from "../../schemas/extended/collections.js";
declare const definition: Tool;
declare function handler(args: unknown): Promise<McpToolResult>;
export { definition, PayWithBankTransferInputSchema as inputSchema, handler };
//# sourceMappingURL=payWithBankTransfer.d.ts.map