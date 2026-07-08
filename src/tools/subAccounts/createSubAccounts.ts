import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { McpToolResult } from "../../types/mcp.js";
import { apiPost } from "../../client/monnifyClient.js";
import { sanitiseSubAccountListResponse } from "../../security/sanitiser.js";
import { registerTool } from "../registry.js";
import { MonnifyApiError } from "../../utils/errors.js";
import { errorResult } from "../../types/mcp.js";
import { formatSubAccountList } from "../../utils/format.js";
import { getResponseFormat } from "../../utils/clientContext.js";
import { CreateSubAccountsInputSchema } from "../../schemas/extended/subAccounts.js";

const definition: Tool = {
  name: "monnify_create_sub_accounts",
  description: `Creates one or more Sub Accounts, used to automatically split payments across multiple bank accounts.

WHEN TO USE: Before using incomeSplitConfig on monnify_initiate_payment, monnify_reserve_account, monnify_charge_card_token, or monnify_debit_mandate — a subAccountCode must already exist before it can receive a split. Also use for marketplace or multi-vendor setups where each vendor needs their own settlement account.

PREREQUISITES: Sub Accounts are disabled by default — email integration-support@monnify.com to have this feature enabled on your account before use.

SIDE EFFECTS: Creates one or more sub-account records tied to real bank accounts on Monnify. Each sub-account receives its own subAccountCode.

MFA NOTE: Not applicable.

KEY OUTPUT FIELDS: subAccountCode (use this in incomeSplitConfig), accountNumber, accountName, bankCode, bankName, defaultSplitPercentage.`,
  inputSchema: zodToJsonSchema(CreateSubAccountsInputSchema) as Tool["inputSchema"],
};

async function handler(args: unknown): Promise<McpToolResult> {
  try {
    const parsed = CreateSubAccountsInputSchema.parse(args);
    const result = await apiPost<Array<Record<string, unknown>>>(
      "/api/v1/sub-accounts",
      parsed.subAccounts
    );
    const sanitised = sanitiseSubAccountListResponse(
      Array.isArray(result) ? result : []
    );
    return {
      content: [{ type: "text", text: getResponseFormat() === "json" ? JSON.stringify(sanitised, null, 2) : formatSubAccountList(sanitised as Array<Record<string, unknown>>, "created") }],
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
    return errorResult(`monnify_create_sub_accounts failed: ${String(error)}`);
  }
}

registerTool({ definition, handler });

export { definition, CreateSubAccountsInputSchema as inputSchema, handler };
