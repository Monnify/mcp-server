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

const validArgs = {
  transactionReference: "MNFY|XX|20231001|000001",
  collectionChannel: "API_NOTIFICATION",
  card: {
    number: "5061040000000000",
    expiryMonth: "10",
    expiryYear: "2025",
    pin: "1234",
    cvv: "123",
  },
  deviceInformation: {
    httpBrowserLanguage: "en-US",
    httpBrowserJavaEnabled: false,
    httpBrowserJavaScriptEnabled: true,
    httpBrowserColorDepth: 24,
    httpBrowserScreenHeight: 900,
    httpBrowserScreenWidth: 1440,
    httpBrowserTimeDifference: "-60",
    userAgentBrowserValue: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
  },
};

describe("monnify_charge_card", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns SUCCESS status when card is charged immediately", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiPost).mockResolvedValueOnce({
      status: "SUCCESS",
      message: "Transaction Successful",
      transactionReference: "MNFY|XX|20231001|000001",
      paymentReference: "PAY-REF-001",
      authorizedAmount: 5000,
    });

    const { handler } = await import("../../src/tools/collections/chargeCard.js");
    const result = await handler(validArgs);

    expect(result.isError).toBeFalsy();
    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(parsed.status).toBe("SUCCESS");
    expect(parsed.transactionReference).toBe("MNFY|XX|20231001|000001");
    expect(parsed.authorizedAmount).toBe(5000);
  });

  it("returns OTP_AUTHORIZATION_REQUIRED status with otpData when OTP is required", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiPost).mockResolvedValueOnce({
      status: "OTP_AUTHORIZATION_REQUIRED",
      message: "OTP Authorization required",
      transactionReference: "MNFY|XX|20231001|000001",
      paymentReference: "PAY-REF-001",
      authorizedAmount: 5000,
      otpData: {
        id: "100.00-b66bef0aa8e660863c4e1177a08fefba",
        message: "Please enter OTP sent to your phone",
        authData: "5060995994247093",
      },
    });

    const { handler } = await import("../../src/tools/collections/chargeCard.js");
    const result = await handler(validArgs);

    expect(result.isError).toBeFalsy();
    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(parsed.status).toBe("OTP_AUTHORIZATION_REQUIRED");
    expect(parsed.otpData.id).toBe("100.00-b66bef0aa8e660863c4e1177a08fefba");
    expect(parsed.otpData.message).toContain("OTP");
  });

  it("returns BANK_AUTHORIZATION_REQUIRED status with secure3dData for 3DS", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiPost).mockResolvedValueOnce({
      status: "BANK_AUTHORIZATION_REQUIRED",
      message: "3D Secure Authorization required",
      transactionReference: "MNFY|XX|20231001|000001",
      paymentReference: "PAY-REF-001",
      authorizedAmount: 5000,
      secure3dData: {
        id: "100.00-59077a3e5157fae7ca9dd260d911ccbb",
        redirectUrl: "https://3ds.bank.ng/auth",
      },
    });

    const { handler } = await import("../../src/tools/collections/chargeCard.js");
    const result = await handler(validArgs);

    expect(result.isError).toBeFalsy();
    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(parsed.status).toBe("BANK_AUTHORIZATION_REQUIRED");
    expect(parsed.secure3dData.redirectUrl).toContain("3ds.bank.ng");
  });

  it("fails validation when card number is not 16 digits", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/collections/chargeCard.js");

    const result = await handler({
      ...validArgs,
      card: { ...validArgs.card, number: "123456" },
    });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPost).not.toHaveBeenCalled();
  });

  it("fails validation when expiryMonth is out of range", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/collections/chargeCard.js");

    const result = await handler({
      ...validArgs,
      card: { ...validArgs.card, expiryMonth: "13" },
    });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPost).not.toHaveBeenCalled();
  });

  it("returns MonnifyApiError when card is declined", async () => {
    const { apiPost } = await import("../../src/client/monnifyClient.js");
    const { MonnifyApiError } = await import("../../src/utils/errors.js");

    vi.mocked(apiPost).mockRejectedValueOnce(
      new MonnifyApiError("05", "Do not honour", 400)
    );

    const { handler } = await import("../../src/tools/collections/chargeCard.js");
    const result = await handler(validArgs);

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Do not honour");
  });
});
