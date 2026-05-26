import { McpToolError } from "../utils/errors.js";
const registry = new Map();
export function registerTool(entry) {
    registry.set(entry.definition.name, entry);
}
export function getAllToolDefinitions() {
    return [...registry.values()].map((e) => e.definition);
}
export async function dispatchTool(name, args) {
    const entry = registry.get(name);
    if (!entry)
        throw new McpToolError(name, new Error(`Unknown tool: ${name}`));
    return entry.handler(args);
}
//# sourceMappingURL=registry.js.map