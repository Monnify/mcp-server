import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { McpToolResult } from "../../types/mcp.js";
import { apiPut } from "../../client/monnifyClient.js";
import { sanitiseSubAccountResponse } from "../../security/sanitiser.js";
import { registerTool } from "../registry.js";
import { MonnifyApiError } from "../../utils/errors.js";
import { errorResult } from "../../types/mcp.js";
import { formatUpdateSubAccount } from "../../utils/format.js";
import { getResponseFormat } from "../../utils/clientContext.js";
import { UpdateSubAccountInputSchema } from "../../schemas/extended/subAccounts.js";

const definition: Tool = {
  name: "monnify_update_sub_account",
  description: `Updates the details of an existing Sub Account.

WHEN TO USE: When a sub-account's linked bank account, email, or default split percentage changes.

PREREQUISITES: The sub-account must already exist — obtain its subAccountCode from monnify_create_sub_accounts or monnify_get_sub_accounts. Sub Accounts must be enabled on your account — email integration-support@monnify.com if this returns "not permitted".

SIDE EFFECTS: Overwrites the sub-account's stored bank details, email, and default split percentage. Existing incomeSplitConfig references to this subAccountCode are unaffected — only the destination account and split behaviour change going forward.

MFA NOTE: Not applicable.

KEY OUTPUT FIELDS: subAccountCode, accountNumber, accountName, bankCode, bankName, defaultSplitPercentage.`,
  inputSchema: zodToJsonSchema(UpdateSubAccountInputSchema) as Tool["inputSchema"],
};

async function handler(args: unknown): Promise<McpToolResult> {
  try {
    const parsed = UpdateSubAccountInputSchema.parse(args);
    const result = await apiPut<Record<string, unknown>>(
      "/api/v1/sub-accounts",
      parsed
    );
    const sanitised = sanitiseSubAccountResponse(result);
    return {
      content: [{ type: "text", text: getResponseFormat() === "json" ? JSON.stringify(sanitised, null, 2) : formatUpdateSubAccount(sanitised as Record<string, unknown>) }],
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
    return errorResult(`monnify_update_sub_account failed: ${String(error)}`);
  }
}

registerTool({ definition, handler });

export { definition, UpdateSubAccountInputSchema as inputSchema, handler };
