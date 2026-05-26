import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/client/monnifyClient.js", () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
}));

vi.mock("../../src/tools/registry.js", () => ({
  registerTool: vi.fn(),
}));

vi.mock("../../src/utils/logger.js", () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

const validArgs = {
  paymentReference: "PR1234567991002",
  mandateCode: "MTDD|01HY8WMN8JYKDRJC67QPQVS1N0",
  debitAmount: 1000,
  narration: "Payment for Services",
  customerEmail: "ahsan.saleem@gmail.com",
};

describe("monnify_debit_mandate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("posts to correct endpoint with spec field names", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiPost).mockResolvedValueOnce({
      transactionStatus: "PAID",
      responseMessage: "success",
      transactionReference: "MNFY|87|20230602|007039",
      paymentReference: "PR1234567991002",
      debitAmount: 1000,
    });

    const { handler } = await import("../../src/tools/directDebit/debitMandate.js");
    const result = await handler(validArgs);

    expect(result.isError).toBeFalsy();
    expect(apiPost).toHaveBeenCalledWith(
      "/api/v1/direct-debit/mandate/debit",
      expect.objectContaining({
        // Spec field names: paymentReference, mandateCode, debitAmount, narration, customerEmail
        paymentReference: validArgs.paymentReference,
        mandateCode: validArgs.mandateCode,
        debitAmount: validArgs.debitAmount,
        narration: validArgs.narration,
        customerEmail: validArgs.customerEmail,
      })
    );

    // Old wrong field names must NOT be sent
    const [, body] = vi.mocked(apiPost).mock.calls[0];
    expect(body).not.toHaveProperty("debitReference");
    expect(body).not.toHaveProperty("mandateReference");
    expect(body).not.toHaveProperty("amount");
    expect(body).not.toHaveProperty("currencyCode");
  });

  it("fails validation when mandateCode is missing", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/directDebit/debitMandate.js");
    const { mandateCode: _removed, ...withoutCode } = validArgs;

    const result = await handler(withoutCode);
    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPost).not.toHaveBeenCalled();
  });

  it("fails validation when customerEmail is missing", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/directDebit/debitMandate.js");
    const { customerEmail: _removed, ...withoutEmail } = validArgs;

    const result = await handler(withoutEmail);
    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPost).not.toHaveBeenCalled();
  });

  it("fails validation when paymentReference is missing", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/directDebit/debitMandate.js");
    const { paymentReference: _removed, ...withoutRef } = validArgs;

    const result = await handler(withoutRef);
    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPost).not.toHaveBeenCalled();
  });

  it("returns MonnifyApiError when mandate is not activated", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { MonnifyApiError } = await import("../../src/utils/errors.js");
    vi.mocked(apiPost).mockRejectedValueOnce(
      new MonnifyApiError("99", "Mandate is not activated", 400)
    );

    const { handler } = await import("../../src/tools/directDebit/debitMandate.js");
    const result = await handler(validArgs);

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Mandate is not activated");
  });
});
