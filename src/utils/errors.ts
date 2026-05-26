import { z } from "zod";
import type { McpTextContent } from "../types/mcp.js";

export class MonnifyApiError extends Error {
  constructor(
    public readonly responseCode: string,
    public readonly responseMessage: string,
    public readonly httpStatus: number,
    public readonly requestReference?: string
  ) {
    super(responseMessage);
    this.name = "MonnifyApiError";
  }

  toMcpContent(): McpTextContent {
    return {
      type: "text",
      text: `Monnify API Error [${this.responseCode}]: ${this.responseMessage}${
        this.requestReference ? ` (ref: ${this.requestReference})` : ""
      }`,
    };
  }
}

export class ValidationError extends Error {
  constructor(public readonly zodError: z.ZodError) {
    super("Input validation failed");
    this.name = "ValidationError";
  }

  toMcpContent(): McpTextContent {
    const issues = this.zodError.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    return { type: "text", text: `Validation failed:\n${issues}` };
  }
}

export class McpToolError extends Error {
  constructor(
    public readonly toolName: string,
    public readonly cause: unknown
  ) {
    super(`Tool ${toolName} failed`);
    this.name = "McpToolError";
  }
}
