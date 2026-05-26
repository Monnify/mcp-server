import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { apiGet } from "../../client/monnifyClient.js";
import { sanitiseBankListResponse } from "../../security/sanitiser.js";
import { registerTool } from "../registry.js";
import { MonnifyApiError, ValidationError } from "../../utils/errors.js";
import { errorResult } from "../../types/mcp.js";
const InputSchema = z.object({});
const definition = {
    name: "monnify_get_supported_banks",
    description: `Returns all Nigerian banks supported by Monnify for payments and verification.

WHEN TO USE: Before calling monnify_verify_bank_account, monnify_create_mandate, or monnify_process_refund to look up the correct 3-digit bank code for a given bank name. Also useful to present bank choices to users.

PREREQUISITES: None.

SIDE EFFECTS: None. Read-only operation.

MFA NOTE: Not applicable.

KEY OUTPUT FIELDS: name (bank display name), code (3-digit bank code used in other API calls).`,
    inputSchema: zodToJsonSchema(InputSchema),
};
async function handler(_args) {
    try {
        InputSchema.parse(_args);
        const banks = await apiGet("/api/v1/banks");
        const sanitised = sanitiseBankListResponse(Array.isArray(banks) ? banks : []);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(sanitised, null, 2),
                },
            ],
        };
    }
    catch (error) {
        if (error instanceof MonnifyApiError) {
            return { content: [error.toMcpContent()], isError: true };
        }
        if (error instanceof ValidationError) {
            return { content: [error.toMcpContent()], isError: true };
        }
        return errorResult(`monnify_get_supported_banks failed: ${String(error)}`);
    }
}
registerTool({ definition, handler: (args) => handler(args) });
export { definition, InputSchema as inputSchema, handler };
//# sourceMappingURL=getSupportedBanks.js.map