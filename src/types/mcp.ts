export interface McpTextContent {
  type: "text";
  text: string;
}

export interface McpToolResult {
  content: McpTextContent[];
  isError?: boolean;
}

export function successResult(text: string): McpToolResult {
  return { content: [{ type: "text", text }] };
}

export function errorResult(text: string): McpToolResult {
  return { content: [{ type: "text", text }], isError: true };
}
