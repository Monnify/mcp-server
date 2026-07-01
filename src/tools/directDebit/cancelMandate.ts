import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { McpToolResult } from "../../types/mcp.js";
import { apiPatch } from "../../client/monnifyClient.js";
import { sanitiseCancelMandateResponse } from "../../security/sanitiser.js";
import { registerTool } from "../registry.js";
import { MonnifyApiError } from "../../utils/errors.js";
import { errorResult } from "../../types/mcp.js";
import { formatCancelMandate } from "../../utils/format.js";
import { getResponseFormat } from "../../utils/clientContext.js";
import { CancelMandateInputSchema } from "../../schemas/extended/directDebit.js";

const definition: Tool = {
  name: "monnify_cancel_mandate",
  description: `Cancels an existing Direct Debit mandate, permanently stopping future debits.

WHEN TO USE: When a customer requests cancellation of their subscription or recurring billing, or when a mandate needs to be revoked for compliance reasons.

PREREQUISITES: The mandate must exist. The mandate can be in any status (PENDING_AUTHORIZATION, ACTIVATED).

SIDE EFFECTS: IRREVERSIBLE — once cancelled, the mandate cannot be reactivated. The customer must create and authorise a new mandate to resume recurring billing. No refunds are triggered — only future scheduled debits are stopped.

MFA NOTE: Not applicable.

KEY OUTPUT FIELDS: mandateReference, mandateStatus (will be CANCELLED).`,
  inputSchema: zodToJsonSchema(CancelMandateInputSchema) as Tool["inputSchema"],
};

async function handler(args: unknown): Promise<McpToolResult> {
  try {
    const parsed = CancelMandateInputSchema.parse(args);
    const result = await apiPatch<Record<string, unknown>>(
      `/api/v1/direct-debit/mandate/cancel-mandate/${encodeURIComponent(parsed.mandateCode)}`
    );
    const sanitised = sanitiseCancelMandateResponse(result);
    return {
      content: [{ type: "text", text: getResponseFormat() === "json" ? JSON.stringify(sanitised, null, 2) : formatCancelMandate(sanitised as Record<string, unknown>) }],
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
    return errorResult(`monnify_cancel_mandate failed: ${String(error)}`);
  }
}

registerTool({ definition, handler });

export { definition, CancelMandateInputSchema as inputSchema, handler };
