import { z } from "zod";
import {
  CreateMandateBodySchema,
  DebitMandateBodySchema,
} from "../compat.js";

export const CreateMandateInputSchema = CreateMandateBodySchema.extend({
  mandateReference: z
    .string()
    .min(1)
    .max(64)
    .describe(
      "Your unique reference for this mandate. Used for idempotency — resubmitting the same reference will not create a duplicate mandate."
    ),
  mandateAmount: z
    .number()
    .positive()
    .describe(
      "Total lifetime amount debitable on this mandate in Naira (NGN)."
    ),
  customerAccountNumber: z
    .string()
    .length(10)
    .describe("10-digit NUBAN account number of the customer to mandate."),
  customerAccountBankCode: z
    .string()
    .length(3)
    .describe(
      "3-digit bank code of the customer's bank. Call monnify_get_supported_banks to retrieve."
    ),
  customerName: z
    .string()
    .min(1)
    .describe(
      "Full name of the customer — must match the bank account holder name."
    ),
  customerEmailAddress: z
    .string()
    .email()
    .describe(
      "Customer email address — Monnify will send mandate notifications here."
    ),
  customerPhoneNumber: z
    .string()
    .describe(
      "Customer phone number in international format e.g. 2348012345678."
    ),
  customerAddress: z
    .string()
    .min(1)
    .describe("Customer's home address (e.g. '123 Example Street, Lagos, Nigeria')."),
  mandateDescription: z
    .string()
    .min(1)
    .describe("Description of what this mandate is for — shown to the customer (e.g. 'Monthly Subscription Fee')."),
  mandateStartDate: z
    .string()
    .describe("Mandate start date in ISO 8601 datetime format (YYYY-MM-DDTHH:mm:ss, e.g. '2024-12-19T10:15:30')."),
  mandateEndDate: z
    .string()
    .describe("Mandate end date in ISO 8601 datetime format (YYYY-MM-DDTHH:mm:ss, e.g. '2025-12-19T10:15:30')."),
  contractCode: z
    .string()
    .min(1)
    .describe("Your Monnify contract code."),
  redirectUrl: z
    .string()
    .url()
    .optional()
    .describe("URL to redirect the customer to after mandate authorisation is completed."),
  debitAmount: z
    .number()
    .positive()
    .nullable()
    .optional()
    .describe("Fixed amount to debit periodically in Naira (NGN). Omit for variable-amount mandates."),
  autoRenew: z
    .boolean()
    .optional()
    .describe("If true, Monnify automatically renews the mandate when it reaches the end date."),
  customerCancellation: z
    .boolean()
    .optional()
    .describe("If true, the customer is allowed to cancel this mandate themselves."),
});

export const GetMandateStatusInputSchema = z.object({
  mandateReferences: z
    .string()
    .min(1)
    .describe("The mandate reference to look up. This is the mandateReference you provided when creating the mandate."),
});

export const DebitMandateInputSchema = DebitMandateBodySchema.extend({
  paymentReference: z
    .string()
    .min(1)
    .max(64)
    .describe(
      "Your unique idempotency reference for this debit. The same reference can be safely resubmitted to check status without double-charging."
    ),
  mandateCode: z
    .string()
    .min(1)
    .describe(
      "Monnify's generated mandate identifier (e.g. 'MTDD|01HY8WMN8JYKDRJC67QPQVS1N0'). Returned in the mandateCode field from monnify_get_mandate_status. The mandate status MUST be ACTIVATED."
    ),
  debitAmount: z
    .number()
    .positive()
    .describe("Amount to debit in Naira (NGN)."),
  narration: z
    .string()
    .max(100)
    .describe("Description of this debit — appears on the customer's bank statement."),
  customerEmail: z
    .string()
    .email()
    .describe("Email address of the customer being debited."),
  incomeSplitConfig: z
    .array(
      z.object({
        subAccountCode: z
          .string()
          .optional()
          .describe(
            "Sub-account code to receive the split. Sub Accounts are disabled by default — email integration-support@monnify.com to enable this feature."
          ),
        feePercentage: z.number().optional().describe("Percentage of the fee borne by this sub-account."),
        splitAmount: z.number().optional().describe("Fixed amount credited to this sub-account per debit."),
        splitPercentage: z.number().optional().describe("Percentage of the debit amount credited to this sub-account."),
        feeBearer: z.boolean().optional().describe("If true, this sub-account bears the transaction fee."),
      })
    )
    .optional()
    .describe("Income split configuration for this debit. Omit to credit the full amount to the primary account."),
});

export const GetMandateDebitStatusInputSchema = z.object({
  paymentReference: z
    .string()
    .min(1)
    .describe("Your unique payment reference used when the debit was initiated (the paymentReference you passed to monnify_debit_mandate)."),
});

export const CancelMandateInputSchema = z.object({
  mandateCode: z
    .string()
    .min(1)
    .describe(
      "Monnify's generated mandate identifier (e.g. 'MTDD|01HY8WMN8JYKDRJC67QPQVS1N0'). Returned in the mandateCode field from monnify_get_mandate_status. This is irreversible — the customer will need a new mandate to authorise future debits."
    ),
});
