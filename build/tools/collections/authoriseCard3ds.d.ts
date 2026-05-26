import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { McpToolResult } from "../../types/mcp.js";
import { AuthoriseCard3dsInputSchema } from "../../schemas/extended/collections.js";
declare const definition: Tool;
declare function handler(args: unknown): Promise<McpToolResult>;
export { definition, AuthoriseCard3dsInputSchema as inputSchema, handler };
//# sourceMappingURL=authoriseCard3ds.d.ts.map