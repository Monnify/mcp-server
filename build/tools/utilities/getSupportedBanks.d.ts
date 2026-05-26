import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import type { McpToolResult } from "../../types/mcp.js";
declare const InputSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
declare const definition: Tool;
declare function handler(_args: z.infer<typeof InputSchema>): Promise<McpToolResult>;
export { definition, InputSchema as inputSchema, handler };
//# sourceMappingURL=getSupportedBanks.d.ts.map