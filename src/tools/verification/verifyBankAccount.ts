import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { McpToolResult } from "../../types/mcp.js";
import { apiGet } from "../../client/monnifyClient.js";
import { sanitiseBankAccountResponse } from "../../security/sanitiser.js";
import { registerTool } from "../registry.js";
import { MonnifyApiError, ValidationError } from "../../utils/errors.js";
import { errorResult } from "../../types/mcp.js";
import { VerifyBankAccountInputSchema } from "../../schemas/extended/verification.js";
import { formatBankAccountVerification } from "../../utils/format.js";
import { getResponseFormat } from "../../utils/clientContext.js";

const definition: Tool = {
  name: "monnify_verify_bank_account",
  description: `Verifies a Nigerian bank account number and returns the account holder name.

WHEN TO USE: Before initiating a refund, creating a direct debit mandate, or confirming account details provided by a user. Always verify account details before committing them to a mandate or refund.

PREREQUISITES: None. Call monnify_get_supported_banks first to look up the correct bankCode.

SIDE EFFECTS: None. Read-only — does not move any funds or create any records.

MFA NOTE: Not applicable.

KEY OUTPUT FIELDS: accountName (name of account holder), accountNumber, bankCode, bankName.`,
  inputSchema: zodToJsonSchema(VerifyBankAccountInputSchema) as Tool["inputSchema"],
};

async function handler(args: unknown): Promise<McpToolResult> {
  try {
    const parsed = VerifyBankAccountInputSchema.parse(args);
    const result = await apiGet<Record<string, unknown>>(
      "/api/v2/disbursements/account/validate",
      {
        accountNumber: parsed.accountNumber,
        bankCode: parsed.bankCode,
      }
    );
    const sanitised = sanitiseBankAccountResponse(result);
    return {
      content: [{ type: "text", text: getResponseFormat() === "json" ? JSON.stringify(sanitised, null, 2) : formatBankAccountVerification(sanitised as Record<string, unknown>) }],
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
    return errorResult(`monnify_verify_bank_account failed: ${String(error)}`);
  }
}

registerTool({ definition, handler });

export { definition, VerifyBankAccountInputSchema as inputSchema, handler };
