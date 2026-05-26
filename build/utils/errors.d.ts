import { z } from "zod";
import type { McpTextContent } from "../types/mcp.js";
export declare class MonnifyApiError extends Error {
    readonly responseCode: string;
    readonly responseMessage: string;
    readonly httpStatus: number;
    readonly requestReference?: string | undefined;
    constructor(responseCode: string, responseMessage: string, httpStatus: number, requestReference?: string | undefined);
    toMcpContent(): McpTextContent;
}
export declare class ValidationError extends Error {
    readonly zodError: z.ZodError;
    constructor(zodError: z.ZodError);
    toMcpContent(): McpTextContent;
}
export declare class McpToolError extends Error {
    readonly toolName: string;
    readonly cause: unknown;
    constructor(toolName: string, cause: unknown);
}
//# sourceMappingURL=errors.d.ts.map