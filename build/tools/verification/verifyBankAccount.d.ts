import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { McpToolResult } from "../../types/mcp.js";
import { VerifyBankAccountInputSchema } from "../../schemas/extended/verification.js";
declare const definition: Tool;
declare function handler(args: unknown): Promise<McpToolResult>;
export { definition, VerifyBankAccountInputSchema as inputSchema, handler };
//# sourceMappingURL=verifyBankAccount.d.ts.map