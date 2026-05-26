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

describe("monnify_authorise_card_3ds", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns redirectUrl for customer to complete 3DS authentication", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiPost).mockResolvedValueOnce({
      transactionReference: "MNFY|XX|20231001|000001",
      paymentReference: "PAY-REF-001",
      authorizedAmount: 5000,
      status: "PENDING",
      redirectUrl: "https://3ds.bank.ng/auth?ref=MNFY|XX|20231001|000001",
    });

    const { handler } = await import("../../src/tools/collections/authoriseCard3ds.js");
    const result = await handler({
      transactionReference: "MNFY|XX|20231001|000001",
      apiKey: "MK_TEST_XXXX",
    });

    expect(result.isError).toBeFalsy();
    // Spec endpoint: /api/v1/sdk/cards/secure-3d/authorize (sdk, not merchant)
    expect(apiPost).toHaveBeenCalledWith(
      "/api/v1/sdk/cards/secure-3d/authorize",
      expect.objectContaining({
        transactionReference: "MNFY|XX|20231001|000001",
        apiKey: "MK_TEST_XXXX",
      })
    );
    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(parsed.redirectUrl).toContain("3ds.bank.ng");
    expect(parsed.transactionReference).toBe("MNFY|XX|20231001|000001");
    expect(parsed.status).toBe("PENDING");
  });

  it("fails validation when apiKey is missing", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/collections/authoriseCard3ds.js");

    const result = await handler({
      transactionReference: "MNFY|XX|20231001|000001",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPost).not.toHaveBeenCalled();
  });

  it("fails validation when transactionReference is missing", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/collections/authoriseCard3ds.js");

    const result = await handler({ apiKey: "MK_TEST_XXXX" });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPost).not.toHaveBeenCalled();
  });

  it("returns MonnifyApiError on invalid transaction state", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { MonnifyApiError } = await import("../../src/utils/errors.js");

    vi.mocked(apiPost).mockRejectedValueOnce(
      new MonnifyApiError("99", "Transaction not in 3DS state", 400)
    );

    const { handler } = await import("../../src/tools/collections/authoriseCard3ds.js");
    const result = await handler({
      transactionReference: "MNFY|XX|20231001|000001",
      apiKey: "MK_TEST_XXXX",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Transaction not in 3DS state");
  });
});
