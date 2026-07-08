import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/client/monnifyClient.js", () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiDelete: vi.fn(),
}));

vi.mock("../../src/tools/registry.js", () => ({
  registerTool: vi.fn(),
}));

vi.mock("../../src/utils/logger.js", () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

const SUB_ACCOUNT_CODE = "MFY_SUB_811397375865";

describe("monnify_delete_sub_account", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends DELETE to the path-param endpoint and confirms deletion", async () => {
    const { apiDelete } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiDelete).mockResolvedValueOnce(undefined);

    const { handler } = await import("../../src/tools/subAccounts/deleteSubAccount.js");
    const result = await handler({ subAccountCode: SUB_ACCOUNT_CODE });

    expect(result.isError).toBeFalsy();
    expect(apiDelete).toHaveBeenCalledWith(
      `/api/v1/sub-accounts/${SUB_ACCOUNT_CODE}`
    );
    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(parsed).toEqual({ subAccountCode: SUB_ACCOUNT_CODE, deleted: true });
  });

  it("fails validation when subAccountCode is missing", async () => {
    const { apiDelete } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/subAccounts/deleteSubAccount.js");

    const result = await handler({});

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiDelete).not.toHaveBeenCalled();
  });

  it("returns MonnifyApiError when the sub account does not exist", async () => {
    const { apiDelete } = await import("../../src/client/monnifyClient.js");
    const { MonnifyApiError } = await import("../../src/utils/errors.js");

    vi.mocked(apiDelete).mockRejectedValueOnce(
      new MonnifyApiError("99", "Sub account not found", 404)
    );

    const { handler } = await import("../../src/tools/subAccounts/deleteSubAccount.js");
    const result = await handler({ subAccountCode: SUB_ACCOUNT_CODE });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Sub account not found");
  });
});
