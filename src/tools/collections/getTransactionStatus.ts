import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { McpToolResult } from "../../types/mcp.js";
import { apiGet } from "../../client/monnifyClient.js";
import { sanitiseTransactionStatusResponse } from "../../security/sanitiser.js";
import { registerTool } from "../registry.js";
import { MonnifyApiError } from "../../utils/errors.js";
import { errorResult } from "../../types/mcp.js";
import { GetTransactionStatusInputSchema } from "../../schemas/extended/collections.js";

const definition: Tool = {
  name: "monnify_get_transaction_status",
  description: `Queries the status of a payment transaction.

WHEN TO USE: After initiating a payment to check if it has been completed (paymentStatus = PAID), or when a customer reports a payment issue. Poll this endpoint after the customer's redirect back from checkout.

PREREQUISITES: A transaction must exist — call monnify_initiate_payment first, or have a known paymentReference.

SIDE EFFECTS: None. Read-only operation.

MFA NOTE: Not applicable.

KEY OUTPUT FIELDS: transactionReference, paymentReference, amountPaid, totalPayable, paymentStatus (PAID | PENDING | CANCELLED | FAILED), paidOn, currencyCode, paymentMethod.`,
  inputSchema: zodToJsonSchema(GetTransactionStatusInputSchema) as Tool["inputSchema"],
};

async function handler(args: unknown): Promise<McpToolResult> {
  try {
    const parsed = GetTransactionStatusInputSchema.parse(args);
    const result = await apiGet<Record<string, unknown>>(
      "/api/v2/merchant/transactions/query",
      {
        paymentReference: parsed.paymentReference,
        transactionReference: parsed.transactionReference,
      }
    );
    const sanitised = sanitiseTransactionStatusResponse(result);
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
    return errorResult(`monnify_get_transaction_status failed: ${String(error)}`);
  }
}

registerTool({ definition, handler });

export { definition, GetTransactionStatusInputSchema as inputSchema, handler };
