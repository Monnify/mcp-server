import { z } from "zod";
export declare const CreateMandateInputSchema: z.ZodObject<{
    [x: string]: z.ZodTypeAny;
} & {
    mandateReference: z.ZodString;
    mandateAmount: z.ZodNumber;
    customerAccountNumber: z.ZodString;
    customerAccountBankCode: z.ZodString;
    customerName: z.ZodString;
    customerEmailAddress: z.ZodString;
    customerPhoneNumber: z.ZodString;
    customerAddress: z.ZodString;
    mandateDescription: z.ZodString;
    mandateStartDate: z.ZodString;
    mandateEndDate: z.ZodString;
    contractCode: z.ZodString;
    redirectUrl: z.ZodOptional<z.ZodString>;
    debitAmount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    autoRenew: z.ZodOptional<z.ZodBoolean>;
    customerCancellation: z.ZodOptional<z.ZodBoolean>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    [x: string]: any;
    mandateReference?: unknown;
    mandateAmount?: unknown;
    customerAccountNumber?: unknown;
    customerAccountBankCode?: unknown;
    customerName?: unknown;
    customerEmailAddress?: unknown;
    customerPhoneNumber?: unknown;
    customerAddress?: unknown;
    mandateDescription?: unknown;
    mandateStartDate?: unknown;
    mandateEndDate?: unknown;
    contractCode?: unknown;
    redirectUrl?: unknown;
    debitAmount?: unknown;
    autoRenew?: unknown;
    customerCancellation?: unknown;
}, {
    [x: string]: any;
    mandateReference?: unknown;
    mandateAmount?: unknown;
    customerAccountNumber?: unknown;
    customerAccountBankCode?: unknown;
    customerName?: unknown;
    customerEmailAddress?: unknown;
    customerPhoneNumber?: unknown;
    customerAddress?: unknown;
    mandateDescription?: unknown;
    mandateStartDate?: unknown;
    mandateEndDate?: unknown;
    contractCode?: unknown;
    redirectUrl?: unknown;
    debitAmount?: unknown;
    autoRenew?: unknown;
    customerCancellation?: unknown;
}>;
export declare const GetMandateStatusInputSchema: z.ZodObject<{
    mandateReferences: z.ZodString;
}, "strip", z.ZodTypeAny, {
    mandateReferences: string;
}, {
    mandateReferences: string;
}>;
export declare const DebitMandateInputSchema: z.ZodObject<{
    [x: string]: z.ZodTypeAny;
} & {
    paymentReference: z.ZodString;
    mandateCode: z.ZodString;
    debitAmount: z.ZodNumber;
    narration: z.ZodString;
    customerEmail: z.ZodString;
    incomeSplitConfig: z.ZodOptional<z.ZodArray<z.ZodObject<{
        subAccountCode: z.ZodOptional<z.ZodString>;
        feePercentage: z.ZodOptional<z.ZodNumber>;
        splitAmount: z.ZodOptional<z.ZodNumber>;
        splitPercentage: z.ZodOptional<z.ZodNumber>;
        feeBearer: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        subAccountCode?: string | undefined;
        feePercentage?: number | undefined;
        splitAmount?: number | undefined;
        splitPercentage?: number | undefined;
        feeBearer?: boolean | undefined;
    }, {
        subAccountCode?: string | undefined;
        feePercentage?: number | undefined;
        splitAmount?: number | undefined;
        splitPercentage?: number | undefined;
        feeBearer?: boolean | undefined;
    }>, "many">>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    [x: string]: any;
    paymentReference?: unknown;
    mandateCode?: unknown;
    debitAmount?: unknown;
    narration?: unknown;
    customerEmail?: unknown;
    incomeSplitConfig?: unknown;
}, {
    [x: string]: any;
    paymentReference?: unknown;
    mandateCode?: unknown;
    debitAmount?: unknown;
    narration?: unknown;
    customerEmail?: unknown;
    incomeSplitConfig?: unknown;
}>;
export declare const GetMandateDebitStatusInputSchema: z.ZodObject<{
    paymentReference: z.ZodString;
}, "strip", z.ZodTypeAny, {
    paymentReference: string;
}, {
    paymentReference: string;
}>;
export declare const CancelMandateInputSchema: z.ZodObject<{
    mandateCode: z.ZodString;
}, "strip", z.ZodTypeAny, {
    mandateCode: string;
}, {
    mandateCode: string;
}>;
//# sourceMappingURL=directDebit.d.ts.map