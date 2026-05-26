import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { apiPost } from "../../client/monnifyClient.js";
import { sanitiseBvnResponse } from "../../security/sanitiser.js";
import { registerTool } from "../registry.js";
import { MonnifyApiError } from "../../utils/errors.js";
import { errorResult } from "../../types/mcp.js";
import { VerifyBvnInputSchema } from "../../schemas/extended/verification.js";
const definition = {
    name: "monnify_verify_bvn",
    description: `Verifies that a customer's BVN details match the provided name, date of birth, and phone number.

WHEN TO USE: For KYC (Know Your Customer) verification flows, onboarding with identity checks, or before creating a direct debit mandate where BVN validation is required.

PREREQUISITES: None. Requires Monnify Identity Verification API access to be enabled on your account.

SIDE EFFECTS: None. Read-only — does not store any data.

MFA NOTE: Not applicable.

KEY OUTPUT FIELDS: bvn, nameMatch (boolean), mobileNoMatch (boolean), dateOfBirthMatch (boolean). A result of true means the provided value matches the BVN record.`,
    inputSchema: zodToJsonSchema(VerifyBvnInputSchema),
};
async function handler(args) {
    try {
        const parsed = VerifyBvnInputSchema.parse(args);
        const result = await apiPost("/api/v1/vas/bvn-details-match", parsed);
        const sanitised = sanitiseBvnResponse(result);
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
        return errorResult(`monnify_verify_bvn failed: ${String(error)}`);
    }
}
registerTool({ definition, handler });
export { definition, VerifyBvnInputSchema as inputSchema, handler };
//# sourceMappingURL=verifyBvn.js.map