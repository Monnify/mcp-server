import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { McpToolResult } from "../../types/mcp.js";
import { apiPost } from "../../client/monnifyClient.js";
import { sanitiseBvnInfoResponse } from "../../security/sanitiser.js";
import { registerTool } from "../registry.js";
import { MonnifyApiError } from "../../utils/errors.js";
import { errorResult } from "../../types/mcp.js";
import { VerifyBvnInfoInputSchema } from "../../schemas/extended/verification.js";

const definition: Tool = {
  name: "monnify_verify_bvn_info",
  description: `Verifies whether the provided name, date of birth, and mobile number match the BVN record, returning a single boolean result.

WHEN TO USE: When you need a holistic match check against a BVN — all supplied details must match for bvnInformationMatch to be true. Useful for onboarding flows, KYC, and direct debit mandate validation.

PREREQUISITES: None. Requires Monnify Identity Verification API access enabled on your account. Live environment only — costs ₦10 per successful request.

SIDE EFFECTS: None. Read-only — does not store any data.

MFA NOTE: Not applicable.

KEY OUTPUT FIELDS: bvn, name, dateOfBirth, mobileNo, bvnInformationMatch (boolean — true if all provided details match the BVN record).`,
  inputSchema: zodToJsonSchema(VerifyBvnInfoInputSchema) as Tool["inputSchema"],
};

async function handler(args: unknown): Promise<McpToolResult> {
  try {
    const parsed = VerifyBvnInfoInputSchema.parse(args);
    const result = await apiPost<Record<string, unknown>>(
      "/api/v1/vas/bvn-details-match",
      parsed
    );
    const sanitised = sanitiseBvnInfoResponse(result);
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
    return errorResult(`monnify_verify_bvn_info failed: ${String(error)}`);
  }
}

registerTool({ definition, handler });

export { definition, VerifyBvnInfoInputSchema as inputSchema, handler };
