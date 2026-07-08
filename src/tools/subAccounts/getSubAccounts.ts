import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { McpToolResult } from "../../types/mcp.js";
import { apiGet } from "../../client/monnifyClient.js";
import { sanitiseSubAccountListResponse } from "../../security/sanitiser.js";
import { registerTool } from "../registry.js";
import { MonnifyApiError } from "../../utils/errors.js";
import { errorResult } from "../../types/mcp.js";
import { formatSubAccountList } from "../../utils/format.js";
import { getResponseFormat } from "../../utils/clientContext.js";
import { GetSubAccountsInputSchema } from "../../schemas/extended/subAccounts.js";

const definition: Tool = {
  name: "monnify_get_sub_accounts",
  description: `Lists all Sub Accounts created on your integration.

WHEN TO USE: To look up an existing subAccountCode before configuring an incomeSplitConfig, or to audit which sub-accounts are currently set up.

PREREQUISITES: Sub Accounts must be enabled on your account — email integration-support@monnify.com if this returns "not permitted".

SIDE EFFECTS: None. Read-only operation.

MFA NOTE: Not applicable.

KEY OUTPUT FIELDS: subAccountCode (use this in incomeSplitConfig), accountNumber, accountName, bankCode, bankName, defaultSplitPercentage.`,
  inputSchema: zodToJsonSchema(GetSubAccountsInputSchema) as Tool["inputSchema"],
};

async function handler(args: unknown): Promise<McpToolResult> {
  try {
    GetSubAccountsInputSchema.parse(args);
    const result = await apiGet<Array<Record<string, unknown>>>(
      "/api/v1/sub-accounts"
    );
    const sanitised = sanitiseSubAccountListResponse(
      Array.isArray(result) ? result : []
    );
    return {
      content: [{ type: "text", text: getResponseFormat() === "json" ? JSON.stringify(sanitised, null, 2) : formatSubAccountList(sanitised as Array<Record<string, unknown>>, "found") }],
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
    return errorResult(`monnify_get_sub_accounts failed: ${String(error)}`);
  }
}

registerTool({ definition, handler });

export { definition, GetSubAccountsInputSchema as inputSchema, handler };
