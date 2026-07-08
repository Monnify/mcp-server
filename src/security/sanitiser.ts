import type { paths } from "../types/monnify-api.js";

// Collections — whitelisted response fields
const TRANSACTION_STATUS_FIELDS = [
  "transactionReference",
  "paymentReference",
  "amountPaid",
  "totalPayable",
  "settledAmount",
  "paidOn",
  "paymentStatus",
  "currencyCode",
  "paymentMethod",
] as const;

const INITIATE_PAYMENT_FIELDS = [
  "transactionReference",
  "paymentReference",
  "merchantName",
  "redirectUrl",
  "enabledPaymentMethod",
  "checkoutUrl",
] as const;

const RESERVE_ACCOUNT_FIELDS = [
  "contractCode",
  "accountReference",
  "accountName",
  "currencyCode",
  "customerEmail",
  "customerName",
  "accounts",
  "collectionChannel",
  "reservationReference",
  "reservedAccountType",
  "status",
  "createdOn",
] as const;

const INVOICE_FIELDS = [
  "amount",
  "invoiceReference",
  "invoiceStatus",
  "contractCode",
  "customerEmail",
  "customerName",
  "expiryDate",
  "createdOn",
  "checkoutUrl",
  "invoiceUrl",
  "offlinePaymentCode",
] as const;

const CHARGE_CARD_FIELDS = [
  "transactionReference",
  "paymentReference",
  "authorizedAmount",
  "status",
  "message",
  "otpData",
  "secure3dData",
] as const;

const CHARGE_CARD_TOKEN_FIELDS = [
  "transactionReference",
  "paymentReference",
  "amountPaid",
  "totalPayable",
  "settlementAmount",
  "paidOn",
  "paymentStatus",
  "currency",
  "paymentMethod",
] as const;

const AUTHORISE_CARD_OTP_FIELDS = [
  "transactionReference",
  "paymentReference",
  "authorizedAmount",
  "status",
  "message",
] as const;

const AUTHORISE_CARD_3DS_FIELDS = [
  "transactionReference",
  "paymentReference",
  "authorizedAmount",
  "status",
  "redirectUrl",
] as const;

const BANK_TRANSFER_PAYMENT_FIELDS = [
  "transactionReference",
  "accountNumber",
  "accountName",
  "bankName",
  "bankCode",
  "expiryDate",
  "amount",
  "fee",
  "totalPayableFee",
] as const;

const REFUND_FIELDS = [
  "transactionReference",
  "refundReference",
  "refundStatus",
  "refundAmount",
  "refundReason",
  "destinationAccountNumber",
  "destinationAccountBankCode",
  "createdOn",
] as const;

// Direct Debit — whitelisted fields
const MANDATE_FIELDS = [
  "mandateReference",
  "mandateCode",
  "mandateStatus",
  "authorizationLink",
  "startDate",
  "endDate",
  "mandateAmount",
] as const;

const MANDATE_STATUS_FIELDS = [
  "mandateReference",
  "mandateCode",
  "mandateStatus",
  "mandateAmount",
  "customerName",
  "customerAccountNumber",
  "startDate",
  "endDate",
  "authorizationLink",
] as const;

const DEBIT_STATUS_FIELDS = [
  "debitReference",
  "mandateReference",
  "debitStatus",
  "amount",
  "debitDate",
] as const;

const CANCEL_MANDATE_FIELDS = ["mandateReference", "mandateStatus"] as const;

// Verification — whitelisted fields
const BANK_ACCOUNT_FIELDS = [
  "accountNumber",
  "accountName",
  "bankCode",
  "bankName",
] as const;

const BVN_FIELDS = [
  "bvn",
  "nameMatch",
  "mobileNoMatch",
  "dateOfBirthMatch",
] as const;


const BVN_INFO_FIELDS = [
  "bvn",
  "name",
  "dateOfBirth",
  "mobileNo",
  "bvnInformationMatch",
] as const;

