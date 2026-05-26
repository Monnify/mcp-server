import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { apiPost } from "../../client/monnifyClient.js";
import { sanitiseInitiatePaymentResponse } from "../../security/sanitiser.js";
import { registerTool } from "../registry.js";
import { MonnifyApiError } from "../../utils/errors.js";
import { errorResult } from "../../types/mcp.js";
import { InitiatePaymentInputSchema } from "../../schemas/extended/collections.js";
const definition = {
    name: "monnify_initiate_payment",
    description: `Initiates a payment transaction and returns a checkout URL for the customer.

WHEN TO USE: When a customer needs to make a one-time payment. Returns a checkoutUrl — redirect the customer to this URL to complete payment via card, bank transfer, USSD, or other methods.

PREREQUISITES: None. A Monnify contract code is required (from Dashboard → Settings → Contract Codes).

SIDE EFFECTS: Creates a pending transaction on Monnify. Does not charge the customer — the customer must visit checkoutUrl and complete payment. Providing the same paymentReference again is safe (idempotent — returns the existing transaction).

MFA NOTE: Not applicable at this stage. The customer may encounter card 3DS (OTP) authentication on the checkout page.

KEY OUTPUT FIELDS: transactionReference (Monnify's ref), paymentReference (your ref), checkoutUrl (send this to the customer), enabledPaymentMethod.`,
    inputSchema: zodToJsonSchema(InitiatePaymentInputSchema),
};
async function handler(args) {
    try {
        const parsed = InitiatePaymentInputSchema.parse(args);
        const result = await apiPost("/api/v1/merchant/transactions/init-transaction", parsed);
        const sanitised = sanitiseInitiatePaymentResponse(result);
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
        return errorResult(`monnify_initiate_payment failed: ${String(error)}`);
    }
}
registerTool({ definition, handler });
export { definition, InitiatePaymentInputSchema as inputSchema, handler };
//# sourceMappingURL=initiatePayment.js.map