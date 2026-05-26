export interface McpTextContent {
    type: "text";
    text: string;
}
export interface McpToolResult {
    content: McpTextContent[];
    isError?: boolean;
}
export declare function successResult(text: string): McpToolResult;
export declare function errorResult(text: string): McpToolResult;
//# sourceMappingURL=mcp.d.ts.map