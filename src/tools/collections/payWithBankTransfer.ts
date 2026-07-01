import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { McpToolResult } from "../../types/mcp.js";
import { apiPost } from "../../client/monnifyClient.js";
import { sanitiseBankTransferPaymentResponse } from "../../security/sanitiser.js";
import { registerTool } from "../registry.js";
import { MonnifyApiError } from "../../utils/errors.js";
import { errorResult } from "../../types/mcp.js";
import { formatBankTransferPayment } from "../../utils/format.js";
import { getResponseFormat } from "../../utils/clientContext.js";
import { PayWithBankTransferInputSchema } from "../../schemas/extended/collections.js";

const definition: Tool = {
  name: "monnify_pay_with_bank_transfer",
  description: `Initialises a bank transfer payment for an existing pending transaction and returns a one-time virtual account for the customer to transfer to.

WHEN TO USE: After calling monnify_initiate_payment, use this tool when the customer wants to pay by direct bank transfer instead of card or USSD. Returns a virtual account number the customer must transfer the exact amount to.

PREREQUISITES: A pending transaction must already exist — call monnify_initiate_payment first and pass its transactionReference here. The bankCode must be a valid Monnify-supported bank (call monnify_get_supported_banks to retrieve codes).

SIDE EFFECTS: Creates a one-time virtual bank account tied to the transaction. The account expires at expiryDate. If the customer fails to transfer before expiry the transaction will remain pending. Calling this endpoint again with the same transactionReference and bankCode is safe (idempotent).

MFA NOTE: No OTP is required from the customer on your end. The customer's own bank may require 2FA to complete the transfer.

KEY OUTPUT FIELDS: accountNumber (tell the customer to transfer to this), accountName, bankName, bankCode, expiryDate (inform customer of deadline), amount (exact amount customer must send), fee, totalPayableFee, transactionReference.`,
  inputSchema: zodToJsonSchema(PayWithBankTransferInputSchema) as Tool["inputSchema"],
};

async function handler(args: unknown): Promise<McpToolResult> {
  try {
    const parsed = PayWithBankTransferInputSchema.parse(args);
    const result = await apiPost<Record<string, unknown>>(
      "/api/v1/merchant/bank-transfer/init-payment",
      parsed
    );
    const sanitised = sanitiseBankTransferPaymentResponse(result);
    return {
      content: [{ type: "text", text: getResponseFormat() === "json" ? JSON.stringify(sanitised, null, 2) : formatBankTransferPayment(sanitised as Record<string, unknown>) }],
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
    return errorResult(`monnify_pay_with_bank_transfer failed: ${String(error)}`);
  }
}

registerTool({ definition, handler });

export { definition, PayWithBankTransferInputSchema as inputSchema, handler };
