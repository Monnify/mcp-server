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

describe("monnify_get_mandate_status", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls correct endpoint with mandateReferences (plural) query param", async () => {
    const { apiGet } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiGet).mockResolvedValueOnce([{
      mandateCode: "MTDD|01HY8WMN8JYKDRJC67QPQVS1N0",
      mandateReference: "unique_ref3_02gs600s972",
      mandateStatus: "ACTIVATED",
      mandateAmount: 50000,
      startDate: "2024-05-19T09:15:30.000+0000",
      endDate: "2025-05-19T09:15:30.000+0000",
      authorizationLink: "https://paylink.monnify.com/mandate-auth/abc",
    }]);

    const { handler } = await import("../../src/tools/directDebit/getMandateStatus.js");
    const result = await handler({ mandateReferences: "unique_ref3_02gs600s972" });

    expect(result.isError).toBeFalsy();

    const [path, params] = vi.mocked(apiGet).mock.calls[0];
    // Spec path is /api/v1/direct-debit/mandate/ (trailing slash)
    expect(path).toBe("/api/v1/direct-debit/mandate/");
    // Spec query param is mandateReferences (plural)
    expect(params).toHaveProperty("mandateReferences", "unique_ref3_02gs600s972");
    expect(params).not.toHaveProperty("mandateReference");
  });

  it("fails validation when mandateReferences is missing", async () => {
    const { apiGet } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/directDebit/getMandateStatus.js");

    const result = await handler({});
    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiGet).not.toHaveBeenCalled();
  });

  it("returns MonnifyApiError when mandate is not found", async () => {
    const { apiGet } = await import("../../src/client/monnifyClient.js");
    const { MonnifyApiError } = await import("../../src/utils/errors.js");
    vi.mocked(apiGet).mockRejectedValueOnce(
      new MonnifyApiError("404", "Mandate not found", 404)
    );

    const { handler } = await import("../../src/tools/directDebit/getMandateStatus.js");
    const result = await handler({ mandateReferences: "nonexistent-ref" });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Mandate not found");
  });
});
