import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { McpToolResult } from "../../types/mcp.js";
import { apiPost } from "../../client/monnifyClient.js";
import { sanitiseNinResponse } from "../../security/sanitiser.js";
import { registerTool } from "../registry.js";
import { MonnifyApiError } from "../../utils/errors.js";
import { errorResult } from "../../types/mcp.js";
import { VerifyNinInputSchema } from "../../schemas/extended/verification.js";

const definition: Tool = {
  name: "monnify_verify_nin",
  description: `Verifies a customer's National Identification Number (NIN) by matching it against the provided name and date of birth.

WHEN TO USE: For strong identity verification flows where NIN is required, such as high-value onboarding, compliance checks, or regulatory KYC requirements that mandate NIN validation.

PREREQUISITES: None. Requires Monnify Identity Verification API access enabled on your account. Live environment only — costs ₦60 per successful request.

SIDE EFFECTS: None. Read-only — does not store any data.

MFA NOTE: Not applicable.

KEY OUTPUT FIELDS: nin, firstName, lastName, dateOfBirth, gender, phoneNumber, ninInformationMatch (boolean — true if the provided name and date of birth match the NIN record).`,
  inputSchema: zodToJsonSchema(VerifyNinInputSchema) as Tool["inputSchema"],
};

async function handler(args: unknown): Promise<McpToolResult> {
  try {
    const parsed = VerifyNinInputSchema.parse(args);
    const result = await apiPost<Record<string, unknown>>(
      "/api/v1/vas/nin-details",
      parsed
    );
    const sanitised = sanitiseNinResponse(result);
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
    return errorResult(`monnify_verify_nin failed: ${String(error)}`);
  }
}

registerTool({ definition, handler });

export { definition, VerifyNinInputSchema as inputSchema, handler };
