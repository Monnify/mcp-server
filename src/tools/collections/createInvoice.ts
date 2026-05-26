import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { McpToolResult } from "../../types/mcp.js";
import { apiPost } from "../../client/monnifyClient.js";
import { sanitiseInvoiceResponse } from "../../security/sanitiser.js";
import { registerTool } from "../registry.js";
import { MonnifyApiError } from "../../utils/errors.js";
import { errorResult } from "../../types/mcp.js";
import { CreateInvoiceInputSchema } from "../../schemas/extended/collections.js";

const definition: Tool = {
  name: "monnify_create_invoice",
  description: `Creates a payment invoice and returns a URL the customer can use to pay.

WHEN TO USE: When you need to send a customer a formal invoice with a fixed amount and expiry date. Suitable for B2B billing, service charges, or any scenario where you want a shareable payment link with a deadline.

PREREQUISITES: None. A Monnify contract code is required.

SIDE EFFECTS: Creates an invoice record on Monnify. The invoice remains active until the expiryDate or until paid. Using the same invoiceReference is safe (idempotent).

MFA NOTE: Not applicable at the invoice creation stage.

KEY OUTPUT FIELDS: invoiceReference, invoiceStatus, checkoutUrl (share with customer), invoiceUrl, offlinePaymentCode, expiryDate, createdOn.`,
  inputSchema: zodToJsonSchema(CreateInvoiceInputSchema) as Tool["inputSchema"],
};

async function handler(args: unknown): Promise<McpToolResult> {
  try {
    const parsed = CreateInvoiceInputSchema.parse(args);
    const result = await apiPost<Record<string, unknown>>(
      "/api/v1/invoice/create",
      parsed
    );
    const sanitised = sanitiseInvoiceResponse(result);
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
    return errorResult(`monnify_create_invoice failed: ${String(error)}`);
  }
}

registerTool({ definition, handler });

export { definition, CreateInvoiceInputSchema as inputSchema, handler };
