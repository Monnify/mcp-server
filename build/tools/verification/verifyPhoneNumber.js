import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { apiGet } from "../../client/monnifyClient.js";
import { sanitisePhoneNumberResponse } from "../../security/sanitiser.js";
import { registerTool } from "../registry.js";
import { MonnifyApiError } from "../../utils/errors.js";
import { errorResult } from "../../types/mcp.js";
import { VerifyPhoneNumberInputSchema } from "../../schemas/extended/verification.js";
const definition = {
    name: "monnify_verify_phone_number",
    description: `Verifies a Nigerian mobile phone number and returns network and validity information.

WHEN TO USE: To validate a phone number before sending OTPs, creating mandates, or during customer onboarding. Useful for detecting invalid or ported numbers.

PREREQUISITES: None.

SIDE EFFECTS: None. Read-only operation.

MFA NOTE: Not applicable.

KEY OUTPUT FIELDS: phoneNumber, network (mobile network operator), phoneNumberValid (boolean), ported (boolean — true if the number has been ported between networks).`,
    inputSchema: zodToJsonSchema(VerifyPhoneNumberInputSchema),
};
async function handler(args) {
    try {
        const parsed = VerifyPhoneNumberInputSchema.parse(args);
        const result = await apiGet("/api/v1/vas/phone-number", { phoneNumber: parsed.phoneNumber });
        const sanitised = sanitisePhoneNumberResponse(result);
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
        return errorResult(`monnify_verify_phone_number failed: ${String(error)}`);
    }
}
registerTool({ definition, handler });
export { definition, VerifyPhoneNumberInputSchema as inputSchema, handler };
//# sourceMappingURL=verifyPhoneNumber.js.map