const NIN_FIELDS = [
  "nin",
  "firstName",
  "lastName",
  "dateOfBirth",
  "gender",
  "phoneNumber",
  "ninInformationMatch",
] as const;

// Reserved account management — whitelisted fields
const RESERVED_ACCOUNT_DETAILS_FIELDS = [
  "contractCode",
  "accountReference",
  "accountName",
  "currencyCode",
  "customerEmail",
  "customerName",
  "accounts",
  "collectionChannel",
  "reservationReference",
  "reservedAccountType",
  "status",
  "createdOn",
  "restrictPaymentSource",
] as const;

const RESERVED_ACCOUNT_TRANSACTION_FIELDS = [
  "transactionReference",
  "paymentReference",
  "amountPaid",
  "totalPayable",
  "paymentStatus",
  "paidOn",
  "paymentMethod",
  "currencyCode",
] as const;

const DEALLOCATE_ACCOUNT_FIELDS = [
  "accountReference",
  "accountName",
  "status",
] as const;

// Sub Accounts — whitelisted fields
const SUB_ACCOUNT_FIELDS = [
  "subAccountCode",
  "accountNumber",
  "accountName",
  "currencyCode",
  "email",
  "bankCode",
  "bankName",
  "defaultSplitPercentage",
  "settlementProfileCode",
] as const;

// Bank list — whitelisted fields
const BANK_FIELDS = ["name", "code"] as const;

function pickFields<T extends string>(
  raw: Record<string, unknown>,
  fields: readonly T[]
): Record<T, unknown> {
  const result = {} as Record<T, unknown>;
  for (const field of fields) {
    if (field in raw && raw[field] !== undefined && raw[field] !== null) {
      result[field] = raw[field];
    }
  }
  return result;
}

export function sanitiseInitiatePaymentResponse(
  raw: Record<string, unknown>
): Record<(typeof INITIATE_PAYMENT_FIELDS)[number], unknown> {
  return pickFields(raw, INITIATE_PAYMENT_FIELDS);
}

export function sanitiseTransactionStatusResponse(
  raw: Record<string, unknown>
): Record<(typeof TRANSACTION_STATUS_FIELDS)[number], unknown> {
  return pickFields(raw, TRANSACTION_STATUS_FIELDS);
}

export function sanitiseReserveAccountResponse(
  raw: Record<string, unknown>
): Record<(typeof RESERVE_ACCOUNT_FIELDS)[number], unknown> {
  return pickFields(raw, RESERVE_ACCOUNT_FIELDS);
}

export function sanitiseInvoiceResponse(
  raw: Record<string, unknown>
): Record<(typeof INVOICE_FIELDS)[number], unknown> {
  return pickFields(raw, INVOICE_FIELDS);
}

export function sanitiseChargeCardResponse(
  raw: Record<string, unknown>
): Record<(typeof CHARGE_CARD_FIELDS)[number], unknown> {
  return pickFields(raw, CHARGE_CARD_FIELDS);
}

export function sanitiseChargeCardTokenResponse(
  raw: Record<string, unknown>
): Record<(typeof CHARGE_CARD_TOKEN_FIELDS)[number], unknown> {
  return pickFields(raw, CHARGE_CARD_TOKEN_FIELDS);
}

export function sanitiseAuthoriseCardOtpResponse(
  raw: Record<string, unknown>
): Record<(typeof AUTHORISE_CARD_OTP_FIELDS)[number], unknown> {
  return pickFields(raw, AUTHORISE_CARD_OTP_FIELDS);
}

export function sanitiseAuthoriseCard3dsResponse(
  raw: Record<string, unknown>
): Record<(typeof AUTHORISE_CARD_3DS_FIELDS)[number], unknown> {
  return pickFields(raw, AUTHORISE_CARD_3DS_FIELDS);
}

