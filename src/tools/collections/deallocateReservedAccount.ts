import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { McpToolResult } from "../../types/mcp.js";
import { apiDelete } from "../../client/monnifyClient.js";
import { sanitiseDeallocateAccountResponse } from "../../security/sanitiser.js";
import { registerTool } from "../registry.js";
import { MonnifyApiError } from "../../utils/errors.js";
import { errorResult } from "../../types/mcp.js";
import { formatDeallocateAccount } from "../../utils/format.js";
import { getResponseFormat } from "../../utils/clientContext.js";

const InputSchema = z.object({
  accountReference: z
    .string()
    .min(1)
    .describe("The unique reference of the reserved account to permanently remove."),
});

const definition: Tool = {
  name: "monnify_deallocate_reserved_account",
  description: `Permanently deletes a reserved account. The virtual account numbers will no longer accept payments.

WHEN TO USE: When a customer closes their account, a wallet is terminated, or a reserved account is no longer needed. This action is irreversible.

PREREQUISITES: The reserved account must exist and be in an active state.

SIDE EFFECTS: DESTRUCTIVE — permanently removes the reserved account. Any payments sent to the virtual account numbers after deallocation will be rejected or returned. Cannot be undone.

MFA NOTE: Not applicable.

KEY OUTPUT FIELDS: accountReference, accountName, status (confirms deallocation).`,
  inputSchema: zodToJsonSchema(InputSchema) as Tool["inputSchema"],
};

async function handler(args: unknown): Promise<McpToolResult> {
  try {
    const parsed = InputSchema.parse(args);
    const result = await apiDelete<Record<string, unknown>>(
      `/api/v1/bank-transfer/reserved-accounts/reference/${encodeURIComponent(parsed.accountReference)}`
    );
    const sanitised = sanitiseDeallocateAccountResponse(result);
    return {
      content: [{ type: "text", text: getResponseFormat() === "json" ? JSON.stringify(sanitised, null, 2) : formatDeallocateAccount(sanitised as Record<string, unknown>) }],
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
    return errorResult(`monnify_deallocate_reserved_account failed: ${String(error)}`);
  }
}

registerTool({ definition, handler });

export { definition, InputSchema as inputSchema, handler };
