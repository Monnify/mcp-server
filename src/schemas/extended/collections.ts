import { z } from "zod";
import {
  InitiatePaymentBodySchema,
  ReserveAccountBodySchema,
  CreateInvoiceBodySchema,
  ProcessRefundBodySchema,
  ChargeCardBodySchema,
  AuthoriseCardOtpBodySchema,
  AuthoriseCard3dsBodySchema,
} from "../compat.js";

export const InitiatePaymentInputSchema = InitiatePaymentBodySchema.extend({
  amount: z
    .number()
    .positive()
    .describe("Payment amount in Naira (NGN). Must be a positive number."),
  customerEmail: z
    .string()
    .email()
    .describe("Email address of the customer initiating the payment."),
  customerName: z.string().min(1).describe("Full name of the customer."),
  paymentReference: z
    .string()
    .min(1)
    .max(64)
    .describe(
      "Your unique idempotency reference for this payment. Reusing the same reference safely deduplicates retries."
    ),
  paymentDescription: z
    .string()
    .max(100)
    .describe(
      "Human-readable description shown to the customer on the payment page."
    ),
  currencyCode: z
    .enum(["NGN"])
    .default("NGN")
    .describe("Currency code — currently only NGN is supported."),
  contractCode: z
    .string()
    .min(1)
    .optional()
    .describe(
      "Your Monnify contract code. Defaults to the contract code supplied at server startup — only override if you need a different contract."
    ),
  redirectUrl: z
    .string()
    .url()
    .optional()
    .describe(
      "URL to redirect the customer to after payment. Must be HTTPS in production."
    ),
  paymentMethods: z
    .array(z.enum(["CARD", "ACCOUNT_TRANSFER", "USSD", "PHONE_NUMBER"]))
    .optional()
    .describe("Allowed payment methods. Omit to allow all available methods."),
  incomeSplitConfig: z
    .array(
      z.object({
        subAccountCode: z
          .string()
          .optional()
          .describe(
            "Monnify sub-account code to receive the split (e.g. 'MFY_SUB_319452883228'). Sub Accounts are disabled by default — email integration-support@monnify.com to enable this feature."
          ),
        feePercentage: z
          .number()
          .optional()
          .describe("Percentage of Monnify's processing fee borne by this sub-account."),
        splitPercentage: z
          .number()
          .optional()
          .describe("Percentage of the payment amount credited to this sub-account."),
        splitAmount: z
          .number()
          .optional()
          .describe("Fixed amount (in Naira) credited to this sub-account per transaction."),
        feeBearer: z
          .boolean()
          .optional()
          .describe("If true, this sub-account bears the Monnify transaction fee."),
      })
    )
    .optional()
    .describe(
      "Income split configuration — distributes the payment across multiple sub-accounts at settlement. Omit to credit the full amount to the primary account."
    ),
});

