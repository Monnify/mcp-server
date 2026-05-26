import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { apiGet } from "../../client/monnifyClient.js";
import { sanitiseMandateStatusResponse } from "../../security/sanitiser.js";
import { registerTool } from "../registry.js";
import { MonnifyApiError } from "../../utils/errors.js";
import { errorResult } from "../../types/mcp.js";
import { GetMandateStatusInputSchema } from "../../schemas/extended/directDebit.js";
const definition = {
    name: "monnify_get_mandate_status",
    description: `Retrieves the current status of a Direct Debit mandate.

WHEN TO USE: After creating a mandate to check if the customer has authorised it (mandateStatus = ACTIVATED), or before attempting a debit. You MUST confirm mandateStatus = ACTIVATED before calling monnify_debit_mandate.

PREREQUISITES: A mandate must exist — call monnify_create_mandate first.

SIDE EFFECTS: None. Read-only operation.

MFA NOTE: Not applicable.

KEY OUTPUT FIELDS: mandateReference, mandateCode, mandateStatus (PENDING_AUTHORIZATION | ACTIVATED | CANCELLED | REJECTED), mandateAmount, mandateType, customerName, customerAccountNumber, startDate, endDate, authorizationLink.`,
    inputSchema: zodToJsonSchema(GetMandateStatusInputSchema),
};
async function handler(args) {
    try {
        const parsed = GetMandateStatusInputSchema.parse(args);
        const result = await apiGet("/api/v1/direct-debit/mandate/", { mandateReferences: parsed.mandateReferences });
        const sanitised = sanitiseMandateStatusResponse(result);
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
        return errorResult(`monnify_get_mandate_status failed: ${String(error)}`);
    }
}
registerTool({ definition, handler });
export { definition, GetMandateStatusInputSchema as inputSchema, handler };
//# sourceMappingURL=getMandateStatus.js.map