// Formatting helpers — convert sanitised API payloads into readable Markdown for MCP responses.

function naira(amount: unknown): string {
  const n = Number(amount);
  if (isNaN(n)) return String(amount ?? "—");
  return `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function humanDate(raw: unknown): string {
  if (!raw) return "—";
  const d = new Date(String(raw));
  if (isNaN(d.getTime())) return String(raw);
  return d.toLocaleString("en-NG", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZone: "Africa/Lagos",
  });
}

function statusIcon(status: unknown): string {
  const s = String(status ?? "").toUpperCase();
  if (["PAID", "SUCCESS", "ACTIVE", "APPROVED", "VERIFIED", "MATCHED", "COMPLETED"].some(v => s.includes(v))) return "✅";
  if (["FAILED", "CANCELLED", "REJECTED", "INVALID", "DECLINED"].some(v => s.includes(v))) return "❌";
  if (["PENDING", "PROCESSING", "INITIATED"].some(v => s.includes(v))) return "⏳";
  return "ℹ️";
}

function boolIcon(val: unknown): string {
  return val === true || val === "true" ? "✅ Yes" : val === false || val === "false" ? "❌ No" : "—";
}

// ── Verification ──────────────────────────────────────────────────────────────

export function formatBankAccountVerification(d: Record<string, unknown>): string {
  return [
    `✅ **Account Verified**`,
    ``,
    `**Account Name:** ${d["accountName"] ?? "—"}`,
    `**Account Number:** ${d["accountNumber"] ?? "—"}`,
    `**Bank:** ${d["bankName"] ?? "—"} (${d["bankCode"] ?? "—"})`,
  ].join("\n");
}

export function formatBvnVerification(d: Record<string, unknown>): string {
  return [
    `🔍 **BVN Verification Result**`,
    ``,
    `**BVN:** ${d["bvn"] ?? "—"}`,
    `**Name Match:** ${boolIcon(d["nameMatch"])}`,
    `**Mobile Number Match:** ${boolIcon(d["mobileNoMatch"])}`,
    `**Date of Birth Match:** ${boolIcon(d["dateOfBirthMatch"])}`,
  ].join("\n");
}

export function formatBvnInfo(d: Record<string, unknown>): string {
  return [
    `🔍 **BVN Information**`,
    ``,
    `**BVN:** ${d["bvn"] ?? "—"}`,
    `**Name:** ${d["name"] ?? "—"}`,
    `**Date of Birth:** ${d["dateOfBirth"] ?? "—"}`,
    `**Mobile Number:** ${d["mobileNo"] ?? "—"}`,
    `**Information Match:** ${boolIcon(d["bvnInformationMatch"])}`,
  ].join("\n");
}

export function formatNinVerification(d: Record<string, unknown>): string {
  return [
    `🔍 **NIN Verification Result**`,
    ``,
    `**NIN:** ${d["nin"] ?? "—"}`,
    `**Name:** ${[d["firstName"], d["lastName"]].filter(Boolean).join(" ") || "—"}`,
    `**Date of Birth:** ${d["dateOfBirth"] ?? "—"}`,
    `**Gender:** ${d["gender"] ?? "—"}`,
    `**Phone Number:** ${d["phoneNumber"] ?? "—"}`,
    `**Information Match:** ${boolIcon(d["ninInformationMatch"])}`,
  ].join("\n");
}

// ── Utilities ─────────────────────────────────────────────────────────────────

export function formatSupportedBanks(banks: Array<Record<string, unknown>>): string {
  if (!banks.length) return "No supported banks found.";
  const rows = banks.map(b => `| ${b["name"] ?? "—"} | ${b["code"] ?? "—"} |`).join("\n");
  return [
    `🏦 **Supported Banks** (${banks.length} total)`,
    ``,
    `| Bank Name | Code |`,
    `|-----------|------|`,
    rows,
  ].join("\n");
}

// ── Collections ───────────────────────────────────────────────────────────────

export function formatInitiatePayment(d: Record<string, unknown>): string {
  const methods = Array.isArray(d["enabledPaymentMethod"])
    ? (d["enabledPaymentMethod"] as string[]).join(", ")
    : String(d["enabledPaymentMethod"] ?? "—");
  return [
    `💳 **Payment Initiated**`,
    ``,
    `**Transaction Reference:** ${d["transactionReference"] ?? "—"}`,
    `**Payment Reference:** ${d["paymentReference"] ?? "—"}`,
    `**Merchant:** ${d["merchantName"] ?? "—"}`,
    `**Payment Methods:** ${methods}`,
    ``,
    `**Checkout URL:** ${d["checkoutUrl"] ?? "—"}`,
    ``,
    `> Share the checkout URL with your customer to complete payment.`,
  ].join("\n");
}

export function formatTransactionStatus(d: Record<string, unknown>): string {
  const status = String(d["paymentStatus"] ?? "UNKNOWN");
  return [
    `${statusIcon(status)} **Transaction Status: ${status}**`,
    ``,
    `**Transaction Reference:** ${d["transactionReference"] ?? "—"}`,
    `**Payment Reference:** ${d["paymentReference"] ?? "—"}`,
    `**Amount Paid:** ${naira(d["amountPaid"])}`,
    `**Total Payable:** ${naira(d["totalPayable"])}`,
    d["settledAmount"] !== undefined ? `**Settled Amount:** ${naira(d["settledAmount"])}` : null,
    `**Currency:** ${d["currencyCode"] ?? "—"}`,
    `**Payment Method:** ${d["paymentMethod"] ?? "—"}`,
    `**Paid On:** ${humanDate(d["paidOn"])}`,
  ].filter(Boolean).join("\n");
}

export function formatAllTransactions(
  content: Array<Record<string, unknown>>,
  meta: { totalElements: unknown; totalPages: unknown; size: unknown; number: unknown }
): string {
  if (!content.length) {
    return `📭 **No transactions found** matching your filters.`;
  }
  const rows = content.map(tx => {
    const status = String(tx["paymentStatus"] ?? "");
    return `| ${statusIcon(status)} ${status} | ${tx["transactionReference"] ?? "—"} | ${naira(tx["amountPaid"])} | ${humanDate(tx["paidOn"])} |`;
  }).join("\n");

  const page = Number(meta.number ?? 0) + 1;
  const totalPages = Number(meta.totalPages ?? 1);

  return [
    `📋 **Transactions** — ${meta.totalElements ?? 0} total | Page ${page} of ${totalPages}`,
    ``,
    `| Status | Reference | Amount | Date |`,
    `|--------|-----------|--------|------|`,
    rows,
  ].join("\n");
}

export function formatReserveAccount(d: Record<string, unknown>): string {
  const accounts = Array.isArray(d["accounts"])
    ? (d["accounts"] as Array<Record<string, unknown>>)
        .map(a => `  • **${a["bankName"] ?? a["bankCode"] ?? "Bank"}:** ${a["accountNumber"] ?? "—"}`)
        .join("\n")
    : "—";

  return [
    `🏦 **Reserved Account Created**`,
    ``,
    `**Account Name:** ${d["accountName"] ?? "—"}`,
    `**Customer:** ${d["customerName"] ?? "—"} (${d["customerEmail"] ?? "—"})`,
    `**Status:** ${statusIcon(d["status"])} ${d["status"] ?? "—"}`,
    `**Account Reference:** ${d["accountReference"] ?? "—"}`,
    `**Reservation Reference:** ${d["reservationReference"] ?? "—"}`,
    `**Currency:** ${d["currencyCode"] ?? "—"}`,
    `**Created On:** ${humanDate(d["createdOn"])}`,
    ``,
    `**Virtual Account Numbers:**`,
    accounts,
  ].join("\n");
}

export function formatCreateInvoice(d: Record<string, unknown>): string {
  return [
    `🧾 **Invoice Created**`,
    ``,
    `**Invoice Reference:** ${d["invoiceReference"] ?? "—"}`,
    `**Status:** ${statusIcon(d["invoiceStatus"])} ${d["invoiceStatus"] ?? "—"}`,
    `**Amount:** ${naira(d["amount"])}`,
    `**Customer:** ${d["customerName"] ?? "—"} (${d["customerEmail"] ?? "—"})`,
    `**Expires:** ${humanDate(d["expiryDate"])}`,
    `**Created On:** ${humanDate(d["createdOn"])}`,
    d["offlinePaymentCode"] ? `**Offline Payment Code:** ${d["offlinePaymentCode"]}` : null,
    ``,
    `**Invoice URL:** ${d["invoiceUrl"] ?? d["checkoutUrl"] ?? "—"}`,
  ].filter(Boolean).join("\n");
}

export function formatChargeCard(d: Record<string, unknown>): string {
  const status = String(d["status"] ?? "");
  const lines = [
    `💳 **Card Charge ${statusIcon(status)} ${status}**`,
    ``,
    `**Transaction Reference:** ${d["transactionReference"] ?? "—"}`,
    `**Payment Reference:** ${d["paymentReference"] ?? "—"}`,
    `**Authorized Amount:** ${naira(d["authorizedAmount"])}`,
    `**Message:** ${d["message"] ?? "—"}`,
  ];

  if (d["otpData"]) {
    lines.push(``, `> An OTP has been sent. Use \`monnify_authorise_card_otp\` to complete this transaction.`);
  }
  if (d["secure3dData"]) {
    const redirect = (d["secure3dData"] as Record<string, unknown>)?.["redirectUrl"] ?? "—";
    lines.push(``, `**3DS Redirect URL:** ${redirect}`);
    lines.push(`> Redirect the customer to complete 3D Secure authentication.`);
  }

  return lines.join("\n");
}

