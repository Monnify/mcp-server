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

describe("monnify_get_transaction_list", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockApiResponse = {
    content: [
      {
        transactionReference: "MNFY|XX|20231001|000001",
        paymentReference: "PAY-REF-001",
        amountPaid: 5000,
        totalPayable: 5000,
        paymentStatus: "PAID",
        paidOn: "2023-10-01T12:00:00.000+0000",
        paymentMethod: "CARD",
        currencyCode: "NGN",
        customerName: "should-be-stripped",
        narration: "should-be-stripped",
      },
    ],
    totalElements: 1,
    totalPages: 1,
    size: 10,
    number: 0,
  };

  it("calls GET /api/v1/transactions/search and returns paginated results", async () => {
    const { apiGet } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiGet).mockResolvedValueOnce(mockApiResponse);

    const { handler } = await import("../../src/tools/utilities/getTransactionList.js");
    const result = await handler({ page: 0, size: 10 });

    expect(result.isError).toBeFalsy();
    expect(apiGet).toHaveBeenCalledWith(
      "/api/v1/transactions/search",
      expect.objectContaining({ page: 0, size: 10 })
    );
    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(parsed.totalElements).toBe(1);
    expect(parsed.totalPages).toBe(1);
    expect(Array.isArray(parsed.content)).toBe(true);
    expect(parsed.content).toHaveLength(1);
  });

  it("sanitiser strips customerName and narration from each transaction row", async () => {
    const { apiGet } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiGet).mockResolvedValueOnce(mockApiResponse);

    const { handler } = await import("../../src/tools/utilities/getTransactionList.js");
    const result = await handler({});

    const parsed = JSON.parse(result.content[0]?.text ?? "");
    const tx = parsed.content[0];
    expect(tx.customerName).toBeUndefined();
    expect(tx.narration).toBeUndefined();
    expect(tx.transactionReference).toBe("MNFY|XX|20231001|000001");
    expect(tx.paymentStatus).toBe("PAID");
    expect(tx.paymentMethod).toBe("CARD");
  });

  it("passes date range filters as from/to query params (not startDate/endDate)", async () => {
    const { apiGet } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiGet).mockResolvedValueOnce({ content: [], totalElements: 0, totalPages: 0, size: 10, number: 0 });

    const { handler } = await import("../../src/tools/utilities/getTransactionList.js");
    await handler({
      from: "2023-10-01T00:00:00",
      to: "2023-10-31T23:59:59",
      paymentStatus: "PAID",
    });

    expect(apiGet).toHaveBeenCalledWith(
      "/api/v1/transactions/search",
      expect.objectContaining({
        from: "2023-10-01T00:00:00",
        to: "2023-10-31T23:59:59",
        paymentStatus: "PAID",
      })
    );
    const callParams = vi.mocked(apiGet).mock.calls[0]?.[1] as Record<string, unknown>;
    expect(callParams).not.toHaveProperty("startDate");
    expect(callParams).not.toHaveProperty("endDate");
  });

  it("returns empty content array when no transactions match", async () => {
    const { apiGet } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiGet).mockResolvedValueOnce({
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: 10,
      number: 0,
    });

    const { handler } = await import("../../src/tools/utilities/getTransactionList.js");
    const result = await handler({ paymentStatus: "FAILED" });

    expect(result.isError).toBeFalsy();
    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(parsed.content).toEqual([]);
    expect(parsed.totalElements).toBe(0);
  });

  it("returns MonnifyApiError on API failure", async () => {
    const { apiGet } = await import("../../src/client/monnifyClient.js");
    const { MonnifyApiError } = await import("../../src/utils/errors.js");

    vi.mocked(apiGet).mockRejectedValueOnce(
      new MonnifyApiError("99", "Unauthorized", 401)
    );

    const { handler } = await import("../../src/tools/utilities/getTransactionList.js");
    const result = await handler({});

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Unauthorized");
  });
});
