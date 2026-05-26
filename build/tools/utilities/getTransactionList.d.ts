import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import type { McpToolResult } from "../../types/mcp.js";
declare const InputSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    size: z.ZodDefault<z.ZodNumber>;
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
    paymentStatus: z.ZodOptional<z.ZodEnum<["PAID", "PENDING", "CANCELLED", "FAILED"]>>;
    paymentReference: z.ZodOptional<z.ZodString>;
    transactionReference: z.ZodOptional<z.ZodString>;
    customerName: z.ZodOptional<z.ZodString>;
    customerEmail: z.ZodOptional<z.ZodString>;
    amount: z.ZodOptional<z.ZodNumber>;
    fromAmount: z.ZodOptional<z.ZodNumber>;
    toAmount: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    size: number;
    page: number;
    transactionReference?: string | undefined;
    paymentReference?: string | undefined;
    paymentStatus?: "PAID" | "PENDING" | "CANCELLED" | "FAILED" | undefined;
    customerEmail?: string | undefined;
    customerName?: string | undefined;
    amount?: number | undefined;
    from?: string | undefined;
    to?: string | undefined;
    fromAmount?: number | undefined;
    toAmount?: number | undefined;
}, {
    transactionReference?: string | undefined;
    paymentReference?: string | undefined;
    paymentStatus?: "PAID" | "PENDING" | "CANCELLED" | "FAILED" | undefined;
    customerEmail?: string | undefined;
    customerName?: string | undefined;
    amount?: number | undefined;
    size?: number | undefined;
    page?: number | undefined;
    from?: string | undefined;
    to?: string | undefined;
    fromAmount?: number | undefined;
    toAmount?: number | undefined;
}>;
declare const definition: Tool;
declare function handler(args: z.infer<typeof InputSchema>): Promise<McpToolResult>;
export { definition, InputSchema as inputSchema, handler };
//# sourceMappingURL=getTransactionList.d.ts.map