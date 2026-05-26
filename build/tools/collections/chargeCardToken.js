import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { apiPost } from "../../client/monnifyClient.js";
import { sanitiseChargeCardTokenResponse } from "../../security/sanitiser.js";
import { registerTool } from "../registry.js";
import { MonnifyApiError } from "../../utils/errors.js";
import { errorResult } from "../../types/mcp.js";
import { ChargeCardTokenInputSchema } from "../../schemas/extended/collections.js";
const definition = {
    name: "monnify_charge_card_token",
    description: `Charges a previously tokenized card using its card token, without requiring the customer to re-enter card details.

WHEN TO USE: For recurring or repeat charges on a card the customer has already paid with. The card token is obtained from monnify_get_transaction_status after a previous successful card charge — look for the cardToken field in the response.

PREREQUISITES: A card token from a prior successful charge. Store the cardToken alongside the customerEmail used in that original charge — both are required here. The token is tied to the merchant's contractCode and apiKey.

SIDE EFFECTS: Initiates a real card charge immediately. This is a financial transaction — use a unique paymentReference per charge attempt. The same paymentReference can be safely resubmitted to deduplicate retries without double-charging.

MFA NOTE: Token charges bypass OTP and 3DS — the customer authorised recurring charges when they first paid. Ensure you have the customer's explicit consent to store and reuse their card token.

KEY OUTPUT FIELDS: transactionReference, paymentReference, amountPaid, totalPayable, settlementAmount, paidOn, paymentStatus (PAID | FAILED), paymentMethod, currency.`,
    inputSchema: zodToJsonSchema(ChargeCardTokenInputSchema),
};
async function handler(args) {
    try {
        const parsed = ChargeCardTokenInputSchema.parse(args);
        const result = await apiPost("/api/v1/merchant/cards/charge-card-token", parsed);
        const sanitised = sanitiseChargeCardTokenResponse(result);
        return {
            content: [{ type: "text", text: JSON.stringify(sanitised, null, 2) }],
        };
    }
    catch (error) {
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
        return errorResult(`monnify_charge_card_token failed: ${String(error)}`);
    }
}
registerTool({ definition, handler });
export { definition, ChargeCardTokenInputSchema as inputSchema, handler };
//# sourceMappingURL=chargeCardToken.js.map