import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { McpToolResult } from "../../types/mcp.js";
import { apiDelete } from "../../client/monnifyClient.js";
import { registerTool } from "../registry.js";
import { MonnifyApiError } from "../../utils/errors.js";
import { errorResult } from "../../types/mcp.js";
import { formatDeleteSubAccount } from "../../utils/format.js";
import { getResponseFormat } from "../../utils/clientContext.js";
import { DeleteSubAccountInputSchema } from "../../schemas/extended/subAccounts.js";

const definition: Tool = {
  name: "monnify_delete_sub_account",
  description: `Permanently deletes a Sub Account.

WHEN TO USE: When a vendor or partner is offboarded and should no longer receive split payments.

PREREQUISITES: The sub-account must exist. Any incomeSplitConfig still referencing this subAccountCode will fail on future transactions once deleted.

SIDE EFFECTS: DESTRUCTIVE — permanently removes the sub-account. Cannot be undone.

MFA NOTE: Not applicable.

KEY OUTPUT FIELDS: subAccountCode (confirms which sub-account was deleted).`,
  inputSchema: zodToJsonSchema(DeleteSubAccountInputSchema) as Tool["inputSchema"],
};

async function handler(args: unknown): Promise<McpToolResult> {
  try {
    const parsed = DeleteSubAccountInputSchema.parse(args);
    await apiDelete<undefined>(
      `/api/v1/sub-accounts/${encodeURIComponent(parsed.subAccountCode)}`
    );
    return {
      content: [{ type: "text", text: getResponseFormat() === "json" ? JSON.stringify({ subAccountCode: parsed.subAccountCode, deleted: true }, null, 2) : formatDeleteSubAccount(parsed.subAccountCode) }],
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
    return errorResult(`monnify_delete_sub_account failed: ${String(error)}`);
  }
}

registerTool({ definition, handler });

export { definition, DeleteSubAccountInputSchema as inputSchema, handler };
