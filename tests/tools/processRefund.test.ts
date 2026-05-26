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

describe("monnify_process_refund", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validInput = {
    transactionReference: "MNFY|XX|20231001|000001",
    refundReference: "REFUND-001",
    refundAmount: 5000,
    refundReason: "CUSTOMER_REQUEST" as const,
    customerNote: "Refund as requested by customer",
  };

  it("returns refundReference and INITIATED status on success", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiPost).mockResolvedValueOnce({
      transactionReference: "MNFY|XX|20231001|000001",
      refundReference: "REFUND-001",
      refundStatus: "INITIATED",
      refundAmount: 5000,
      refundReason: "CUSTOMER_REQUEST",
      destinationAccountNumber: "1234567890",
      destinationAccountBankCode: "058",
      createdOn: "2024-01-01T00:00:00.000+0000",
      internalNote: "should-be-stripped",
    });

    const { handler } = await import("../../src/tools/collections/processRefund.js");
    const result = await handler(validInput);

    expect(result.isError).toBeFalsy();
    expect(apiPost).toHaveBeenCalledWith(
      "/api/v1/refunds/initiate-refund",
      expect.objectContaining({
        transactionReference: "MNFY|XX|20231001|000001",
        refundReference: "REFUND-001",
        refundAmount: 5000,
        refundReason: "CUSTOMER_REQUEST",
        customerNote: "Refund as requested by customer",
      })
    );
    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(parsed.refundReference).toBe("REFUND-001");
    expect(parsed.refundStatus).toBe("INITIATED");
    expect(parsed.refundAmount).toBe(5000);
    expect(parsed.refundReason).toBe("CUSTOMER_REQUEST");
  });

  it("sanitiser strips internal fields from response", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiPost).mockResolvedValueOnce({
      refundReference: "REFUND-001",
      refundStatus: "INITIATED",
      internalNote: "do not expose",
      merchantSecret: "secret-key",
    });

    const { handler } = await import("../../src/tools/collections/processRefund.js");
    const result = await handler(validInput);

    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(parsed.internalNote).toBeUndefined();
    expect(parsed.merchantSecret).toBeUndefined();
  });

  it("fails validation when refundReason is not a valid enum value", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/collections/processRefund.js");

    const result = await handler({ ...validInput, refundReason: "INVALID_REASON" });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPost).not.toHaveBeenCalled();
  });

  it("fails validation when transactionReference is missing", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/collections/processRefund.js");

    const { transactionReference: _, ...noRef } = validInput;
    const result = await handler(noRef);

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPost).not.toHaveBeenCalled();
  });

  it("fails validation when destinationAccountNumber is not 10 digits", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/collections/processRefund.js");

    const result = await handler({
      ...validInput,
      destinationAccountNumber: "12345", // too short
      destinationAccountBankCode: "058",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPost).not.toHaveBeenCalled();
  });

  it("returns MonnifyApiError when transaction is not found or already refunded", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { MonnifyApiError } = await import("../../src/utils/errors.js");

    vi.mocked(apiPost).mockRejectedValueOnce(
      new MonnifyApiError("99", "Transaction already refunded", 400)
    );

    const { handler } = await import("../../src/tools/collections/processRefund.js");
    const result = await handler(validInput);

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Transaction already refunded");
  });
});
