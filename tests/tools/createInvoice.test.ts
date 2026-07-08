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

describe("monnify_create_invoice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validInput = {
    amount: 10000,
    invoiceReference: "INV-001",
    description: "Monthly subscription",
    contractCode: "626843051499",
    customerEmail: "customer@example.com",
    customerName: "John Doe",
    currencyCode: "NGN",
    expiryDate: "2025-12-31 23:59:59",
  };

  it("returns checkoutUrl and invoiceReference on success", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiPost).mockResolvedValueOnce({
      amount: 10000,
      invoiceReference: "INV-001",
      invoiceStatus: "PENDING",
      contractCode: "626843051499",
      customerEmail: "customer@example.com",
      customerName: "John Doe",
      expiryDate: "2025-12-31T23:59:59.000+0000",
      createdOn: "2024-01-01T00:00:00.000+0000",
      checkoutUrl: "https://checkout.monnify.com/invoice/INV-001",
      invoiceUrl: "https://invoice.monnify.com/INV-001",
      offlinePaymentCode: "PAY-CODE-001",
      internalNote: "should-be-stripped",
    });

    const { handler } = await import("../../src/tools/collections/createInvoice.js");
    const result = await handler(validInput);

    expect(result.isError).toBeFalsy();
    expect(apiPost).toHaveBeenCalledWith(
      "/api/v1/invoice/create",
      expect.objectContaining({
        amount: 10000,
        invoiceReference: "INV-001",
        contractCode: "626843051499",
        customerEmail: "customer@example.com",
        expiryDate: "2025-12-31 23:59:59",
      })
    );
    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(parsed.invoiceReference).toBe("INV-001");
    expect(parsed.invoiceStatus).toBe("PENDING");
    expect(parsed.checkoutUrl).toContain("checkout.monnify.com");
    expect(parsed.invoiceUrl).toContain("invoice.monnify.com");
    expect(parsed.offlinePaymentCode).toBe("PAY-CODE-001");
  });

  it("sanitiser strips internal fields not in the whitelist", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiPost).mockResolvedValueOnce({
      invoiceReference: "INV-001",
      checkoutUrl: "https://checkout.monnify.com/invoice/INV-001",
      internalNote: "secret",
      merchantWebhook: "https://internal.webhook.com",
    });

    const { handler } = await import("../../src/tools/collections/createInvoice.js");
    const result = await handler(validInput);

    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(parsed.internalNote).toBeUndefined();
    expect(parsed.merchantWebhook).toBeUndefined();
  });

  it("fails validation when amount is missing", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/collections/createInvoice.js");

    const { amount: _, ...noAmount } = validInput;
    const result = await handler(noAmount);

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPost).not.toHaveBeenCalled();
  });

  it("fails validation when expiryDate is missing", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/collections/createInvoice.js");

    const { expiryDate: _, ...noExpiry } = validInput;
    const result = await handler(noExpiry);

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPost).not.toHaveBeenCalled();
  });

  it("fails validation when expiryDate is ISO 8601 instead of space-separated", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/collections/createInvoice.js");

    const result = await handler({
      ...validInput,
      expiryDate: "2025-12-31T23:59:59",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPost).not.toHaveBeenCalled();
  });

  it("returns MonnifyApiError on duplicate invoiceReference", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { MonnifyApiError } = await import("../../src/utils/errors.js");

    vi.mocked(apiPost).mockRejectedValueOnce(
      new MonnifyApiError("99", "Invoice reference already exists", 409)
    );

    const { handler } = await import("../../src/tools/collections/createInvoice.js");
    const result = await handler(validInput);

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Invoice reference already exists");
  });
});
