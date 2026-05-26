export function successResult(text) {
    return { content: [{ type: "text", text }] };
}
export function errorResult(text) {
    return { content: [{ type: "text", text }], isError: true };
}
//# sourceMappingURL=mcp.js.map