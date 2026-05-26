import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { McpToolResult } from "../types/mcp.js";
interface ToolEntry {
    definition: Tool;
    handler: (args: unknown) => Promise<McpToolResult>;
}
export declare function registerTool(entry: ToolEntry): void;
export declare function getAllToolDefinitions(): Tool[];
export declare function dispatchTool(name: string, args: unknown): Promise<McpToolResult>;
export {};
//# sourceMappingURL=registry.d.ts.map