export function formatAuthoriseCardOtp(d: Record<string, unknown>): string {
  const status = String(d["status"] ?? "");
  return [
    `🔐 **OTP Authorisation ${statusIcon(status)} ${status}**`,
    ``,
    `**Transaction Reference:** ${d["transactionReference"] ?? "—"}`,
    `**Payment Reference:** ${d["paymentReference"] ?? "—"}`,
    `**Authorized Amount:** ${naira(d["authorizedAmount"])}`,
    `**Message:** ${d["message"] ?? "—"}`,
  ].join("\n");
}

export function formatAuthoriseCard3ds(d: Record<string, unknown>): string {
  const status = String(d["status"] ?? "");
  return [
    `🔐 **3DS Authorisation ${statusIcon(status)} ${status}**`,
    ``,
    `**Transaction Reference:** ${d["transactionReference"] ?? "—"}`,
    `**Payment Reference:** ${d["paymentReference"] ?? "—"}`,
    `**Authorized Amount:** ${naira(d["authorizedAmount"])}`,
    d["redirectUrl"] ? `**Redirect URL:** ${d["redirectUrl"]}` : null,
  ].filter(Boolean).join("\n");
}

export function formatChargeCardToken(d: Record<string, unknown>): string {
  const status = String(d["paymentStatus"] ?? "");
  return [
    `💳 **Card Token Charge ${statusIcon(status)} ${status}**`,
    ``,
    `**Transaction Reference:** ${d["transactionReference"] ?? "—"}`,
    `**Payment Reference:** ${d["paymentReference"] ?? "—"}`,
    `**Amount Paid:** ${naira(d["amountPaid"])}`,
    `**Total Payable:** ${naira(d["totalPayable"])}`,
    `**Settlement Amount:** ${naira(d["settlementAmount"])}`,
    `**Currency:** ${d["currency"] ?? "—"}`,
    `**Payment Method:** ${d["paymentMethod"] ?? "—"}`,
    `**Paid On:** ${humanDate(d["paidOn"])}`,
  ].join("\n");
}

