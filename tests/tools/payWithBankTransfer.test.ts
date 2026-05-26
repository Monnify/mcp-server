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

describe("monnify_pay_with_bank_transfer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns virtual account details for a valid request", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiPost).mockResolvedValueOnce({
      transactionReference: "MNFY|XX|20231001|000001",
      accountNumber: "1234567890",
      accountName: "Monnify Limited",
      bankName: "Guaranty Trust Bank",
      bankCode: "058",
      expiryDate: "2023-10-01T12:00:00.000+0000",
      amount: 5000,
      fee: 50,
      totalPayableFee: 5050,
    });

    const { handler } = await import(
      "../../src/tools/collections/payWithBankTransfer.js"
    );

    const result = await handler({
      transactionReference: "MNFY|XX|20231001|000001",
      bankCode: "058",
    });

    expect(result.isError).toBeFalsy();
    // Spec endpoint: /api/v1/merchant/bank-transfer/init-payment (not /api/v1/bank-transfer/...)
    expect(apiPost).toHaveBeenCalledWith(
      "/api/v1/merchant/bank-transfer/init-payment",
      expect.objectContaining({ transactionReference: "MNFY|XX|20231001|000001" })
    );
    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(parsed.accountNumber).toBe("1234567890");
    expect(parsed.accountName).toBe("Monnify Limited");
    expect(parsed.bankName).toBe("Guaranty Trust Bank");
    expect(parsed.bankCode).toBe("058");
    expect(parsed.amount).toBe(5000);
    expect(parsed.transactionReference).toBe("MNFY|XX|20231001|000001");
  });

  it("fails validation when transactionReference is missing", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");

    const { handler } = await import(
      "../../src/tools/collections/payWithBankTransfer.js"
    );

    const result = await handler({ bankCode: "058" });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPost).not.toHaveBeenCalled();
  });

  it("fails validation when bankCode is not 3 digits", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");

    const { handler } = await import(
      "../../src/tools/collections/payWithBankTransfer.js"
    );

    const result = await handler({
      transactionReference: "MNFY|XX|20231001|000001",
      bankCode: "58", // only 2 digits
    });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPost).not.toHaveBeenCalled();
  });

  it("returns MonnifyApiError when transaction reference is invalid", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { MonnifyApiError } = await import("../../src/utils/errors.js");

    vi.mocked(apiPost).mockRejectedValueOnce(
      new MonnifyApiError("99", "Transaction not found", 404)
    );

    const { handler } = await import(
      "../../src/tools/collections/payWithBankTransfer.js"
    );

    const result = await handler({
      transactionReference: "MNFY|XX|INVALID",
      bankCode: "058",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Transaction not found");
  });
});
