import { z } from "zod";
type AnyZodObject = z.ZodObject<z.ZodRawShape>;
export declare const InitiatePaymentBodySchema: AnyZodObject;
export declare const ReserveAccountBodySchema: AnyZodObject;
export declare const CreateInvoiceBodySchema: AnyZodObject;
export declare const ProcessRefundBodySchema: AnyZodObject;
export declare const ChargeCardBodySchema: AnyZodObject;
export declare const AuthoriseCardOtpBodySchema: AnyZodObject;
export declare const AuthoriseCard3dsBodySchema: AnyZodObject;
export declare const CreateMandateBodySchema: AnyZodObject;
export declare const DebitMandateBodySchema: AnyZodObject;
export declare const VerifyBvnBodySchema: AnyZodObject;
export declare const CancelMandateBodySchema: z.ZodObject<{
    mandateReference: z.ZodString;
    cancellationReason: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    mandateReference: z.ZodString;
    cancellationReason: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    mandateReference: z.ZodString;
    cancellationReason: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
export {};
//# sourceMappingURL=compat.d.ts.map