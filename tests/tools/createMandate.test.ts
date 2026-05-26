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

describe("monnify_create_mandate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validInput = {
    mandateReference: "MAN-REF-001",
    mandateAmount: 50000,
    customerAccountNumber: "1234567890",
    customerAccountBankCode: "058",
    customerName: "John Doe",
    customerEmailAddress: "customer@example.com",
    customerPhoneNumber: "2348012345678",
    customerAddress: "123 Example Street, Lagos, Nigeria",
    mandateDescription: "Monthly Subscription Fee",
    mandateStartDate: "2024-01-01T00:00:00",
    mandateEndDate: "2025-01-01T00:00:00",
    contractCode: "626843051499",
  };

  it("returns mandateCode, PENDING_AUTHORIZATION status, and authorizationLink on success", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiPost).mockResolvedValueOnce({
      mandateReference: "MAN-REF-001",
      mandateCode: "MTDD|01HY8WMN8JYKDRJC67QPQVS1N0",
      mandateStatus: "PENDING_AUTHORIZATION",
      authorizationLink: "https://mandate.monnify.com/auth/MTDD|01HY8WMN8JYKDRJC67QPQVS1N0",
      startDate: "2024-01-01T00:00:00.000+0000",
      endDate: "2025-01-01T00:00:00.000+0000",
      mandateAmount: 50000,
      internalNote: "should-be-stripped",
    });

    const { handler } = await import("../../src/tools/directDebit/createMandate.js");
    const result = await handler(validInput);

    expect(result.isError).toBeFalsy();
    expect(apiPost).toHaveBeenCalledWith(
      "/api/v1/direct-debit/mandate/create",
      expect.objectContaining({
        mandateReference: "MAN-REF-001",
        mandateAmount: 50000,
        customerAccountNumber: "1234567890",
        customerAccountBankCode: "058",
        customerEmailAddress: "customer@example.com",
        mandateStartDate: "2024-01-01T00:00:00",
        mandateEndDate: "2025-01-01T00:00:00",
        contractCode: "626843051499",
      })
    );
    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(parsed.mandateCode).toBe("MTDD|01HY8WMN8JYKDRJC67QPQVS1N0");
    expect(parsed.mandateStatus).toBe("PENDING_AUTHORIZATION");
    expect(parsed.authorizationLink).toContain("mandate.monnify.com");
    expect(parsed.mandateAmount).toBe(50000);
  });

  it("sanitiser strips non-whitelisted fields from response", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiPost).mockResolvedValueOnce({
      mandateReference: "MAN-REF-001",
      mandateCode: "MTDD|01HY8WMN8JYKDRJC67QPQVS1N0",
      mandateStatus: "PENDING_AUTHORIZATION",
      authorizationLink: "https://mandate.monnify.com/auth/MTDD|01HY8WMN8JYKDRJC67QPQVS1N0",
      customerAccountNumber: "1234567890",
      internalRef: "secret",
    });

    const { handler } = await import("../../src/tools/directDebit/createMandate.js");
    const result = await handler(validInput);

    const parsed = JSON.parse(result.content[0]?.text ?? "");
    // customerAccountNumber is not in MANDATE_FIELDS whitelist
    expect(parsed.customerAccountNumber).toBeUndefined();
    expect(parsed.internalRef).toBeUndefined();
  });

  it("fails validation when customerAccountNumber is not 10 digits", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/directDebit/createMandate.js");

    const result = await handler({ ...validInput, customerAccountNumber: "12345" });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPost).not.toHaveBeenCalled();
  });

  it("fails validation when customerEmailAddress is invalid", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/directDebit/createMandate.js");

    const result = await handler({ ...validInput, customerEmailAddress: "not-an-email" });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPost).not.toHaveBeenCalled();
  });

  it("does not send mandateType — it was never a valid field", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiPost).mockResolvedValueOnce({
      mandateCode: "MTDD|01HY8WMN8JYKDRJC67QPQVS1N0",
      mandateStatus: "PENDING_AUTHORIZATION",
      authorizationLink: "https://mandate.monnify.com/auth/MTDD|01HY8WMN8JYKDRJC67QPQVS1N0",
    });

    const { handler } = await import("../../src/tools/directDebit/createMandate.js");
    await handler(validInput);

    const callBody = vi.mocked(apiPost).mock.calls[0]?.[1] as Record<string, unknown>;
    expect(callBody).not.toHaveProperty("mandateType");
  });

  it("returns MonnifyApiError when account number is invalid", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { MonnifyApiError } = await import("../../src/utils/errors.js");

    vi.mocked(apiPost).mockRejectedValueOnce(
      new MonnifyApiError("99", "Invalid bank account number", 400)
    );

    const { handler } = await import("../../src/tools/directDebit/createMandate.js");
    const result = await handler(validInput);

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Invalid bank account number");
  });
});