export const ReserveAccountInputSchema = ReserveAccountBodySchema.extend({
  accountReference: z
    .string()
    .min(1)
    .max(64)
    .describe(
      "Your unique reference for this reserved account. Used for idempotency."
    ),
  accountName: z
    .string()
    .min(1)
    .describe("Display name for the reserved account."),
  contractCode: z.string().min(1).optional().describe("Your Monnify contract code. Defaults to the contract code supplied at server startup."),
  customerEmail: z.string().email().describe("Customer email address."),
  customerName: z.string().min(1).describe("Full name of the customer."),
  currencyCode: z
    .enum(["NGN"])
    .default("NGN")
    .describe("Currency code — currently only NGN is supported."),
  bvn: z
    .string()
    .regex(/^\d{11}$/, "BVN must be exactly 11 digits")
    .describe(
      "Customer's 11-digit Bank Verification Number (BVN) issued by the Central Bank of Nigeria. Required for KYC compliance."
    ),
  getAllAvailableBanks: z
    .boolean()
    .describe(
      "If true, Monnify returns virtual account numbers across all available banking partners. Set to false to restrict to preferredBanks only."
    ),
  preferredBanks: z
    .array(z.string())
    .describe(
      "Array of bank codes for the preferred virtual account banks (e.g. ['50515'] for Moniepoint MFB). Required even when getAllAvailableBanks is true — used as the fallback/priority set."
    ),
  nin: z
    .string()
    .regex(/^\d{11}$/, "NIN must be exactly 11 digits")
    .optional()
    .describe(
      "Customer's 11-digit National Identification Number (NIN) issued by NIMC. Optional but recommended for enhanced KYC."
    ),
  restrictPaymentSource: z
    .boolean()
    .optional()
    .default(true)
    .describe(
      "If true (default), only BVNs/accounts listed in allowedPaymentSources can fund this account. Set to false to allow payments from any source."
    ),
  allowedPaymentSources: z
    .object({
      bvns: z
        .array(z.string())
        .optional()
        .describe("List of BVNs allowed to fund this account."),
      bankAccounts: z
        .array(
          z.object({
            accountNumber: z.string().optional().describe("10-digit NUBAN account number."),
            bankCode: z.string().optional().describe("3-digit bank code."),
          })
        )
        .optional()
        .describe("List of specific bank accounts allowed to fund this account."),
      accountNames: z
        .array(z.string())
        .optional()
        .describe("List of account names allowed to fund this account."),
    })
    .optional()
    .describe(
      "Whitelist of payers allowed to fund this reserved account. Only enforced when restrictPaymentSource is true."
    ),
  incomeSplitConfig: z
    .array(
      z.object({
        subAccountCode: z
          .string()
          .optional()
          .describe(
            "Monnify sub-account code to receive the split (e.g. 'MFY_SUB_319452883228'). Sub Accounts are disabled by default — email integration-support@monnify.com to enable this feature."
          ),
        feePercentage: z
          .number()
          .optional()
          .describe("Percentage of Monnify's processing fee borne by this sub-account."),
        splitPercentage: z
          .number()
          .optional()
          .describe("Percentage of the received amount credited to this sub-account."),
        feeBearer: z
          .boolean()
          .optional()
          .describe("If true, this sub-account bears the transaction fee."),
        splitAmount: z
          .number()
          .optional()
          .describe("Fixed amount (in Naira) credited to this sub-account per transaction."),
      })
    )
    .optional()
    .describe(
      "Income split configuration — distributes received payments across multiple sub-accounts. Omit to credit the full amount to the primary account."
    ),
});

export const GetTransactionStatusInputSchema = z.object({
  paymentReference: z
    .string()
    .min(1)
    .describe("The payment reference used when the transaction was initiated."),
  transactionReference: z
    .string()
    .optional()
    .describe(
      "Monnify's transaction reference. Provide either this or paymentReference."
    ),
});

export const CreateInvoiceInputSchema = CreateInvoiceBodySchema.extend({
  amount: z.number().positive().describe("Invoice amount in Naira (NGN)."),
  invoiceReference: z
    .string()
    .min(1)
    .max(64)
    .describe("Your unique reference for this invoice. Used for idempotency."),
  description: z
    .string()
    .max(100)
    .describe("Description of the invoice — shown to the customer."),
  contractCode: z.string().min(1).optional().describe("Your Monnify contract code. Defaults to the contract code supplied at server startup."),
  customerEmail: z.string().email().describe("Customer email address."),
  customerName: z.string().min(1).describe("Full name of the customer."),
  currencyCode: z
    .enum(["NGN"])
    .default("NGN")
    .describe("Currency code — currently only NGN is supported."),
  expiryDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
      "expiryDate must be in 'YYYY-MM-DD HH:mm:ss' format (space-separated, not ISO 8601 — e.g. '2024-12-19 10:15:30')"
    )
    .describe(
      "Invoice expiry date in 'YYYY-MM-DD HH:mm:ss' format (space-separated — NOT ISO 8601, e.g. '2024-12-19 10:15:30'). After this date the invoice can no longer be paid."
    ),
  paymentMethods: z
    .array(z.enum(["CARD", "ACCOUNT_TRANSFER", "USSD", "PHONE_NUMBER"]))
    .optional()
    .describe("Allowed payment methods. Omit to allow all available methods."),
  redirectUrl: z
    .string()
    .url()
    .optional()
    .describe("URL to redirect the customer to after payment. Must be HTTPS in production."),
  accountReference: z
    .string()
    .optional()
    .describe(
      "Your unique reference for the reserved account linked to this invoice. Required when creating a Static Invoice (one that reuses a reserved account)."
    ),
});

