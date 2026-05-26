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

describe("monnify_initiate_payment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validInput = {
    amount: 5000,
    customerEmail: "customer@example.com",
    customerName: "John Doe",
    paymentReference: "PAY-REF-001",
    paymentDescription: "Test payment",
    contractCode: "626843051499",
    currencyCode: "NGN",
  };

  it("returns checkoutUrl and references on success", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiPost).mockResolvedValueOnce({
      transactionReference: "MNFY|XX|20231001|000001",
      paymentReference: "PAY-REF-001",
      merchantName: "Test Merchant",
      checkoutUrl: "https://checkout.monnify.com/pay/MNFY|XX|20231001|000001",
      enabledPaymentMethod: ["CARD", "ACCOUNT_TRANSFER"],
      paymentDescription: "Test payment",
    });

    const { handler } = await import("../../src/tools/collections/initiatePayment.js");
    const result = await handler(validInput);

    expect(result.isError).toBeFalsy();
    expect(apiPost).toHaveBeenCalledWith(
      "/api/v1/merchant/transactions/init-transaction",
      expect.objectContaining({
        amount: 5000,
        customerEmail: "customer@example.com",
        paymentReference: "PAY-REF-001",
        contractCode: "626843051499",
      })
    );
    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(parsed.transactionReference).toBe("MNFY|XX|20231001|000001");
    expect(parsed.paymentReference).toBe("PAY-REF-001");
    expect(parsed.checkoutUrl).toContain("checkout.monnify.com");
    expect(parsed.enabledPaymentMethod).toEqual(["CARD", "ACCOUNT_TRANSFER"]);
  });

  it("sanitiser strips paymentDescription from response", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiPost).mockResolvedValueOnce({
      transactionReference: "MNFY|XX|20231001|000001",
      paymentReference: "PAY-REF-001",
      checkoutUrl: "https://checkout.monnify.com/pay/MNFY|XX|20231001|000001",
      paymentDescription: "Sensitive description that should be stripped",
    });

    const { handler } = await import("../../src/tools/collections/initiatePayment.js");
    const result = await handler(validInput);

    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(parsed.paymentDescription).toBeUndefined();
  });

  it("fails validation when amount is missing", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/collections/initiatePayment.js");

    const result = await handler({
      customerEmail: "customer@example.com",
      customerName: "John Doe",
      paymentReference: "PAY-REF-001",
      paymentDescription: "Test payment",
      contractCode: "626843051499",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPost).not.toHaveBeenCalled();
  });

  it("fails validation when customerEmail is invalid", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/collections/initiatePayment.js");

    const result = await handler({ ...validInput, customerEmail: "not-an-email" });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPost).not.toHaveBeenCalled();
  });

  it("fails validation when contractCode is missing", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/collections/initiatePayment.js");

    const { contractCode: _, ...noContract } = validInput;
    const result = await handler(noContract);

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPost).not.toHaveBeenCalled();
  });

  it("returns MonnifyApiError on duplicate paymentReference", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { MonnifyApiError } = await import("../../src/utils/errors.js");

    vi.mocked(apiPost).mockRejectedValueOnce(
      new MonnifyApiError("99", "Duplicate payment reference", 409)
    );

    const { handler } = await import("../../src/tools/collections/initiatePayment.js");
    const result = await handler(validInput);

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Duplicate payment reference");
  });
});
