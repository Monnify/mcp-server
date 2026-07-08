import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/client/monnifyClient.js", () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPut: vi.fn(),
}));

vi.mock("../../src/tools/registry.js", () => ({
  registerTool: vi.fn(),
}));

vi.mock("../../src/utils/logger.js", () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

describe("monnify_update_sub_account", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validInput = {
    subAccountCode: "MFY_SUB_811397375865",
    currencyCode: "NGN",
    accountNumber: "0211319282",
    bankCode: "058",
    email: "vendor@example.com",
    defaultSplitPercentage: 25,
  };

  it("sends PUT to /api/v1/sub-accounts with the full update payload", async () => {
    const { apiPut } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiPut).mockResolvedValueOnce({
      subAccountCode: "MFY_SUB_811397375865",
      accountNumber: "0211319282",
      accountName: "ALEMOH DANIEL MOSES",
      bankCode: "058",
      bankName: "GTBank",
      defaultSplitPercentage: 25,
    });

    const { handler } = await import("../../src/tools/subAccounts/updateSubAccount.js");
    const result = await handler(validInput);

    expect(result.isError).toBeFalsy();
    expect(apiPut).toHaveBeenCalledWith(
      "/api/v1/sub-accounts",
      expect.objectContaining({ subAccountCode: "MFY_SUB_811397375865", defaultSplitPercentage: 25 })
    );
    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(parsed.defaultSplitPercentage).toBe(25);
  });

  it("fails validation when subAccountCode is missing", async () => {
    const { apiPut } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/subAccounts/updateSubAccount.js");

    const { subAccountCode: _, ...noCode } = validInput;
    const result = await handler(noCode);

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPut).not.toHaveBeenCalled();
  });

  it("returns MonnifyApiError when the sub account does not exist", async () => {
    const { apiPut } = await import("../../src/client/monnifyClient.js");
    const { MonnifyApiError } = await import("../../src/utils/errors.js");

    vi.mocked(apiPut).mockRejectedValueOnce(
      new MonnifyApiError("99", "Sub account not found", 404)
    );

    const { handler } = await import("../../src/tools/subAccounts/updateSubAccount.js");
    const result = await handler(validInput);

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Sub account not found");
  });
});
