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

describe("monnify_reserve_account", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validInput = {
    accountReference: "ACCT-REF-001",
    accountName: "John Doe Wallet",
    contractCode: "626843051499",
    customerEmail: "customer@example.com",
    customerName: "John Doe",
    currencyCode: "NGN",
    bvn: "12345678901",
    getAllAvailableBanks: true,
    preferredBanks: ["50515"],
  };

  it("returns reserved account details including accounts array on success", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiPost).mockResolvedValueOnce({
      contractCode: "626843051499",
      accountReference: "ACCT-REF-001",
      accountName: "John Doe Wallet",
      currencyCode: "NGN",
      customerEmail: "customer@example.com",
      customerName: "John Doe",
      accounts: [
        { accountNumber: "1234567890", bankName: "Wema Bank", bankCode: "035" },
      ],
      collectionChannel: "RESERVED_ACCOUNT",
      reservationReference: "MRES_001",
      reservedAccountType: "GENERAL",
      status: "ACTIVE",
      createdOn: "2024-01-01T00:00:00.000+0000",
      internalRef: "should-be-stripped",
    });

    const { handler } = await import("../../src/tools/collections/reserveAccount.js");
    const result = await handler(validInput);

    expect(result.isError).toBeFalsy();
    expect(apiPost).toHaveBeenCalledWith(
      "/api/v2/bank-transfer/reserved-accounts",
      expect.objectContaining({
        accountReference: "ACCT-REF-001",
        contractCode: "626843051499",
        bvn: "12345678901",
        getAllAvailableBanks: true,
        preferredBanks: ["50515"],
      })
    );
    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(parsed.accountReference).toBe("ACCT-REF-001");
    expect(parsed.status).toBe("ACTIVE");
    expect(Array.isArray(parsed.accounts)).toBe(true);
    expect(parsed.accounts[0].accountNumber).toBe("1234567890");
  });

  it("sanitiser strips internal fields not in the whitelist", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiPost).mockResolvedValueOnce({
      accountReference: "ACCT-REF-001",
      accounts: [],
      status: "ACTIVE",
      internalRef: "secret-internal-ref",
      webhookUrl: "https://internal.webhook.com",
    });

    const { handler } = await import("../../src/tools/collections/reserveAccount.js");
    const result = await handler(validInput);

    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(parsed.internalRef).toBeUndefined();
    expect(parsed.webhookUrl).toBeUndefined();
  });

  it("fails validation when bvn is not exactly 11 digits", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/collections/reserveAccount.js");

    const result = await handler({ ...validInput, bvn: "1234567890" }); // 10 digits

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPost).not.toHaveBeenCalled();
  });

  it("fails validation when accountReference is missing", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/collections/reserveAccount.js");

    const { accountReference: _, ...noRef } = validInput;
    const result = await handler(noRef);

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPost).not.toHaveBeenCalled();
  });

  it("fails validation when customerEmail is invalid", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/collections/reserveAccount.js");

    const result = await handler({ ...validInput, customerEmail: "not-an-email" });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPost).not.toHaveBeenCalled();
  });

  it("returns MonnifyApiError when reserved accounts feature is not enabled", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { MonnifyApiError } = await import("../../src/utils/errors.js");

    vi.mocked(apiPost).mockRejectedValueOnce(
      new MonnifyApiError("99", "Reserved accounts not enabled for merchant", 403)
    );

    const { handler } = await import("../../src/tools/collections/reserveAccount.js");
    const result = await handler(validInput);

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Reserved accounts not enabled for merchant");
  });
});
