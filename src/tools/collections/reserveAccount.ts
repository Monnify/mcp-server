import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { McpToolResult } from "../../types/mcp.js";
import { apiPost } from "../../client/monnifyClient.js";
import { sanitiseReserveAccountResponse } from "../../security/sanitiser.js";
import { registerTool } from "../registry.js";
import { MonnifyApiError } from "../../utils/errors.js";
import { errorResult } from "../../types/mcp.js";
import { ReserveAccountInputSchema } from "../../schemas/extended/collections.js";

const definition: Tool = {
  name: "monnify_reserve_account",
  description: `Reserves a dedicated virtual bank account for a customer to pay into at any time.

WHEN TO USE: For persistent payment collection — wallets, top-up accounts, or business collection accounts. Unlike one-time checkouts, reserved accounts allow customers to pay anytime by bank transfer.

PREREQUISITES: Reserved Accounts feature must be enabled on your Monnify account. Contact Monnify support if unavailable.

SIDE EFFECTS: Creates a persistent reserved account on Monnify's banking partners. The account persists until explicitly deleted. Using the same accountReference is safe (idempotent).

MFA NOTE: Not applicable.

KEY OUTPUT FIELDS: accountReference, accountName, accounts (array of virtual account numbers per bank), reservationReference, status, createdOn.`,
  inputSchema: zodToJsonSchema(ReserveAccountInputSchema) as Tool["inputSchema"],
};

async function handler(args: unknown): Promise<McpToolResult> {
  try {
    const parsed = ReserveAccountInputSchema.parse(args);
    const result = await apiPost<Record<string, unknown>>(
      "/api/v2/bank-transfer/reserved-accounts",
      parsed
    );
    const sanitised = sanitiseReserveAccountResponse(result);
    return {
      content: [{ type: "text", text: JSON.stringify(sanitised, null, 2) }],
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        content: [
          {
            type: "text",
            text: `Validation failed:\n${error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n")}`,
          },
        ],
        isError: true,
      };
    }
    if (error instanceof MonnifyApiError) {
      return { content: [error.toMcpContent()], isError: true };
    }
    return errorResult(`monnify_reserve_account failed: ${String(error)}`);
  }
}

registerTool({ definition, handler });

export { definition, ReserveAccountInputSchema as inputSchema, handler };
