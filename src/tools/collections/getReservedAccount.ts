import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { McpToolResult } from "../../types/mcp.js";
import { apiGet } from "../../client/monnifyClient.js";
import { sanitiseReservedAccountDetailsResponse } from "../../security/sanitiser.js";
import { registerTool } from "../registry.js";
import { MonnifyApiError } from "../../utils/errors.js";
import { errorResult } from "../../types/mcp.js";
import { formatReservedAccountDetails } from "../../utils/format.js";
import { getResponseFormat } from "../../utils/clientContext.js";

const InputSchema = z.object({
  accountReference: z
    .string()
    .min(1)
    .describe("The unique reference used when the reserved account was created."),
});

const definition: Tool = {
  name: "monnify_get_reserved_account",
  description: `Returns the details of an existing reserved account including its virtual account numbers.

WHEN TO USE: To look up a reserved account by its reference — e.g. to show a customer their dedicated payment account, confirm the account is still active, or retrieve virtual account numbers for display.

PREREQUISITES: The reserved account must have been created with monnify_reserve_account.

SIDE EFFECTS: None. Read-only operation.

MFA NOTE: Not applicable.

KEY OUTPUT FIELDS: accountName, accountReference, status, accounts (virtual account numbers per bank), customerName, customerEmail, createdOn.`,
  inputSchema: zodToJsonSchema(InputSchema) as Tool["inputSchema"],
};

async function handler(args: unknown): Promise<McpToolResult> {
  try {
    const parsed = InputSchema.parse(args);
    const result = await apiGet<Record<string, unknown>>(
      `/api/v2/bank-transfer/reserved-accounts/${encodeURIComponent(parsed.accountReference)}`
    );
    const sanitised = sanitiseReservedAccountDetailsResponse(result);
    return {
      content: [{ type: "text", text: getResponseFormat() === "json" ? JSON.stringify(sanitised, null, 2) : formatReservedAccountDetails(sanitised as Record<string, unknown>) }],
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        content: [{ type: "text", text: `Validation failed:\n${error.issues.map(i => `  - ${i.path.join(".")}: ${i.message}`).join("\n")}` }],
        isError: true,
      };
    }
    if (error instanceof MonnifyApiError) {
      return { content: [error.toMcpContent()], isError: true };
    }
    return errorResult(`monnify_get_reserved_account failed: ${String(error)}`);
  }
}

registerTool({ definition, handler });

export { definition, InputSchema as inputSchema, handler };
