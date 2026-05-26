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

describe("monnify_verify_nin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns NIN record fields when details match", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiPost).mockResolvedValueOnce({
      nin: "98765432101",
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "01-Jan-1990",
      gender: "Male",
      phoneNumber: "08012345678",
      ninInformationMatch: true,
    });

    const { handler } = await import(
      "../../src/tools/verification/verifyNin.js"
    );

    const result = await handler({
      nin: "98765432101",
    });

    expect(result.isError).toBeFalsy();
    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(parsed.ninInformationMatch).toBe(true);
    expect(parsed.firstName).toBe("John");
    expect(parsed.lastName).toBe("Doe");
    expect(parsed.gender).toBe("Male");
  });

  it("fails validation for NIN shorter than 11 digits", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");

    const { handler } = await import(
      "../../src/tools/verification/verifyNin.js"
    );

    const result = await handler({
      nin: "9876543210", // only 10 digits
    });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPost).not.toHaveBeenCalled();
  });

  it("returns structured MonnifyApiError on API failure", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { MonnifyApiError } = await import("../../src/utils/errors.js");

    vi.mocked(apiPost).mockRejectedValueOnce(
      new MonnifyApiError("99", "NIN not found", 404)
    );

    const { handler } = await import(
      "../../src/tools/verification/verifyNin.js"
    );

    const result = await handler({
      nin: "00000000000",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("NIN not found");
  });
});
