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

describe("monnify_get_mandate_debit_status", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls correct endpoint with paymentReference query param", async () => {
    const { apiGet } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiGet).mockResolvedValueOnce({
      debitReference: "PR1234567991002",
      mandateReference: "unique_ref3",
      debitStatus: "PAID",
      amount: 1000,
      debitDate: "2024-05-19T09:15:30.000+0000",
    });

    const { handler } = await import("../../src/tools/directDebit/getMandateDebitStatus.js");
    const result = await handler({ paymentReference: "PR1234567991002" });

    expect(result.isError).toBeFalsy();

    const [path, params] = vi.mocked(apiGet).mock.calls[0];
    // Spec path is /api/v1/direct-debit/mandate/debit-status (hyphenated, not /debit/status)
    expect(path).toBe("/api/v1/direct-debit/mandate/debit-status");
    // Spec query param is paymentReference only
    expect(params).toHaveProperty("paymentReference", "PR1234567991002");
    expect(params).not.toHaveProperty("debitReference");
    expect(params).not.toHaveProperty("mandateReference");
  });

  it("fails validation when paymentReference is missing", async () => {
    const { apiGet } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/directDebit/getMandateDebitStatus.js");

    const result = await handler({});
    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiGet).not.toHaveBeenCalled();
  });

  it("returns MonnifyApiError when debit is not found", async () => {
    const { apiGet } = await import("../../src/client/monnifyClient.js");
    const { MonnifyApiError } = await import("../../src/utils/errors.js");
    vi.mocked(apiGet).mockRejectedValueOnce(
      new MonnifyApiError("404", "Debit not found", 404)
    );

    const { handler } = await import("../../src/tools/directDebit/getMandateDebitStatus.js");
    const result = await handler({ paymentReference: "NONEXISTENT" });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Debit not found");
  });
});
