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

describe("monnify_verify_bvn_info", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns bvnInformationMatch true when details match BVN record", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiPost).mockResolvedValueOnce({
      bvn: "12345678901",
      name: "John Doe",
      dateOfBirth: "01-Jan-1990",
      mobileNo: "08012345678",
      bvnInformationMatch: true,
    });

    const { handler } = await import(
      "../../src/tools/verification/verifyBvnInfo.js"
    );

    const result = await handler({
      bvn: "12345678901",
      name: "John Doe",
      dateOfBirth: "01-Jan-1990",
      mobileNo: "08012345678",
    });

    expect(result.isError).toBeFalsy();
    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(parsed.bvnInformationMatch).toBe(true);
    expect(parsed.bvn).toBe("12345678901");
  });

  it("fails validation for BVN shorter than 11 digits", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");

    const { handler } = await import(
      "../../src/tools/verification/verifyBvnInfo.js"
    );

    const result = await handler({
      bvn: "1234567890", // only 10 digits
      name: "John Doe",
      dateOfBirth: "01-Jan-1990",
      mobileNo: "08012345678",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPost).not.toHaveBeenCalled();
  });

  it("returns structured MonnifyApiError on API failure", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { MonnifyApiError } = await import("../../src/utils/errors.js");

    vi.mocked(apiPost).mockRejectedValueOnce(
      new MonnifyApiError("99", "BVN not found", 404)
    );

    const { handler } = await import(
      "../../src/tools/verification/verifyBvnInfo.js"
    );

    const result = await handler({
      bvn: "00000000000",
      name: "John Doe",
      dateOfBirth: "01-Jan-1990",
      mobileNo: "08012345678",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("BVN not found");
  });
});
