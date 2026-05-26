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
];
const INITIATE_PAYMENT_FIELDS = [
    "transactionReference",
    "paymentReference",
    "merchantName",
    "redirectUrl",
    "enabledPaymentMethod",
    "checkoutUrl",
];
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
];
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
];
const CHARGE_CARD_FIELDS = [
    "transactionReference",
    "paymentReference",
    "authorizedAmount",
    "status",
    "message",
    "otpData",
    "secure3dData",
];
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
];
const AUTHORISE_CARD_OTP_FIELDS = [
    "transactionReference",
    "paymentReference",
    "authorizedAmount",
    "status",
    "message",
];
const AUTHORISE_CARD_3DS_FIELDS = [
    "transactionReference",
    "paymentReference",
    "authorizedAmount",
    "status",
    "redirectUrl",
];
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
];
const REFUND_FIELDS = [
    "transactionReference",
    "refundReference",
    "refundStatus",
    "refundAmount",
    "refundReason",
    "destinationAccountNumber",
    "destinationAccountBankCode",
    "createdOn",
];
// Direct Debit — whitelisted fields
const MANDATE_FIELDS = [
    "mandateReference",
    "mandateCode",
    "mandateStatus",
    "authorizationLink",
    "startDate",
    "endDate",
    "mandateAmount",
];
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
];
const DEBIT_STATUS_FIELDS = [
    "debitReference",
    "mandateReference",
    "debitStatus",
    "amount",
    "debitDate",
];
const CANCEL_MANDATE_FIELDS = ["mandateReference", "mandateStatus"];
// Verification — whitelisted fields
const BANK_ACCOUNT_FIELDS = [
    "accountNumber",
    "accountName",
    "bankCode",
    "bankName",
];
const BVN_FIELDS = [
    "bvn",
    "nameMatch",
    "mobileNoMatch",
    "dateOfBirthMatch",
];
const BVN_INFO_FIELDS = [
    "bvn",
    "name",
    "dateOfBirth",
    "mobileNo",
    "bvnInformationMatch",
];
const NIN_FIELDS = [
    "nin",
    "firstName",
    "lastName",
    "dateOfBirth",
    "gender",
    "phoneNumber",
    "ninInformationMatch",
];
// Bank list — whitelisted fields
const BANK_FIELDS = ["name", "code"];
function pickFields(raw, fields) {
    const result = {};
    for (const field of fields) {
        if (field in raw && raw[field] !== undefined && raw[field] !== null) {
            result[field] = raw[field];
        }
    }
    return result;
}
export function sanitiseInitiatePaymentResponse(raw) {
    return pickFields(raw, INITIATE_PAYMENT_FIELDS);
}
export function sanitiseTransactionStatusResponse(raw) {
    return pickFields(raw, TRANSACTION_STATUS_FIELDS);
}
export function sanitiseReserveAccountResponse(raw) {
    return pickFields(raw, RESERVE_ACCOUNT_FIELDS);
}
export function sanitiseInvoiceResponse(raw) {
    return pickFields(raw, INVOICE_FIELDS);
}
export function sanitiseChargeCardResponse(raw) {
    return pickFields(raw, CHARGE_CARD_FIELDS);
}
export function sanitiseChargeCardTokenResponse(raw) {
    return pickFields(raw, CHARGE_CARD_TOKEN_FIELDS);
}
export function sanitiseAuthoriseCardOtpResponse(raw) {
    return pickFields(raw, AUTHORISE_CARD_OTP_FIELDS);
}
export function sanitiseAuthoriseCard3dsResponse(raw) {
    return pickFields(raw, AUTHORISE_CARD_3DS_FIELDS);
}
export function sanitiseBankTransferPaymentResponse(raw) {
    return pickFields(raw, BANK_TRANSFER_PAYMENT_FIELDS);
}
export function sanitiseRefundResponse(raw) {
    return pickFields(raw, REFUND_FIELDS);
}
export function sanitiseMandateResponse(raw) {
    return pickFields(raw, MANDATE_FIELDS);
}
export function sanitiseMandateStatusResponse(raw) {
    return pickFields(raw, MANDATE_STATUS_FIELDS);
}
export function sanitiseDebitStatusResponse(raw) {
    return pickFields(raw, DEBIT_STATUS_FIELDS);
}
export function sanitiseCancelMandateResponse(raw) {
    return pickFields(raw, CANCEL_MANDATE_FIELDS);
}
export function sanitiseBankAccountResponse(raw) {
    return pickFields(raw, BANK_ACCOUNT_FIELDS);
}
export function sanitiseBvnResponse(raw) {
    return pickFields(raw, BVN_FIELDS);
}
export function sanitiseBvnInfoResponse(raw) {
    return pickFields(raw, BVN_INFO_FIELDS);
}
export function sanitiseNinResponse(raw) {
    return pickFields(raw, NIN_FIELDS);
}
export function sanitiseBankListResponse(raw) {
    return raw.map((bank) => pickFields(bank, BANK_FIELDS));
}
//# sourceMappingURL=sanitiser.js.map