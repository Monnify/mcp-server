import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/client/monnifyClient.js", () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPatch: vi.fn(),
}));

vi.mock("../../src/tools/registry.js", () => ({
  registerTool: vi.fn(),
}));

vi.mock("../../src/utils/logger.js", () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

const MANDATE_CODE = "MTDD|01HY8WMN8JYKDRJC67QPQVS1N0";
const MANDATE_CODE_ENCODED = "MTDD%7C01HY8WMN8JYKDRJC67QPQVS1N0";

describe("monnify_cancel_mandate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends PATCH to path-param endpoint — no request body", async () => {
    const { apiPatch } = await import("../../src/client/monnifyClient.js");
    vi.mocked(apiPatch).mockResolvedValueOnce({
      mandateReference: "unique_ref3",
      mandateStatus: "CANCELLED",
    });

    const { handler } = await import("../../src/tools/directDebit/cancelMandate.js");
    const result = await handler({ mandateCode: MANDATE_CODE });

    expect(result.isError).toBeFalsy();
    // Spec: PATCH /api/v1/direct-debit/mandate/cancel-mandate/{mandateCode} with mandateCode URL-encoded
    expect(apiPatch).toHaveBeenCalledWith(
      `/api/v1/direct-debit/mandate/cancel-mandate/${MANDATE_CODE_ENCODED}`
    );
    // No body argument
    const callArgs = vi.mocked(apiPatch).mock.calls[0];
    expect(callArgs).toHaveLength(1);
  });

  it("fails validation when mandateCode is missing", async () => {
    const { apiPatch } = await import("../../src/client/monnifyClient.js");
    const { handler } = await import("../../src/tools/directDebit/cancelMandate.js");

    const result = await handler({});
    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Validation failed");
    expect(apiPatch).not.toHaveBeenCalled();
  });

  it("returns MonnifyApiError when mandate cannot be cancelled", async () => {
    const { apiPatch } = await import("../../src/client/monnifyClient.js");
    const { MonnifyApiError } = await import("../../src/utils/errors.js");
    vi.mocked(apiPatch).mockRejectedValueOnce(
      new MonnifyApiError("99", "Mandate already cancelled", 400)
    );

    const { handler } = await import("../../src/tools/directDebit/cancelMandate.js");
    const result = await handler({ mandateCode: MANDATE_CODE });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("Mandate already cancelled");
  });
});
