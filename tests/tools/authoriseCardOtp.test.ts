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

describe("monnify_authorise_card_otp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns SUCCESS when OTP is correct", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiPost).mockResolvedValueOnce({
      transactionReference: "MNFY|XX|20231001|000001",
      paymentReference: "PAY-REF-001",
      authorizedAmount: 5000,
      status: "SUCCESS",
      message: "OTP authorisation successful",
    });

    const { handler } = await import("../../src/tools/collections/authoriseCardOtp.js");
    const result = await handler({
      transactionReference: "MNFY|XX|20231001|000001",
      tokenId: "100.00-b66bef0aa8e660863c4e1177a08fefba",
      token: "123456",
    });

    expect(result.isError).toBeFalsy();
    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(parsed.status).toBe("SUCCESS");
    expect(parsed.authorizedAmount).toBe(5000);
  });

  it("fails validation when token is too short", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/collections/authoriseCardOtp.js");

    const result = await handler({
      transactionReference: "MNFY|XX|20231001|000001",
      token: "12", // too short (min 4)
    });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPost).not.toHaveBeenCalled();
  });

  it("fails validation when transactionReference is missing", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/collections/authoriseCardOtp.js");

    const result = await handler({ token: "123456" });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPost).not.toHaveBeenCalled();
  });

  it("returns MonnifyApiError when OTP is expired", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { MonnifyApiError } = await import("../../src/utils/errors.js");

    vi.mocked(apiPost).mockRejectedValueOnce(
      new MonnifyApiError("06", "OTP expired or invalid", 400)
    );

    const { handler } = await import("../../src/tools/collections/authoriseCardOtp.js");
    const result = await handler({
      transactionReference: "MNFY|XX|20231001|000001",
      tokenId: "100.00-b66bef0aa8e660863c4e1177a08fefba",
      token: "999999",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("OTP expired or invalid");
  });
});
