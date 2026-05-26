import { z } from "zod";
export declare const InitiatePaymentInputSchema: z.ZodObject<{
    [x: string]: z.ZodTypeAny;
} & {
    amount: z.ZodNumber;
    customerEmail: z.ZodString;
    customerName: z.ZodString;
    paymentReference: z.ZodString;
    paymentDescription: z.ZodString;
    currencyCode: z.ZodDefault<z.ZodEnum<["NGN"]>>;
    contractCode: z.ZodString;
    redirectUrl: z.ZodOptional<z.ZodString>;
    paymentMethods: z.ZodOptional<z.ZodArray<z.ZodEnum<["CARD", "ACCOUNT_TRANSFER", "USSD", "PHONE_NUMBER"]>, "many">>;
    incomeSplitConfig: z.ZodOptional<z.ZodArray<z.ZodObject<{
        subAccountCode: z.ZodOptional<z.ZodString>;
        feePercentage: z.ZodOptional<z.ZodNumber>;
        splitPercentage: z.ZodOptional<z.ZodNumber>;
        splitAmount: z.ZodOptional<z.ZodNumber>;
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
    amount?: unknown;
    customerEmail?: unknown;
    customerName?: unknown;
    paymentReference?: unknown;
    paymentDescription?: unknown;
    currencyCode?: unknown;
    contractCode?: unknown;
    redirectUrl?: unknown;
    paymentMethods?: unknown;
    incomeSplitConfig?: unknown;
}, {
    [x: string]: any;
    amount?: unknown;
    customerEmail?: unknown;
    customerName?: unknown;
    paymentReference?: unknown;
    paymentDescription?: unknown;
    currencyCode?: unknown;
    contractCode?: unknown;
    redirectUrl?: unknown;
    paymentMethods?: unknown;
    incomeSplitConfig?: unknown;
}>;
export declare const ReserveAccountInputSchema: z.ZodObject<{
    [x: string]: z.ZodTypeAny;
} & {
    accountReference: z.ZodString;
    accountName: z.ZodString;
    contractCode: z.ZodString;
    customerEmail: z.ZodString;
    customerName: z.ZodString;
    currencyCode: z.ZodDefault<z.ZodEnum<["NGN"]>>;
    bvn: z.ZodString;
    getAllAvailableBanks: z.ZodBoolean;
    preferredBanks: z.ZodArray<z.ZodString, "many">;
    nin: z.ZodOptional<z.ZodString>;
    restrictPaymentSource: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    allowedPaymentSources: z.ZodOptional<z.ZodObject<{
        bvns: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        bankAccounts: z.ZodOptional<z.ZodArray<z.ZodObject<{
            accountNumber: z.ZodOptional<z.ZodString>;
            bankCode: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            accountNumber?: string | undefined;
            bankCode?: string | undefined;
        }, {
            accountNumber?: string | undefined;
            bankCode?: string | undefined;
        }>, "many">>;
        accountNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        bvns?: string[] | undefined;
        bankAccounts?: {
            accountNumber?: string | undefined;
            bankCode?: string | undefined;
        }[] | undefined;
        accountNames?: string[] | undefined;
    }, {
        bvns?: string[] | undefined;
        bankAccounts?: {
            accountNumber?: string | undefined;
            bankCode?: string | undefined;
        }[] | undefined;
        accountNames?: string[] | undefined;
    }>>;
    incomeSplitConfig: z.ZodOptional<z.ZodArray<z.ZodObject<{
        subAccountCode: z.ZodOptional<z.ZodString>;
        feePercentage: z.ZodOptional<z.ZodNumber>;
        splitPercentage: z.ZodOptional<z.ZodNumber>;
        feeBearer: z.ZodOptional<z.ZodBoolean>;
        splitAmount: z.ZodOptional<z.ZodNumber>;
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
    accountReference?: unknown;
    accountName?: unknown;
    contractCode?: unknown;
    customerEmail?: unknown;
    customerName?: unknown;
    currencyCode?: unknown;
    bvn?: unknown;
    getAllAvailableBanks?: unknown;
    preferredBanks?: unknown;
    nin?: unknown;
    restrictPaymentSource?: unknown;
    allowedPaymentSources?: unknown;
    incomeSplitConfig?: unknown;
}, {
    [x: string]: any;
    accountReference?: unknown;
    accountName?: unknown;
    contractCode?: unknown;
    customerEmail?: unknown;
    customerName?: unknown;
    currencyCode?: unknown;
    bvn?: unknown;
    getAllAvailableBanks?: unknown;
    preferredBanks?: unknown;
    nin?: unknown;
    restrictPaymentSource?: unknown;
    allowedPaymentSources?: unknown;
    incomeSplitConfig?: unknown;
}>;
export declare const GetTransactionStatusInputSchema: z.ZodObject<{
    paymentReference: z.ZodString;
    transactionReference: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    paymentReference: string;
    transactionReference?: string | undefined;
}, {
    paymentReference: string;
    transactionReference?: string | undefined;
}>;
export declare const CreateInvoiceInputSchema: z.ZodObject<{
    [x: string]: z.ZodTypeAny;
} & {
    amount: z.ZodNumber;
    invoiceReference: z.ZodString;
    description: z.ZodString;
    contractCode: z.ZodString;
    customerEmail: z.ZodString;
    customerName: z.ZodString;
    currencyCode: z.ZodDefault<z.ZodEnum<["NGN"]>>;
    expiryDate: z.ZodString;
    paymentMethods: z.ZodOptional<z.ZodArray<z.ZodEnum<["CARD", "ACCOUNT_TRANSFER", "USSD", "PHONE_NUMBER"]>, "many">>;
    redirectUrl: z.ZodOptional<z.ZodString>;
    accountReference: z.ZodOptional<z.ZodString>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    [x: string]: any;
    amount?: unknown;
    invoiceReference?: unknown;
    description?: unknown;
    contractCode?: unknown;
    customerEmail?: unknown;
    customerName?: unknown;
    currencyCode?: unknown;
    expiryDate?: unknown;
    paymentMethods?: unknown;
    redirectUrl?: unknown;
    accountReference?: unknown;
}, {
    [x: string]: any;
    amount?: unknown;
    invoiceReference?: unknown;
    description?: unknown;
    contractCode?: unknown;
    customerEmail?: unknown;
    customerName?: unknown;
    currencyCode?: unknown;
    expiryDate?: unknown;
    paymentMethods?: unknown;
    redirectUrl?: unknown;
    accountReference?: unknown;
}>;
export declare const ChargeCardInputSchema: z.ZodObject<{
    [x: string]: z.ZodTypeAny;
} & {
    transactionReference: z.ZodString;
    collectionChannel: z.ZodDefault<z.ZodString>;
    card: z.ZodObject<{
        number: z.ZodString;
        expiryMonth: z.ZodString;
        expiryYear: z.ZodString;
        pin: z.ZodString;
        cvv: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        number: string;
        expiryMonth: string;
        expiryYear: string;
        pin: string;
        cvv: string;
    }, {
        number: string;
        expiryMonth: string;
        expiryYear: string;
        pin: string;
        cvv: string;
    }>;
    deviceInformation: z.ZodObject<{
        httpBrowserLanguage: z.ZodString;
        httpBrowserJavaEnabled: z.ZodBoolean;
        httpBrowserJavaScriptEnabled: z.ZodBoolean;
        httpBrowserColorDepth: z.ZodNumber;
        httpBrowserScreenHeight: z.ZodNumber;
        httpBrowserScreenWidth: z.ZodNumber;
        httpBrowserTimeDifference: z.ZodString;
        userAgentBrowserValue: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        httpBrowserLanguage: string;
        httpBrowserJavaEnabled: boolean;
        httpBrowserJavaScriptEnabled: boolean;
        httpBrowserColorDepth: number;
        httpBrowserScreenHeight: number;
        httpBrowserScreenWidth: number;
        httpBrowserTimeDifference: string;
        userAgentBrowserValue: string;
    }, {
        httpBrowserLanguage: string;
        httpBrowserJavaEnabled: boolean;
        httpBrowserJavaScriptEnabled: boolean;
        httpBrowserColorDepth: number;
        httpBrowserScreenHeight: number;
        httpBrowserScreenWidth: number;
        httpBrowserTimeDifference: string;
        userAgentBrowserValue: string;
    }>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    [x: string]: any;
    transactionReference?: unknown;
    collectionChannel?: unknown;
    card?: unknown;
    deviceInformation?: unknown;
}, {
    [x: string]: any;
    transactionReference?: unknown;
    collectionChannel?: unknown;
    card?: unknown;
    deviceInformation?: unknown;
}>;
export declare const AuthoriseCardOtpInputSchema: z.ZodObject<{
    [x: string]: z.ZodTypeAny;
} & {
    transactionReference: z.ZodString;
    tokenId: z.ZodString;
    token: z.ZodString;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    [x: string]: any;
    transactionReference?: unknown;
    tokenId?: unknown;
    token?: unknown;
}, {
    [x: string]: any;
    transactionReference?: unknown;
    tokenId?: unknown;
    token?: unknown;
}>;
export declare const AuthoriseCard3dsInputSchema: z.ZodObject<{
    [x: string]: z.ZodTypeAny;
} & {
    transactionReference: z.ZodString;
    apiKey: z.ZodString;
    card: z.ZodOptional<z.ZodObject<{
        number: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
        expiryMonth: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
        expiryYear: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
        cvv: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
        pin: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    }, "strip", z.ZodTypeAny, {
        number: string | number;
        expiryMonth: string | number;
        expiryYear: string | number;
        pin: string | number;
        cvv: string | number;
    }, {
        number: string | number;
        expiryMonth: string | number;
        expiryYear: string | number;
        pin: string | number;
        cvv: string | number;
    }>>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    [x: string]: any;
    transactionReference?: unknown;
    apiKey?: unknown;
    card?: unknown;
}, {
    [x: string]: any;
    transactionReference?: unknown;
    apiKey?: unknown;
    card?: unknown;
}>;
export declare const PayWithBankTransferInputSchema: z.ZodObject<{
    transactionReference: z.ZodString;
    bankCode: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    transactionReference: string;
    bankCode?: string | undefined;
}, {
    transactionReference: string;
    bankCode?: string | undefined;
}>;
export declare const ChargeCardTokenInputSchema: z.ZodObject<{
    cardToken: z.ZodString;
    amount: z.ZodNumber;
    customerEmail: z.ZodString;
    paymentReference: z.ZodString;
    contractCode: z.ZodString;
    apiKey: z.ZodString;
    customerName: z.ZodOptional<z.ZodString>;
    paymentDescription: z.ZodOptional<z.ZodString>;
    currencyCode: z.ZodDefault<z.ZodEnum<["NGN"]>>;
    metaData: z.ZodOptional<z.ZodObject<{
        ipAddress: z.ZodOptional<z.ZodString>;
        deviceType: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        ipAddress?: string | undefined;
        deviceType?: string | undefined;
    }, {
        ipAddress?: string | undefined;
        deviceType?: string | undefined;
    }>>;
    incomeSplitConfig: z.ZodOptional<z.ZodArray<z.ZodObject<{
        subAccountCode: z.ZodOptional<z.ZodString>;
        feePercentage: z.ZodOptional<z.ZodNumber>;
        splitPercentage: z.ZodOptional<z.ZodNumber>;
        splitAmount: z.ZodOptional<z.ZodNumber>;
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
}, "strip", z.ZodTypeAny, {
    apiKey: string;
    paymentReference: string;
    currencyCode: "NGN";
    contractCode: string;
    customerEmail: string;
    amount: number;
    cardToken: string;
    customerName?: string | undefined;
    paymentDescription?: string | undefined;
    incomeSplitConfig?: {
        subAccountCode?: string | undefined;
        feePercentage?: number | undefined;
        splitAmount?: number | undefined;
        splitPercentage?: number | undefined;
        feeBearer?: boolean | undefined;
    }[] | undefined;
    metaData?: {
        ipAddress?: string | undefined;
        deviceType?: string | undefined;
    } | undefined;
}, {
    apiKey: string;
    paymentReference: string;
    contractCode: string;
    customerEmail: string;
    amount: number;
    cardToken: string;
    currencyCode?: "NGN" | undefined;
    customerName?: string | undefined;
    paymentDescription?: string | undefined;
    incomeSplitConfig?: {
        subAccountCode?: string | undefined;
        feePercentage?: number | undefined;
        splitAmount?: number | undefined;
        splitPercentage?: number | undefined;
        feeBearer?: boolean | undefined;
    }[] | undefined;
    metaData?: {
        ipAddress?: string | undefined;
        deviceType?: string | undefined;
    } | undefined;
}>;
export declare const ProcessRefundInputSchema: z.ZodObject<{
    [x: string]: z.ZodTypeAny;
} & {
    transactionReference: z.ZodString;
    refundReference: z.ZodString;
    refundAmount: z.ZodNumber;
    refundReason: z.ZodEnum<["CUSTOMER_REQUEST", "ORDER_CANCELLATION", "SUSPICIOUS_TRANSACTION", "DUPLICATE_CHARGE", "OTHERS"]>;
    customerNote: z.ZodString;
    destinationAccountNumber: z.ZodOptional<z.ZodString>;
    destinationAccountBankCode: z.ZodOptional<z.ZodString>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    [x: string]: any;
    transactionReference?: unknown;
    refundReference?: unknown;
    refundAmount?: unknown;
    refundReason?: unknown;
    customerNote?: unknown;
    destinationAccountNumber?: unknown;
    destinationAccountBankCode?: unknown;
}, {
    [x: string]: any;
    transactionReference?: unknown;
    refundReference?: unknown;
    refundAmount?: unknown;
    refundReason?: unknown;
    customerNote?: unknown;
    destinationAccountNumber?: unknown;
    destinationAccountBankCode?: unknown;
}>;
//# sourceMappingURL=collections.d.ts.map