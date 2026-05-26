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

describe("monnify_get_supported_banks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a list of banks with name and code fields", async () => {
    const { apiGet } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiGet).mockResolvedValueOnce([
      { name: "Guaranty Trust Bank", code: "058", ussdTemplate: "*737*{1}*{2}#", nipCode: "058" },
      { name: "Access Bank", code: "044", ussdTemplate: "*901*{1}*{2}#", nipCode: "044" },
      { name: "Wema Bank", code: "035", ussdTemplate: "*945*{1}*{2}#", nipCode: "035" },
    ]);

    const { handler } = await import("../../src/tools/utilities/getSupportedBanks.js");
    const result = await handler({});

    expect(result.isError).toBeFalsy();
    expect(apiGet).toHaveBeenCalledWith("/api/v1/banks");
    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toHaveLength(3);
    expect(parsed[0]).toEqual({ name: "Guaranty Trust Bank", code: "058" });
    expect(parsed[1]).toEqual({ name: "Access Bank", code: "044" });
  });

  it("sanitiser strips ussdTemplate, nipCode and other non-whitelisted bank fields", async () => {
    const { apiGet } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiGet).mockResolvedValueOnce([
      {
        name: "Guaranty Trust Bank",
        code: "058",
        ussdTemplate: "*737*{1}*{2}#",
        nipCode: "058",
        sortCode: "058152152",
        logoUrl: "https://bank.logo.com/gtb.png",
      },
    ]);

    const { handler } = await import("../../src/tools/utilities/getSupportedBanks.js");
    const result = await handler({});

    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(parsed[0].ussdTemplate).toBeUndefined();
    expect(parsed[0].nipCode).toBeUndefined();
    expect(parsed[0].sortCode).toBeUndefined();
    expect(parsed[0].logoUrl).toBeUndefined();
    expect(parsed[0].name).toBe("Guaranty Trust Bank");
    expect(parsed[0].code).toBe("058");
  });

  it("returns an empty array when no banks are available", async () => {
    const { apiGet } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiGet).mockResolvedValueOnce([]);

    const { handler } = await import("../../src/tools/utilities/getSupportedBanks.js");
    const result = await handler({});

    expect(result.isError).toBeFalsy();
    const parsed = JSON.parse(result.content[0]?.text ?? "");
    expect(parsed).toEqual([]);
  });

  it("returns MonnifyApiError on API failure", async () => {
    const { apiGet } = await import("../../src/client/monnifyClient.js");
    const { MonnifyApiError } = await import("../../src/utils/errors.js");

    vi.mocked(apiGet).mockRejectedValueOnce(
      new MonnifyApiError("99", "Service temporarily unavailable", 503)
    );

    const { handler } = await import("../../src/tools/utilities/getSupportedBanks.js");
    const result = await handler({});

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Service temporarily unavailable");
  });
});
