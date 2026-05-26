import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { McpToolResult } from "../../types/mcp.js";
import { AuthoriseCardOtpInputSchema } from "../../schemas/extended/collections.js";
declare const definition: Tool;
declare function handler(args: unknown): Promise<McpToolResult>;
export { definition, AuthoriseCardOtpInputSchema as inputSchema, handler };
//# sourceMappingURL=authoriseCardOtp.d.ts.map