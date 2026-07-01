import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { McpToolResult } from "../../types/mcp.js";
import { apiGet } from "../../client/monnifyClient.js";
import { sanitiseDebitStatusResponse } from "../../security/sanitiser.js";
import { registerTool } from "../registry.js";
import { MonnifyApiError } from "../../utils/errors.js";
import { errorResult } from "../../types/mcp.js";
import { formatDebitStatus } from "../../utils/format.js";
import { getResponseFormat } from "../../utils/clientContext.js";
import { GetMandateDebitStatusInputSchema } from "../../schemas/extended/directDebit.js";

const definition: Tool = {
  name: "monnify_get_mandate_debit_status",
  description: `Retrieves the status of a specific Direct Debit debit attempt.

WHEN TO USE: After calling monnify_debit_mandate to check whether the debit succeeded, is still pending, or has failed. Debit operations are asynchronous — poll this endpoint to confirm the final status.

PREREQUISITES: A debit attempt must exist — call monnify_debit_mandate first.

SIDE EFFECTS: None. Read-only operation.

MFA NOTE: Not applicable.

KEY OUTPUT FIELDS: paymentReference, debitStatus (PENDING | SUCCESS | FAILED), amount, debitDate.`,
  inputSchema: zodToJsonSchema(GetMandateDebitStatusInputSchema) as Tool["inputSchema"],
};

async function handler(args: unknown): Promise<McpToolResult> {
  try {
    const parsed = GetMandateDebitStatusInputSchema.parse(args);
    const result = await apiGet<Record<string, unknown>>(
      "/api/v1/direct-debit/mandate/debit-status",
      { paymentReference: parsed.paymentReference }
    );
    const sanitised = sanitiseDebitStatusResponse(result);
    return {
      content: [{ type: "text", text: getResponseFormat() === "json" ? JSON.stringify(sanitised, null, 2) : formatDebitStatus(sanitised as Record<string, unknown>) }],
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
    return errorResult(`monnify_get_mandate_debit_status failed: ${String(error)}`);
  }
}

registerTool({ definition, handler });

export { definition, GetMandateDebitStatusInputSchema as inputSchema, handler };
