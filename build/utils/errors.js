export class MonnifyApiError extends Error {
    responseCode;
    responseMessage;
    httpStatus;
    requestReference;
    constructor(responseCode, responseMessage, httpStatus, requestReference) {
        super(responseMessage);
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
        this.httpStatus = httpStatus;
        this.requestReference = requestReference;
        this.name = "MonnifyApiError";
    }
    toMcpContent() {
        return {
            type: "text",
            text: `Monnify API Error [${this.responseCode}]: ${this.responseMessage}${this.requestReference ? ` (ref: ${this.requestReference})` : ""}`,
        };
    }
}
export class ValidationError extends Error {
    zodError;
    constructor(zodError) {
        super("Input validation failed");
        this.zodError = zodError;
        this.name = "ValidationError";
    }
    toMcpContent() {
        const issues = this.zodError.issues
            .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
            .join("\n");
        return { type: "text", text: `Validation failed:\n${issues}` };
    }
}
export class McpToolError extends Error {
    toolName;
    cause;
    constructor(toolName, cause) {
        super(`Tool ${toolName} failed`);
        this.toolName = toolName;
        this.cause = cause;
        this.name = "McpToolError";
    }
}
//# sourceMappingURL=errors.js.map