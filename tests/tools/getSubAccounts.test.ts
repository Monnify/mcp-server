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

describe("monnify_get_sub_accounts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the list of sub accounts", async () => {
    const { apiGet } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiGet).mockResolvedValueOnce([
      {
        subAccountCode: "MFY_SUB_811397375865",
        accountNumber: "0211319282",
        accountName: "ALEMOH DANIEL MOSES",
        bankCode: "058",
        bankName: "GTBank",
        defaultSplitPercentage: 20,
      },
    ]);

    const { handler } = await import("../../src/tools/subAccounts/getSubAccounts.js");
    const result = await handler({});

    expect(result.isError).toBeFalsy();
    expect(apiGet).toHaveBeenCalledWith("/api/v1/sub-accounts");
    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(parsed).toHaveLength(1);
    expect(parsed[0].subAccountCode).toBe("MFY_SUB_811397375865");
  });

  it("returns an empty array when no sub accounts exist", async () => {
    const { apiGet } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiGet).mockResolvedValueOnce([]);

    const { handler } = await import("../../src/tools/subAccounts/getSubAccounts.js");
    const result = await handler({});

    expect(result.isError).toBeFalsy();
    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(parsed).toEqual([]);
  });

  it("returns MonnifyApiError on API failure", async () => {
    const { apiGet } = await import("../../src/client/monnifyClient.js");
    const { MonnifyApiError } = await import("../../src/utils/errors.js");

    vi.mocked(apiGet).mockRejectedValueOnce(
      new MonnifyApiError("99", "Not permitted for this account", 403)
    );

    const { handler } = await import("../../src/tools/subAccounts/getSubAccounts.js");
    const result = await handler({});

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Not permitted for this account");
  });
});
