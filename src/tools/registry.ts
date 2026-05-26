import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { McpToolResult } from "../types/mcp.js";
import { McpToolError } from "../utils/errors.js";

interface ToolEntry {
  definition: Tool;
  handler: (args: unknown) => Promise<McpToolResult>;
}

const registry = new Map<string, ToolEntry>();

export function registerTool(entry: ToolEntry): void {
  registry.set(entry.definition.name, entry);
}

export function getAllToolDefinitions(): Tool[] {
  return [...registry.values()].map((e) => e.definition);
}

export async function dispatchTool(
  name: string,
  args: unknown
): Promise<McpToolResult> {
  const entry = registry.get(name);
  if (!entry) throw new McpToolError(name, new Error(`Unknown tool: ${name}`));
  return entry.handler(args);
}
