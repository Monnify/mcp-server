import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { McpToolResult } from "../../types/mcp.js";
import { apiPost } from "../../client/monnifyClient.js";
import { sanitiseAuthoriseCard3dsResponse } from "../../security/sanitiser.js";
import { registerTool } from "../registry.js";
import { MonnifyApiError } from "../../utils/errors.js";
import { errorResult } from "../../types/mcp.js";
import { AuthoriseCard3dsInputSchema } from "../../schemas/extended/collections.js";

const definition: Tool = {
  name: "monnify_authorise_card_3ds",
  description: `Initiates 3D Secure (3DS) authorisation for a card transaction and returns the redirect URL for the customer to complete bank authentication.

WHEN TO USE: Only when monnify_charge_card returns status THREE_DS_TRANSACTION_INITIATED. Call this tool with the transactionReference and apiKey from the charge response to obtain the 3DS redirect URL, then direct the customer to that URL to complete authentication on their bank's page.

PREREQUISITES: monnify_charge_card must have been called and returned status THREE_DS_TRANSACTION_INITIATED. Both transactionReference and apiKey from that charge response are required.

SIDE EFFECTS: Prepares the 3DS authentication session on Monnify's end. After the customer completes authentication on the bank's 3DS page, the bank will redirect them back to the merchant's configured redirectUrl. Call monnify_get_transaction_status afterwards to confirm the final payment outcome.

MFA NOTE: 3DS authentication happens entirely on the customer's bank page — the bank issues and validates the OTP or biometric challenge. The merchant does not see the 3DS credential.

KEY OUTPUT FIELDS: redirectUrl (send the customer to this URL to complete 3DS authentication), status, transactionReference, paymentReference, authorizedAmount.`,
  inputSchema: zodToJsonSchema(AuthoriseCard3dsInputSchema) as Tool["inputSchema"],
};

async function handler(args: unknown): Promise<McpToolResult> {
  try {
    const parsed = AuthoriseCard3dsInputSchema.parse(args);
    const result = await apiPost<Record<string, unknown>>(
      "/api/v1/sdk/cards/secure-3d/authorize",
      parsed
    );
    const sanitised = sanitiseAuthoriseCard3dsResponse(result);
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
    return errorResult(`monnify_authorise_card_3ds failed: ${String(error)}`);
  }
}

registerTool({ definition, handler });

export { definition, AuthoriseCard3dsInputSchema as inputSchema, handler };