export function sanitiseBankTransferPaymentResponse(
  raw: Record<string, unknown>
): Record<(typeof BANK_TRANSFER_PAYMENT_FIELDS)[number], unknown> {
  return pickFields(raw, BANK_TRANSFER_PAYMENT_FIELDS);
}

export function sanitiseRefundResponse(
  raw: Record<string, unknown>
): Record<(typeof REFUND_FIELDS)[number], unknown> {
  return pickFields(raw, REFUND_FIELDS);
}

export function sanitiseMandateResponse(
  raw: Record<string, unknown>
): Record<(typeof MANDATE_FIELDS)[number], unknown> {
  return pickFields(raw, MANDATE_FIELDS);
}

export function sanitiseMandateStatusResponse(
  raw: Record<string, unknown>
): Record<(typeof MANDATE_STATUS_FIELDS)[number], unknown> {
  return pickFields(raw, MANDATE_STATUS_FIELDS);
}

export function sanitiseDebitStatusResponse(
  raw: Record<string, unknown>
): Record<(typeof DEBIT_STATUS_FIELDS)[number], unknown> {
  return pickFields(raw, DEBIT_STATUS_FIELDS);
}

export function sanitiseCancelMandateResponse(
  raw: Record<string, unknown>
): Record<(typeof CANCEL_MANDATE_FIELDS)[number], unknown> {
  return pickFields(raw, CANCEL_MANDATE_FIELDS);
}

export function sanitiseBankAccountResponse(
  raw: Record<string, unknown>
): Record<(typeof BANK_ACCOUNT_FIELDS)[number], unknown> {
  return pickFields(raw, BANK_ACCOUNT_FIELDS);
}

export function sanitiseBvnResponse(
  raw: Record<string, unknown>
): Record<(typeof BVN_FIELDS)[number], unknown> {
  return pickFields(raw, BVN_FIELDS);
}

export function sanitiseBvnInfoResponse(
  raw: Record<string, unknown>
): Record<(typeof BVN_INFO_FIELDS)[number], unknown> {
  return pickFields(raw, BVN_INFO_FIELDS);
}

export function sanitiseNinResponse(
  raw: Record<string, unknown>
): Record<(typeof NIN_FIELDS)[number], unknown> {
  return pickFields(raw, NIN_FIELDS);
}

export function sanitiseSubAccountResponse(
  raw: Record<string, unknown>
): Record<(typeof SUB_ACCOUNT_FIELDS)[number], unknown> {
  return pickFields(raw, SUB_ACCOUNT_FIELDS);
}

export function sanitiseSubAccountListResponse(
  raw: Array<Record<string, unknown>>
): Array<Record<(typeof SUB_ACCOUNT_FIELDS)[number], unknown>> {
  return raw.map((account) => pickFields(account, SUB_ACCOUNT_FIELDS));
}

export function sanitiseBankListResponse(
  raw: Array<Record<string, unknown>>
): Array<Record<(typeof BANK_FIELDS)[number], unknown>> {
  return raw.map((bank) => pickFields(bank, BANK_FIELDS));
}

export function sanitiseReservedAccountDetailsResponse(
  raw: Record<string, unknown>
): Record<(typeof RESERVED_ACCOUNT_DETAILS_FIELDS)[number], unknown> {
  return pickFields(raw, RESERVED_ACCOUNT_DETAILS_FIELDS);
}

export function sanitiseReservedAccountTransactionsResponse(
  raw: Array<Record<string, unknown>>
): Array<Record<(typeof RESERVED_ACCOUNT_TRANSACTION_FIELDS)[number], unknown>> {
  return raw.map((tx) => pickFields(tx, RESERVED_ACCOUNT_TRANSACTION_FIELDS));
}

export function sanitiseDeallocateAccountResponse(
  raw: Record<string, unknown>
): Record<(typeof DEALLOCATE_ACCOUNT_FIELDS)[number], unknown> {
  return pickFields(raw, DEALLOCATE_ACCOUNT_FIELDS);
}
