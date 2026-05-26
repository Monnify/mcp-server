import { z } from "zod";
import { schemas as _s } from "./generated.js";
const s = _s;
export const InitiatePaymentBodySchema = s["InitializeTransactionRequest"];
export const ReserveAccountBodySchema = s["CreateReservedAccountRequest"];
export const CreateInvoiceBodySchema = s["CreateInvoiceRequest"];
export const ProcessRefundBodySchema = s["InitiateRefundRequest"];
export const ChargeCardBodySchema = s["ChargeRequest"];
export const AuthoriseCardOtpBodySchema = s["AuthorizeOTPRequest"];
export const AuthoriseCard3dsBodySchema = s["Authorize3DSCardRequest"];
export const CreateMandateBodySchema = s["CreateMandateRequest"];
export const DebitMandateBodySchema = s["DebitMandateRequest"];
export const VerifyBvnBodySchema = s["BVNVerificationRequest"];
export const CancelMandateBodySchema = z
    .object({
    mandateReference: z.string().min(1),
    cancellationReason: z.string().optional(),
})
    .passthrough();
//# sourceMappingURL=compat.js.map