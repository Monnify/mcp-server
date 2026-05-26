import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { McpToolResult } from "../../types/mcp.js";
import { VerifyPhoneNumberInputSchema } from "../../schemas/extended/verification.js";
declare const definition: Tool;
declare function handler(args: unknown): Promise<McpToolResult>;
export { definition, VerifyPhoneNumberInputSchema as inputSchema, handler };
//# sourceMappingURL=verifyPhoneNumber.d.ts.map