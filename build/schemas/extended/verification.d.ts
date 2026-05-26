import { z } from "zod";
export declare const VerifyBankAccountInputSchema: z.ZodObject<{
    accountNumber: z.ZodString;
    bankCode: z.ZodString;
}, "strip", z.ZodTypeAny, {
    accountNumber: string;
    bankCode: string;
}, {
    accountNumber: string;
    bankCode: string;
}>;
export declare const VerifyBvnInputSchema: z.ZodObject<{
    [x: string]: z.ZodTypeAny;
} & {
    bvn: z.ZodString;
    name: z.ZodString;
    dateOfBirth: z.ZodString;
    mobileNo: z.ZodString;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    [x: string]: any;
    bvn?: unknown;
    name?: unknown;
    dateOfBirth?: unknown;
    mobileNo?: unknown;
}, {
    [x: string]: any;
    bvn?: unknown;
    name?: unknown;
    dateOfBirth?: unknown;
    mobileNo?: unknown;
}>;
export declare const VerifyBvnInfoInputSchema: z.ZodObject<{
    bvn: z.ZodString;
    name: z.ZodString;
    dateOfBirth: z.ZodString;
    mobileNo: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    bvn: string;
    dateOfBirth: string;
    mobileNo: string;
}, {
    name: string;
    bvn: string;
    dateOfBirth: string;
    mobileNo: string;
}>;
export declare const VerifyNinInputSchema: z.ZodObject<{
    nin: z.ZodString;
}, "strip", z.ZodTypeAny, {
    nin: string;
}, {
    nin: string;
}>;
//# sourceMappingURL=verification.d.ts.map