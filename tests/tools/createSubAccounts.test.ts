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

describe("monnify_create_sub_accounts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validInput = {
    subAccounts: [
      {
        currencyCode: "NGN",
        accountNumber: "0211319282",
        bankCode: "058",
        email: "vendor@example.com",
        defaultSplitPercentage: 20,
      },
    ],
  };

  it("posts the sub-accounts array directly (not wrapped) to /api/v1/sub-accounts", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiPost).mockResolvedValueOnce([
      {
        subAccountCode: "MFY_SUB_811397375865",
        accountNumber: "0211319282",
        accountName: "ALEMOH DANIEL MOSES",
        currencyCode: "NGN",
        email: "vendor@example.com",
        bankCode: "058",
        bankName: "GTBank",
        defaultSplitPercentage: 20,
        settlementProfileCode: "8717495899",
        settlementReportEmails: ["vendor@example.com"],
      },
    ]);

    const { handler } = await import("../../src/tools/subAccounts/createSubAccounts.js");
    const result = await handler(validInput);

    expect(result.isError).toBeFalsy();
    expect(apiPost).toHaveBeenCalledWith(
      "/api/v1/sub-accounts",
      validInput.subAccounts
    );
    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(parsed).toHaveLength(1);
    expect(parsed[0].subAccountCode).toBe("MFY_SUB_811397375865");
    expect(parsed[0].settlementReportEmails).toBeUndefined();
  });

  it("fails validation when subAccounts is empty", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/subAccounts/createSubAccounts.js");

    const result = await handler({ subAccounts: [] });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPost).not.toHaveBeenCalled();
  });

  it("fails validation when a required field is missing", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/subAccounts/createSubAccounts.js");

    const { email: _, ...noEmail } = validInput.subAccounts[0]!;
    const result = await handler({ subAccounts: [noEmail] });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPost).not.toHaveBeenCalled();
  });

  it("returns MonnifyApiError when Sub Accounts feature is not permitted", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { MonnifyApiError } = await import("../../src/utils/errors.js");

    vi.mocked(apiPost).mockRejectedValueOnce(
      new MonnifyApiError("99", "Not permitted for this account", 403)
    );

    const { handler } = await import("../../src/tools/subAccounts/createSubAccounts.js");
    const result = await handler(validInput);

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Not permitted for this account");
  });
});