export function formatBankTransferPayment(d: Record<string, unknown>): string {
  return [
    `🏦 **Bank Transfer Payment Details**`,
    ``,
    `**Pay ${naira(d["amount"])} to:**`,
    `**Account Number:** ${d["accountNumber"] ?? "—"}`,
    `**Account Name:** ${d["accountName"] ?? "—"}`,
    `**Bank:** ${d["bankName"] ?? "—"} (${d["bankCode"] ?? "—"})`,
    ``,
    `**Fee:** ${naira(d["fee"])}`,
    `**Total Payable (inc. fee):** ${naira(d["totalPayableFee"])}`,
    `**Expires:** ${humanDate(d["expiryDate"])}`,
    ``,
    `> Transfer the exact amount above before the expiry time.`,
  ].join("\n");
}

export function formatProcessRefund(d: Record<string, unknown>): string {
  const status = String(d["refundStatus"] ?? "");
  return [
    `↩️ **Refund ${statusIcon(status)} ${status}**`,
    ``,
    `**Refund Reference:** ${d["refundReference"] ?? "—"}`,
    `**Transaction Reference:** ${d["transactionReference"] ?? "—"}`,
    `**Refund Amount:** ${naira(d["refundAmount"])}`,
    `**Reason:** ${d["refundReason"] ?? "—"}`,
    `**Destination Account:** ${d["destinationAccountNumber"] ?? "—"} (${d["destinationAccountBankCode"] ?? "—"})`,
    `**Initiated On:** ${humanDate(d["createdOn"])}`,
  ].join("\n");
}

// ── Direct Debit ──────────────────────────────────────────────────────────────

export function formatCreateMandate(d: Record<string, unknown>): string {
  const status = String(d["mandateStatus"] ?? "");
  return [
    `📄 **Direct Debit Mandate Created**`,
    ``,
    `**Mandate Reference:** ${d["mandateReference"] ?? "—"}`,
    `**Mandate Code:** ${d["mandateCode"] ?? "—"}`,
    `**Status:** ${statusIcon(status)} ${status}`,
    `**Amount:** ${naira(d["mandateAmount"])}`,
    `**Valid:** ${humanDate(d["startDate"])} → ${humanDate(d["endDate"])}`,
    ``,
    `**Authorization Link:** ${d["authorizationLink"] ?? "—"}`,
    ``,
    `> Share the authorization link with the customer to approve the mandate.`,
  ].join("\n");
}