export const ChargeCardInputSchema = ChargeCardBodySchema.extend({
  transactionReference: z
    .string()
    .min(1)
    .describe(
      "Monnify transaction reference from monnify_initiate_payment. Links this card charge to the pending transaction."
    ),
  collectionChannel: z
    .string()
    .default("API_NOTIFICATION")
    .describe(
      "Collection channel. Defaults to API_NOTIFICATION for direct card charges."
    ),
  card: z.object({
    number: z
      .string()
      .regex(/^\d{16}$/, "Card number must be exactly 16 digits")
      .describe("16-digit card number. Handle with care — never log or store."),
    expiryMonth: z
      .string()
      .regex(/^(0[1-9]|1[0-2])$/, "Expiry month must be MM format (01–12)")
      .describe(
        "Card expiry month in 2-digit format (e.g. '09' for September)."
      ),
    expiryYear: z
      .string()
      .regex(/^\d{4}$/, "Expiry year must be 4-digit YYYY format")
      .describe("Card expiry year in 4-digit format (e.g. '2028')."),
    pin: z
      .string()
      .regex(/^\d{4}$/, "PIN must be exactly 4 digits")
      .describe(
        "4-digit card PIN. Required for Nigerian-issued cards. Transmit only over TLS — never log."
      ),
    cvv: z
      .string()
      .regex(/^\d{3}$/, "CVV must be 3 digits")
      .describe(
        "3-digit card CVV on the back of the card. Never log or store."
      ),
  }),
  deviceInformation: z.object({
    httpBrowserLanguage: z
      .string()
      .describe("Browser language (e.g. 'en-US')."),
    httpBrowserJavaEnabled: z
      .boolean()
      .describe("Whether Java is enabled in the browser."),
    httpBrowserJavaScriptEnabled: z
      .boolean()
      .describe("Whether JavaScript is enabled in the browser."),
    httpBrowserColorDepth: z
      .number()
      .int()
      .describe("Browser screen colour depth in bits (e.g. 24)."),
    httpBrowserScreenHeight: z
      .number()
      .int()
      .describe("Browser screen height in pixels (e.g. 900)."),
    httpBrowserScreenWidth: z
      .number()
      .int()
      .describe("Browser screen width in pixels (e.g. 1440)."),
    httpBrowserTimeDifference: z
      .string()
      .describe(
        "UTC offset of the browser's timezone (e.g. '-60'). Pass empty string if unknown."
      ),
    userAgentBrowserValue: z
      .string()
      .describe("Full browser User-Agent string from the customer's browser."),
  }),
});

export const AuthoriseCardOtpInputSchema = AuthoriseCardOtpBodySchema.extend({
  transactionReference: z
    .string()
    .min(1)
    .describe(
      "Monnify transaction reference returned by monnify_charge_card. Must match the transaction awaiting OTP."
    ),
  tokenId: z
    .string()
    .min(1)
    .describe(
      "Token ID returned in the otpData from monnify_charge_card when status is OTP_AUTHORIZATION_REQUIRED."
    ),
  token: z
    .string()
    .min(4)
    .max(8)
    .describe(
      "OTP sent to the customer's registered phone number by their bank. Collect from the customer and pass here."
    ),
});

export const AuthoriseCard3dsInputSchema = AuthoriseCard3dsBodySchema.extend({
  transactionReference: z
    .string()
    .min(1)
    .describe(
      "Monnify transaction reference returned by monnify_charge_card when status is THREE_DS_TRANSACTION_INITIATED."
    ),
  apiKey: z
    .string()
    .min(1)
    .optional()
    .describe(
      "Your Monnify API key. Defaults to the API key supplied at server startup."
    ),
  card: z
    .object({
      number: z.union([z.string(), z.number()]).describe("Card number."),
      expiryMonth: z
        .union([z.string(), z.number()])
        .describe("Card expiry month."),
      expiryYear: z
        .union([z.string(), z.number()])
        .describe("Card expiry year."),
      cvv: z.union([z.string(), z.number()]).describe("Card CVV."),
      pin: z.union([z.string(), z.number()]).describe("Card PIN."),
    })
    .optional()
    .describe(
      "Card details — only required if not already captured in the initial charge."
    ),
});

