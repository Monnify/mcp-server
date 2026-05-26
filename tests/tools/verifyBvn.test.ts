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

describe("monnify_verify_bvn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validInput = {
    bvn: "12345678901",
    name: "John Doe",
    dateOfBirth: "15-03-1990",
    mobileNo: "2348012345678",
  };

  it("returns match booleans when BVN details match", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiPost).mockResolvedValueOnce({
      bvn: "12345678901",
      nameMatch: true,
      mobileNoMatch: true,
      dateOfBirthMatch: true,
      firstName: "should-be-stripped",
      lastName: "should-be-stripped",
    });

    const { handler } = await import("../../src/tools/verification/verifyBvn.js");
    const result = await handler(validInput);

    expect(result.isError).toBeFalsy();
    expect(apiPost).toHaveBeenCalledWith(
      "/api/v1/vas/bvn-details-match",
      expect.objectContaining({
        bvn: "12345678901",
        name: "John Doe",
        dateOfBirth: "15-03-1990",
        mobileNo: "2348012345678",
      })
    );
    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(parsed.bvn).toBe("12345678901");
    expect(parsed.nameMatch).toBe(true);
    expect(parsed.mobileNoMatch).toBe(true);
    expect(parsed.dateOfBirthMatch).toBe(true);
  });

  it("returns false match flags when details do not match", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiPost).mockResolvedValueOnce({
      bvn: "12345678901",
      nameMatch: false,
      mobileNoMatch: true,
      dateOfBirthMatch: false,
    });

    const { handler } = await import("../../src/tools/verification/verifyBvn.js");
    const result = await handler(validInput);

    expect(result.isError).toBeFalsy();
    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(parsed.nameMatch).toBe(false);
    expect(parsed.dateOfBirthMatch).toBe(false);
    expect(parsed.mobileNoMatch).toBe(true);
  });

  it("sanitiser strips firstName, lastName and other non-whitelisted fields", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiPost).mockResolvedValueOnce({
      bvn: "12345678901",
      nameMatch: true,
      mobileNoMatch: true,
      dateOfBirthMatch: true,
      firstName: "John",
      lastName: "Doe",
      gender: "Male",
    });

    const { handler } = await import("../../src/tools/verification/verifyBvn.js");
    const result = await handler(validInput);

    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(parsed.firstName).toBeUndefined();
    expect(parsed.lastName).toBeUndefined();
    expect(parsed.gender).toBeUndefined();
  });

  it("fails validation when bvn is not exactly 11 digits", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/verification/verifyBvn.js");

    const result = await handler({ ...validInput, bvn: "1234567890" }); // 10 digits

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPost).not.toHaveBeenCalled();
  });

  it("returns MonnifyApiError when BVN is not found", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { MonnifyApiError } = await import("../../src/utils/errors.js");

    vi.mocked(apiPost).mockRejectedValueOnce(
      new MonnifyApiError("99", "BVN not found", 404)
    );

    const { handler } = await import("../../src/tools/verification/verifyBvn.js");
    const result = await handler(validInput);

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("BVN not found");
  });
});
