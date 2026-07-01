import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { McpToolResult } from "../../types/mcp.js";
import { apiPost } from "../../client/monnifyClient.js";
import { sanitiseChargeCardResponse } from "../../security/sanitiser.js";
import { registerTool } from "../registry.js";
import { MonnifyApiError } from "../../utils/errors.js";
import { errorResult } from "../../types/mcp.js";
import { formatChargeCard } from "../../utils/format.js";
import { getResponseFormat } from "../../utils/clientContext.js";
import { ChargeCardInputSchema } from "../../schemas/extended/collections.js";

const definition: Tool = {
  name: "monnify_charge_card",
  description: `Charges a customer's card against an existing pending transaction using card details collected by the merchant.

WHEN TO USE: After calling monnify_initiate_payment, use this tool to directly charge a card when you have collected card details on your own payment form (not via the checkoutUrl). The transaction must already exist and be in PENDING status.

PREREQUISITES: A pending transaction must already exist — call monnify_initiate_payment first and pass its transactionReference here. Card details and browser deviceInformation must be collected from the customer's browser. Never log or store raw card numbers, CVVs, or PINs.

SIDE EFFECTS: Attempts to charge the card immediately. The response status determines the next step:
  - SUCCESS → payment is complete, no further action needed
  - OTP_AUTHORIZATION_REQUIRED → card requires OTP; otpData.message tells the customer where to get it. Collect the OTP and call monnify_authorise_card_otp
  - BANK_AUTHORIZATION_REQUIRED → card requires 3DS; redirect customer to secure3dData.redirectUrl, then call monnify_authorise_card_3ds
  - FAILED → charge failed; surface the message to the customer

MFA NOTE: Nigerian-issued cards require card.pin and may also trigger OTP or 3DS. Always handle all three non-SUCCESS statuses.

KEY OUTPUT FIELDS: status (determines next step), transactionReference, paymentReference, authorizedAmount, message, otpData (for OTP flow — contains id and message), secure3dData (for 3DS flow — contains id and redirectUrl).`,
  inputSchema: zodToJsonSchema(ChargeCardInputSchema) as Tool["inputSchema"],
};

async function handler(args: unknown): Promise<McpToolResult> {
  try {
    const parsed = ChargeCardInputSchema.parse(args);
    const result = await apiPost<Record<string, unknown>>(
      "/api/v1/merchant/cards/charge",
      parsed
    );
    const sanitised = sanitiseChargeCardResponse(result);
    return {
      content: [{ type: "text", text: getResponseFormat() === "json" ? JSON.stringify(sanitised, null, 2) : formatChargeCard(sanitised as Record<string, unknown>) }],
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
    return errorResult(`monnify_charge_card failed: ${String(error)}`);
  }
}

registerTool({ definition, handler });

export { definition, ChargeCardInputSchema as inputSchema, handler };