export function formatMandateStatus(d: Record<string, unknown>): string {
  const status = String(d["mandateStatus"] ?? "");
  return [
    `${statusIcon(status)} **Mandate Status: ${status}**`,
    ``,
    `**Mandate Reference:** ${d["mandateReference"] ?? "—"}`,
    `**Mandate Code:** ${d["mandateCode"] ?? "—"}`,
    `**Customer:** ${d["customerName"] ?? "—"} — ${d["customerAccountNumber"] ?? "—"}`,
    `**Amount:** ${naira(d["mandateAmount"])}`,
    `**Valid:** ${humanDate(d["startDate"])} → ${humanDate(d["endDate"])}`,
    d["authorizationLink"] ? `**Authorization Link:** ${d["authorizationLink"]}` : null,
  ].filter(Boolean).join("\n");
}

export function formatDebitStatus(d: Record<string, unknown>): string {
  const status = String(d["debitStatus"] ?? "");
  return [
    `${statusIcon(status)} **Debit Status: ${status}**`,
    ``,
    `**Debit Reference:** ${d["debitReference"] ?? "—"}`,
    `**Mandate Reference:** ${d["mandateReference"] ?? "—"}`,
    `**Amount:** ${naira(d["amount"])}`,
    `**Debit Date:** ${humanDate(d["debitDate"])}`,
  ].join("\n");
}

// ── Reserved Account Management ───────────────────────────────────────────────

export function formatReservedAccountDetails(d: Record<string, unknown>): string {
  const accounts = Array.isArray(d["accounts"])
    ? (d["accounts"] as Array<Record<string, unknown>>)
        .map(a => `  • **${a["bankName"] ?? a["bankCode"] ?? "Bank"}:** ${a["accountNumber"] ?? "—"}`)
        .join("\n")
    : "—";

  return [
    `🏦 **Reserved Account Details**`,
    ``,
    `**Account Name:** ${d["accountName"] ?? "—"}`,
    `**Customer:** ${d["customerName"] ?? "—"} (${d["customerEmail"] ?? "—"})`,
    `**Status:** ${statusIcon(d["status"])} ${d["status"] ?? "—"}`,
    `**Account Reference:** ${d["accountReference"] ?? "—"}`,
    `**Reservation Reference:** ${d["reservationReference"] ?? "—"}`,
    `**Currency:** ${d["currencyCode"] ?? "—"}`,
    `**Created On:** ${humanDate(d["createdOn"])}`,
    ``,
    `**Virtual Account Numbers:**`,
    accounts,
  ].join("\n");
}

export function formatReservedAccountTransactions(
  transactions: Array<Record<string, unknown>>,
  meta: { totalElements: unknown; totalPages: unknown; number: unknown; accountReference: string }
): string {
  if (!transactions.length) {
    return `📭 **No transactions found** for reserved account **${meta.accountReference}**.`;
  }
  const rows = transactions.map(tx => {
    const status = String(tx["paymentStatus"] ?? "");
    return `| ${statusIcon(status)} ${status} | ${tx["transactionReference"] ?? "—"} | ${naira(tx["amountPaid"])} | ${humanDate(tx["paidOn"])} |`;
  }).join("\n");

  const page = Number(meta.number ?? 0) + 1;
  const totalPages = Number(meta.totalPages ?? 1);

  return [
    `📋 **Transactions for ${meta.accountReference}** — ${meta.totalElements ?? 0} total | Page ${page} of ${totalPages}`,
    ``,
    `| Status | Reference | Amount | Date |`,
    `|--------|-----------|--------|------|`,
    rows,
  ].join("\n");
}

export function formatDeallocateAccount(d: Record<string, unknown>): string {
  return [
    `🗑️ **Reserved Account Deallocated**`,
    ``,
    `**Account Reference:** ${d["accountReference"] ?? "—"}`,
    `**Account Name:** ${d["accountName"] ?? "—"}`,
    `**Status:** ${d["status"] ?? "—"}`,
    ``,
    `> This virtual account has been permanently removed and can no longer receive payments.`,
  ].join("\n");
}

export function formatCancelMandate(d: Record<string, unknown>): string {
  const status = String(d["mandateStatus"] ?? "");
  return [
    `${statusIcon(status)} **Mandate ${status}**`,
    ``,
    `**Mandate Reference:** ${d["mandateReference"] ?? "—"}`,
    `**Status:** ${status}`,
  ].join("\n");
}
