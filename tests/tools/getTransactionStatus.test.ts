import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/client/monnifyClient.js", () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
}));

vi.mock("../../src/tools/registry.js", () => ({
  registerTool: vi.fn(),
}));

vi.mock("../../src/utils/logger.js", () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe("monnify_get_transaction_status", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queries by paymentReference using GET with query params", async () => {
    const { apiGet } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiGet).mockResolvedValueOnce({
      transactionReference: "MNFY|XX|20231001|000001",
      paymentReference: "PAY-REF-001",
      amountPaid: 5000,
      totalPayable: 5000,
      settledAmount: 4950,
      paidOn: "2023-10-01T12:00:00.000+0000",
      paymentStatus: "PAID",
      currencyCode: "NGN",
      paymentMethod: "CARD",
      narration: "should-be-stripped",
    });

    const { handler } = await import("../../src/tools/collections/getTransactionStatus.js");
    const result = await handler({ paymentReference: "PAY-REF-001" });

    expect(result.isError).toBeFalsy();
    // Spec: GET /api/v2/merchant/transactions/query with query params
    expect(apiGet).toHaveBeenCalledWith(
      "/api/v2/merchant/transactions/query",
      expect.objectContaining({ paymentReference: "PAY-REF-001" })
    );
    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(parsed.transactionReference).toBe("MNFY|XX|20231001|000001");
    expect(parsed.paymentReference).toBe("PAY-REF-001");
    expect(parsed.paymentStatus).toBe("PAID");
    expect(parsed.amountPaid).toBe(5000);
    expect(parsed.paymentMethod).toBe("CARD");
  });

  it("sanitiser strips narration and other non-whitelisted fields", async () => {
    const { apiGet } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiGet).mockResolvedValueOnce({
      transactionReference: "MNFY|XX|20231001|000001",
      paymentReference: "PAY-REF-001",
      paymentStatus: "PAID",
      narration: "Sensitive narration",
      cardDetails: { maskedPan: "411111****1111" },
      customerName: "John Doe",
    });

    const { handler } = await import("../../src/tools/collections/getTransactionStatus.js");
    const result = await handler({ paymentReference: "PAY-REF-001" });

    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(parsed.narration).toBeUndefined();
    expect(parsed.cardDetails).toBeUndefined();
    expect(parsed.customerName).toBeUndefined();
  });

  it("accepts transactionReference as alternative lookup key", async () => {
    const { apiGet } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiGet).mockResolvedValueOnce({
      transactionReference: "MNFY|XX|20231001|000001",
      paymentReference: "PAY-REF-001",
      paymentStatus: "PENDING",
    });

    const { handler } = await import("../../src/tools/collections/getTransactionStatus.js");
    const result = await handler({ paymentReference: "PAY-REF-001", transactionReference: "MNFY|XX|20231001|000001" });

    expect(result.isError).toBeFalsy();
    expect(apiGet).toHaveBeenCalledWith(
      "/api/v2/merchant/transactions/query",
      expect.objectContaining({ transactionReference: "MNFY|XX|20231001|000001" })
    );
  });

  it("fails validation when paymentReference is missing", async () => {
    const { apiGet } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/collections/getTransactionStatus.js");

    const result = await handler({});

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiGet).not.toHaveBeenCalled();
  });

  it("returns MonnifyApiError when transaction is not found", async () => {
    const { apiGet } = await import("../../src/client/monnifyClient.js");
    const { MonnifyApiError } = await import("../../src/utils/errors.js");

    vi.mocked(apiGet).mockRejectedValueOnce(
      new MonnifyApiError("99", "Transaction not found", 404)
    );

    const { handler } = await import("../../src/tools/collections/getTransactionStatus.js");
    const result = await handler({ paymentReference: "PAY-REF-UNKNOWN" });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Transaction not found");
  });
});
