import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { apiGet } from "../../client/monnifyClient.js";
import { registerTool } from "../registry.js";
import { MonnifyApiError, ValidationError } from "../../utils/errors.js";
import { errorResult } from "../../types/mcp.js";
const InputSchema = z.object({
    page: z
        .number()
        .int()
        .min(0)
        .default(0)
        .describe("Page number (zero-indexed). Default is 0."),
    size: z
        .number()
        .int()
        .min(1)
        .max(100)
        .default(10)
        .describe("Number of transactions per page. Default is 10, max is 100."),
    from: z
        .string()
        .optional()
        .describe("Filter start date in ISO 8601 format (YYYY-MM-DDTHH:mm:ss)."),
    to: z
        .string()
        .optional()
        .describe("Filter end date in ISO 8601 format (YYYY-MM-DDTHH:mm:ss)."),
    paymentStatus: z
        .enum(["PAID", "PENDING", "CANCELLED", "FAILED"])
        .optional()
        .describe("Filter by payment status."),
    paymentReference: z
        .string()
        .optional()
        .describe("Filter by your payment reference."),
    transactionReference: z
        .string()
        .optional()
        .describe("Filter by Monnify transaction reference."),
    customerName: z
        .string()
        .optional()
        .describe("Filter by customer name."),
    customerEmail: z
        .string()
        .email()
        .optional()
        .describe("Filter by customer email address."),
    amount: z
        .number()
        .positive()
        .optional()
        .describe("Filter by exact transaction amount in Naira."),
    fromAmount: z
        .number()
        .positive()
        .optional()
        .describe("Filter transactions with amount greater than or equal to this value in Naira."),
    toAmount: z
        .number()
        .positive()
        .optional()
        .describe("Filter transactions with amount less than or equal to this value in Naira."),
});
const definition = {
    name: "monnify_get_transaction_list",
    description: `Search and list transactions with optional filters.

WHEN TO USE: For reporting, reconciliation, or finding a specific transaction when you have partial information (e.g. customer email or date range but not the full reference).

PREREQUISITES: None.

SIDE EFFECTS: None. Read-only operation.

MFA NOTE: Not applicable.

KEY OUTPUT FIELDS: content (array of transactions), totalElements, totalPages, size, number (current page).`,
    inputSchema: zodToJsonSchema(InputSchema),
};
async function handler(args) {
    try {
        const parsed = InputSchema.parse(args);
        const result = await apiGet("/api/v1/transactions/search", {
            page: parsed.page,
            size: parsed.size,
            from: parsed.from,
            to: parsed.to,
            paymentStatus: parsed.paymentStatus,
            paymentReference: parsed.paymentReference,
            transactionReference: parsed.transactionReference,
            customerName: parsed.customerName,
            customerEmail: parsed.customerEmail,
            amount: parsed.amount,
            fromAmount: parsed.fromAmount,
            toAmount: parsed.toAmount,
        });
        const content = Array.isArray(result["content"]) ? result["content"] : [];
        const safeContent = content.map((tx) => ({
            transactionReference: tx["transactionReference"],
            paymentReference: tx["paymentReference"],
            amountPaid: tx["amountPaid"],
            totalPayable: tx["totalPayable"],
            paymentStatus: tx["paymentStatus"],
            paidOn: tx["paidOn"],
            paymentMethod: tx["paymentMethod"],
            currencyCode: tx["currencyCode"],
        }));
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        content: safeContent,
                        totalElements: result["totalElements"],
                        totalPages: result["totalPages"],
                        size: result["size"],
                        number: result["number"],
                    }, null, 2),
                },
            ],
        };
    }
    catch (error) {
        if (error instanceof MonnifyApiError) {
            return { content: [error.toMcpContent()], isError: true };
        }
        if (error instanceof ValidationError) {
            return { content: [error.toMcpContent()], isError: true };
        }
        return errorResult(`monnify_get_transaction_list failed: ${String(error)}`);
    }
}
registerTool({ definition, handler: (args) => handler(args) });
export { definition, InputSchema as inputSchema, handler };
//# sourceMappingURL=getTransactionList.js.map