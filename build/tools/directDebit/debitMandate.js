import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { apiPost } from "../../client/monnifyClient.js";
import { sanitiseDebitStatusResponse } from "../../security/sanitiser.js";
import { registerTool } from "../registry.js";
import { MonnifyApiError } from "../../utils/errors.js";
import { errorResult } from "../../types/mcp.js";
import { DebitMandateInputSchema } from "../../schemas/extended/directDebit.js";
const definition = {
    name: "monnify_debit_mandate",
    description: `Debits a customer's bank account using an activated Direct Debit mandate.

WHEN TO USE: To collect a payment from a customer who has an ACTIVATED mandate. Call monnify_get_mandate_status first to confirm the mandate is ACTIVATED before attempting a debit.

PREREQUISITES: monnify_get_mandate_status must return mandateStatus = ACTIVATED. Never attempt to debit a PENDING_AUTHORIZATION or CANCELLED mandate.

SIDE EFFECTS: Initiates a real debit from the customer's bank account. This is an irreversible financial operation. Use a unique paymentReference per debit attempt — the same reference can be safely resubmitted to check status without double-charging.

MFA NOTE: Not applicable.

KEY OUTPUT FIELDS: debitReference, mandateReference, debitStatus (PENDING | SUCCESS | FAILED), amount, debitDate.`,
    inputSchema: zodToJsonSchema(DebitMandateInputSchema),
};
async function handler(args) {
    try {
        const parsed = DebitMandateInputSchema.parse(args);
        const result = await apiPost("/api/v1/direct-debit/mandate/debit", parsed);
        const sanitised = sanitiseDebitStatusResponse(result);
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
        return errorResult(`monnify_debit_mandate failed: ${String(error)}`);
    }
}
registerTool({ definition, handler });
export { definition, DebitMandateInputSchema as inputSchema, handler };
//# sourceMappingURL=debitMandate.js.map