import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { McpToolResult } from "../../types/mcp.js";
import { apiPost } from "../../client/monnifyClient.js";
import { sanitiseMandateResponse } from "../../security/sanitiser.js";
import { registerTool } from "../registry.js";
import { MonnifyApiError } from "../../utils/errors.js";
import { errorResult } from "../../types/mcp.js";
import { formatCreateMandate } from "../../utils/format.js";
import { getResponseFormat } from "../../utils/clientContext.js";
import { CreateMandateInputSchema } from "../../schemas/extended/directDebit.js";

const definition: Tool = {
  name: "monnify_create_mandate",
  description: `Creates a Direct Debit mandate on a customer's bank account, enabling recurring payments.

WHEN TO USE: When setting up recurring billing for a customer — subscriptions, instalments, or utility collection. This is always the first step in the Direct Debit lifecycle.

PREREQUISITES: None. However, verify the customer's bank account with monnify_verify_bank_account first to confirm account details before committing them to a mandate.

SIDE EFFECTS: Generates a mandateReference and a 30-day authorization link. The mandate status starts as PENDING_AUTHORIZATION — no debiting can occur until the customer clicks the link and authorises via their bank. Monnify automatically routes to TeamApt or NIBSS based on the customer's bank.

MFA NOTE: Not applicable at this stage. Customer authorisation is handled externally via the authorizationLink — share this link with the customer via email, SMS, or in-app.

KEY OUTPUT FIELDS: mandateReference, mandateCode, mandateStatus (PENDING_AUTHORIZATION), authorizationLink (valid 30 days), startDate, endDate.`,
  inputSchema: zodToJsonSchema(CreateMandateInputSchema) as Tool["inputSchema"],
};

async function handler(args: unknown): Promise<McpToolResult> {
  try {
    const parsed = CreateMandateInputSchema.parse(args);
    const result = await apiPost<Record<string, unknown>>(
      "/api/v1/direct-debit/mandate/create",
      parsed
    );
    const sanitised = sanitiseMandateResponse(result);
    return {
      content: [{ type: "text", text: getResponseFormat() === "json" ? JSON.stringify(sanitised, null, 2) : formatCreateMandate(sanitised as Record<string, unknown>) }],
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
    return errorResult(`monnify_create_mandate failed: ${String(error)}`);
  }
}

registerTool({ definition, handler });

export { definition, CreateMandateInputSchema as inputSchema, handler };
