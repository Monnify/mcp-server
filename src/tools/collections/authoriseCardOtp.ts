import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { McpToolResult } from "../../types/mcp.js";
import { apiPost } from "../../client/monnifyClient.js";
import { sanitiseAuthoriseCardOtpResponse } from "../../security/sanitiser.js";
import { registerTool } from "../registry.js";
import { MonnifyApiError } from "../../utils/errors.js";
import { errorResult } from "../../types/mcp.js";
import { AuthoriseCardOtpInputSchema } from "../../schemas/extended/collections.js";

const definition: Tool = {
  name: "monnify_authorise_card_otp",
  description: `Completes a card transaction that is awaiting OTP (one-time password) authorisation.

WHEN TO USE: Only when monnify_charge_card returns status OTP_TRANSACTION_INITIATED. Collect the OTP the customer receives via SMS from their bank and pass it here to finalise the payment.

PREREQUISITES: monnify_charge_card must have been called and returned status OTP_TRANSACTION_INITIATED. The customer must have received and provided their bank OTP.

SIDE EFFECTS: Submits the OTP to the card network for verification. A SUCCESS status means the payment is complete. A FAILED status means the OTP was incorrect or expired — the customer must retry the charge.

MFA NOTE: The OTP is issued by the customer's bank, not Monnify. It is typically 6 digits and valid for a short window (1–5 minutes). Never store or log OTP values.

KEY OUTPUT FIELDS: status (SUCCESS or FAILED), transactionReference, paymentReference, authorizedAmount, message.`,
  inputSchema: zodToJsonSchema(AuthoriseCardOtpInputSchema) as Tool["inputSchema"],
};

async function handler(args: unknown): Promise<McpToolResult> {
  try {
    const parsed = AuthoriseCardOtpInputSchema.parse(args);
    const result = await apiPost<Record<string, unknown>>(
      "/api/v1/merchant/cards/otp/authorize",
      parsed
    );
    const sanitised = sanitiseAuthoriseCardOtpResponse(result);
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
    return errorResult(`monnify_authorise_card_otp failed: ${String(error)}`);
  }
}

registerTool({ definition, handler });

export { definition, AuthoriseCardOtpInputSchema as inputSchema, handler };
