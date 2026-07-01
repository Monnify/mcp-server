import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { McpToolResult } from "../../types/mcp.js";
import { apiGet } from "../../client/monnifyClient.js";
import { sanitiseReservedAccountTransactionsResponse } from "../../security/sanitiser.js";
import { registerTool } from "../registry.js";
import { MonnifyApiError } from "../../utils/errors.js";
import { errorResult } from "../../types/mcp.js";
import { formatReservedAccountTransactions } from "../../utils/format.js";
import { getResponseFormat } from "../../utils/clientContext.js";

const InputSchema = z.object({
  accountReference: z
    .string()
    .min(1)
    .describe("The unique reference of the reserved account to fetch transactions for."),
  page: z
    .number()
    .int()
    .min(0)
    .default(0)
    .describe("Page number (zero-indexed). Default is 0."),
  size: z
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10)
    .describe("Number of transactions per page. Default is 10, max is 100."),
});

const definition: Tool = {
  name: "monnify_get_reserved_account_transactions",
  description: `Returns a paginated list of all transactions received on a reserved account.

WHEN TO USE: To review payment history for a customer's dedicated virtual account — e.g. checking what has been paid into a wallet, reconciling a subscription account, or investigating a missing payment.

PREREQUISITES: The reserved account must exist. Use monnify_get_reserved_account to confirm it is active.

SIDE EFFECTS: None. Read-only operation.

MFA NOTE: Not applicable.

KEY OUTPUT FIELDS: transactionReference, paymentReference, amountPaid, totalPayable, paymentStatus, paidOn, paymentMethod, currencyCode.`,
  inputSchema: zodToJsonSchema(InputSchema) as Tool["inputSchema"],
};

async function handler(args: unknown): Promise<McpToolResult> {
  try {
    const parsed = InputSchema.parse(args);
    const result = await apiGet<Record<string, unknown>>(
      "/api/v1/bank-transfer/reserved-accounts/transactions",
      {
        accountReference: parsed.accountReference,
        page: parsed.page,
        size: parsed.size,
      }
    );

    const content = Array.isArray(result["content"]) ? result["content"] : [];
    const sanitised = sanitiseReservedAccountTransactionsResponse(
      content as Array<Record<string, unknown>>
    );

    const txMeta = {
      totalElements: result["totalElements"],
      totalPages: result["totalPages"],
      number: result["number"],
      accountReference: parsed.accountReference,
    };
    return {
      content: [
        {
          type: "text",
          text: getResponseFormat() === "json"
            ? JSON.stringify({ content: sanitised, ...txMeta }, null, 2)
            : formatReservedAccountTransactions(sanitised as Array<Record<string, unknown>>, txMeta),
        },
      ],
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
    return errorResult(`monnify_get_reserved_account_transactions failed: ${String(error)}`);
  }
}

registerTool({ definition, handler });

export { definition, InputSchema as inputSchema, handler };