export const PayWithBankTransferInputSchema = z.object({
  transactionReference: z
    .string()
    .min(1)
    .describe(
      "Monnify transaction reference returned by monnify_initiate_payment. Required to link this bank transfer to an existing pending transaction."
    ),
  bankCode: z
    .string()
    .length(3)
    .optional()
    .describe(
      "3-digit bank code for USSD string generation (e.g. '058' for GTBank). Optional — omit to let Monnify select the bank. Call monnify_get_supported_banks to retrieve the full list."
    ),
});

export const ChargeCardTokenInputSchema = z.object({
  cardToken: z
    .string()
    .min(1)
    .describe(
      "Card token retrieved from the Get Transaction Status response after a previous successful card charge. Use monnify_get_transaction_status to obtain it."
    ),
  amount: z
    .number()
    .positive()
    .describe("Amount to charge in Naira (NGN). Minimum is ₦20."),
  customerEmail: z
    .string()
    .email()
    .describe(
      "Email address of the customer — must match the email used in the original card charge that produced this token."
    ),
  paymentReference: z
    .string()
    .min(1)
    .max(64)
    .describe("Your unique idempotency reference for this charge. Reusing the same reference safely deduplicates retries."),
  contractCode: z
    .string()
    .min(1)
    .optional()
    .describe("Your Monnify contract code. Defaults to the contract code supplied at server startup."),
  apiKey: z
    .string()
    .min(1)
    .optional()
    .describe("Your Monnify API key. Defaults to the API key supplied at server startup."),
  customerName: z
    .string()
    .optional()
    .describe("Full name of the customer."),
  paymentDescription: z
    .string()
    .max(100)
    .optional()
    .describe("Human-readable description of this payment."),
  currencyCode: z
    .enum(["NGN"])
    .default("NGN")
    .describe("Currency code — currently only NGN is supported."),
  metaData: z
    .object({
      ipAddress: z.string().optional().describe("Customer's IP address (e.g. '127.0.0.1')."),
      deviceType: z.string().optional().describe("Customer's device type (e.g. 'mobile', 'desktop')."),
    })
    .optional()
    .describe("Optional metadata about the customer's device."),
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
        splitPercentage: z.number().optional().describe("Percentage of the amount credited to this sub-account."),
        splitAmount: z.number().optional().describe("Fixed amount credited to this sub-account per transaction."),
        feeBearer: z.boolean().optional().describe("If true, this sub-account bears the transaction fee."),
      })
    )
    .optional()
    .describe("Income split configuration. Omit to credit the full amount to the primary account."),
});

export const ProcessRefundInputSchema = ProcessRefundBodySchema.extend({
  transactionReference: z
    .string()
    .min(1)
    .describe(
      "The Monnify transaction reference of the original payment to refund."
    ),
  refundReference: z
    .string()
    .min(1)
    .max(64)
    .describe(
      "Your unique idempotency reference for this refund. Reusing the same reference is safe and will not create a duplicate refund."
    ),
  refundAmount: z
    .number()
    .positive()
    .describe(
      "Amount to refund in Naira. Cannot exceed the original payment amount."
    ),
  refundReason: z
    .enum([
      "CUSTOMER_REQUEST",
      "ORDER_CANCELLATION",
      "SUSPICIOUS_TRANSACTION",
      "DUPLICATE_CHARGE",
      "OTHERS",
    ])
    .describe("Reason code for the refund."),
  customerNote: z
    .string()
    .max(200)
    .describe("Human-readable note to the customer explaining the refund."),
  destinationAccountNumber: z
    .string()
    .length(10)
    .optional()
    .describe("10-digit NUBAN account number to credit the refund to. Required if refunding to a different account than the original payer."),
  destinationAccountBankCode: z
    .string()
    .length(3)
    .optional()
    .describe(
      "3-digit bank code for the destination account. Required when destinationAccountNumber is provided. Call monnify_get_supported_banks to retrieve."
    ),
});
