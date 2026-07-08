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

describe("monnify_verify_bank_account", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns account name for valid account number and bank code", async () => {
    const { apiGet } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiGet).mockResolvedValueOnce({
      accountNumber: "0123456789",
      accountName: "JOHN DOE",
      bankCode: "058",
      bankName: "Guaranty Trust Bank",
    });

    const { handler } = await import(
      "../../src/tools/verification/verifyBankAccount.js"
    );

    const result = await handler({
      accountNumber: "0123456789",
      bankCode: "058",
    });

    expect(result.isError).toBeFalsy();
    expect(apiGet).toHaveBeenCalledWith(
      "/api/v2/disbursements/account/validate",
      { accountNumber: "0123456789", bankCode: "058" }
    );
    const text = result.content[0]?.text ?? "";
    const parsed = JSON.parse(text);
    expect(parsed.accountName).toBe("JOHN DOE");
    expect(parsed.accountNumber).toBe("0123456789");
    expect(parsed.bankName).toBe("Guaranty Trust Bank");
  });

  it("fails validation for 8-digit account number (Zod rejects before API call)", async () => {
    const { apiGet } = await import("../../src/client/monnifyClient.js");

    const { handler } = await import(
      "../../src/tools/verification/verifyBankAccount.js"
    );

    const result = await handler({
      accountNumber: "01234567", // only 8 digits
      bankCode: "058",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiGet).not.toHaveBeenCalled();
  });

  it("returns structured MonnifyApiError when account is not found", async () => {
    const { apiGet } = await import("../../src/client/monnifyClient.js");
    const { MonnifyApiError } = await import("../../src/utils/errors.js");

    vi.mocked(apiGet).mockRejectedValueOnce(
      new MonnifyApiError("99", "Account not found", 404)
    );

    const { handler } = await import(
      "../../src/tools/verification/verifyBankAccount.js"
    );

    const result = await handler({
      accountNumber: "0000000000",
      bankCode: "058",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Account not found");
  });
});
