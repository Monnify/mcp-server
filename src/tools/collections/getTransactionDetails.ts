import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { McpToolResult } from "../../types/mcp.js";
import { apiGet } from "../../client/monnifyClient.js";
import { sanitiseTransactionStatusResponse } from "../../security/sanitiser.js";
import { registerTool } from "../registry.js";
import { MonnifyApiError } from "../../utils/errors.js";
import { errorResult } from "../../types/mcp.js";

const InputSchema = z.object({
  transactionReference: z
    .string()
    .min(1)
    .describe(
      "Monnify-generated transaction reference (e.g. 'MNFY|67|20220725111957|000283'). Returned as transactionReference from monnify_initiate_payment or monnify_get_all_transactions."
    ),
});

const definition: Tool = {
  name: "monnify_get_transaction_details",
  description: `Retrieves the full status and details of a transaction directly by its Monnify transaction reference.

WHEN TO USE: When you have the Monnify transactionReference and need to confirm the payment outcome. Use monnify_get_transaction_status if you only have your own paymentReference.

PREREQUISITES: A valid Monnify transactionReference from a prior transaction.

SIDE EFFECTS: None. Read-only operation.

MFA NOTE: Not applicable.

KEY OUTPUT FIELDS: transactionReference, paymentReference, amountPaid, totalPayable, settledAmount, paidOn, paymentStatus (PAID | PENDING | CANCELLED | FAILED), currencyCode, paymentMethod.`,
  inputSchema: zodToJsonSchema(InputSchema) as Tool["inputSchema"],
};

async function handler(args: unknown): Promise<McpToolResult> {
  try {
    const parsed = InputSchema.parse(args);
    const result = await apiGet<Record<string, unknown>>(
      `/api/v2/transactions/${encodeURIComponent(parsed.transactionReference)}`
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
    return errorResult(`monnify_get_transaction_details failed: ${String(error)}`);
  }
}

registerTool({ definition, handler });

export { definition, InputSchema as inputSchema, handler };
