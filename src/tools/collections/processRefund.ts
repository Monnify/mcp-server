import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { McpToolResult } from "../../types/mcp.js";
import { apiPost } from "../../client/monnifyClient.js";
import { sanitiseRefundResponse } from "../../security/sanitiser.js";
import { registerTool } from "../registry.js";
import { MonnifyApiError } from "../../utils/errors.js";
import { errorResult } from "../../types/mcp.js";
import { formatProcessRefund } from "../../utils/format.js";
import { getResponseFormat } from "../../utils/clientContext.js";
import { ProcessRefundInputSchema } from "../../schemas/extended/collections.js";

const definition: Tool = {
  name: "monnify_process_refund",
  description: `Initiates a refund for a previously completed payment transaction.

WHEN TO USE: To reverse a charge at a customer's request, after an order cancellation, or when a duplicate or suspicious charge is detected. Can be a full or partial refund.

PREREQUISITES: The original transaction must have paymentStatus = PAID AND paymentMethod = ACCOUNT_TRANSFER — check both via monnify_get_transaction_status or monnify_get_transaction_details first. Transactions paid by CARD or USSD cannot be refunded through this API at all; the request will be rejected regardless of amount. Verify the destination account with monnify_verify_bank_account first. The Refund API is also disabled by default — a "not permitted" response means it needs to be enabled on your account by emailing integration-support@monnify.com, not that the request was malformed.

SIDE EFFECTS: Initiates a real fund transfer back to the customer's bank account. This is a financial operation — confirm the transaction reference and refund amount carefully before proceeding. Using the same refundReference is safe (idempotent — will not double-refund).

MFA NOTE: Not applicable.

KEY OUTPUT FIELDS: refundReference, transactionReference, refundStatus (INITIATED | PENDING | REFUNDED | FAILED), refundAmount, refundReason, destinationAccountNumber, createdOn.`,
  inputSchema: zodToJsonSchema(ProcessRefundInputSchema) as Tool["inputSchema"],
};

async function handler(args: unknown): Promise<McpToolResult> {
  try {
    const parsed = ProcessRefundInputSchema.parse(args);
    const result = await apiPost<Record<string, unknown>>(
      "/api/v1/refunds/initiate-refund",
      parsed
    );
    const sanitised = sanitiseRefundResponse(result);
    return {
      content: [{ type: "text", text: getResponseFormat() === "json" ? JSON.stringify(sanitised, null, 2) : formatProcessRefund(sanitised as Record<string, unknown>) }],
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
    return errorResult(`monnify_process_refund failed: ${String(error)}`);
  }
}

registerTool({ definition, handler });

export { definition, ProcessRefundInputSchema as inputSchema, handler };
