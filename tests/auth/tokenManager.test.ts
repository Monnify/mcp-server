import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios from "axios";

vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

// Mock env before importing tokenManager
vi.mock("../../src/config/env.js", () => ({
  env: () => ({
    MONNIFY_API_KEY: "test-api-key",
    MONNIFY_SECRET_KEY: "test-secret-key",
    MONNIFY_BASE_URL: "https://sandbox.monnify.com",
    MONNIFY_ENV: "sandbox",
    MONNIFY_CONTRACT_CODE: "test-contract",
    TRANSPORT: "stdio",
    PORT: 3000,
    NODE_ENV: "test",
    LOG_LEVEL: "error",
  }),
  validateEnv: vi.fn(),
}));

vi.mock("../../src/utils/logger.js", () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe("TokenManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("fetches and caches token on first getToken() call", async () => {
    mockedAxios.post = vi.fn().mockResolvedValueOnce({
      data: {
        requestSuccessful: true,
        responseBody: {
          accessToken: "test-token-abc",
          expiresIn: 3600,
        },
      },
    });

    const { tokenManager } = await import("../../src/auth/tokenManager.js");
    const token = await tokenManager.getToken();

    expect(token).toBe("test-token-abc");
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });

  it("returns cached token on second call within TTL without hitting API", async () => {
    mockedAxios.post = vi.fn().mockResolvedValue({
      data: {
        requestSuccessful: true,
        responseBody: {
          accessToken: "cached-token",
          expiresIn: 3600,
        },
      },
    });

    const { tokenManager } = await import("../../src/auth/tokenManager.js");
    const token1 = await tokenManager.getToken();
    const token2 = await tokenManager.getToken();

    expect(token1).toBe(token2);
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });

  it("only makes one API request for concurrent getToken() calls (mutex)", async () => {
    let resolvePost: (value: unknown) => void;
    const postPromise = new Promise((resolve) => {
      resolvePost = resolve;
    });

    mockedAxios.post = vi.fn().mockReturnValue(postPromise);

    const { tokenManager } = await import("../../src/auth/tokenManager.js");

    // Fire two concurrent requests
    const p1 = tokenManager.getToken();
    const p2 = tokenManager.getToken();

    // Resolve the underlying API call
    resolvePost!({
      data: {
        requestSuccessful: true,
        responseBody: { accessToken: "mutex-token", expiresIn: 3600 },
      },
    });

    const [t1, t2] = await Promise.all([p1, p2]);
    expect(t1).toBe("mutex-token");
    expect(t2).toBe("mutex-token");
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });

  it("throws MonnifyApiError when auth fails with 401", async () => {
    const { MonnifyApiError } = await import("../../src/utils/errors.js");

    mockedAxios.post = vi.fn().mockRejectedValueOnce(
      Object.assign(new Error("Unauthorized"), {
        isAxiosError: true,
        response: {
          status: 401,
          data: {
            responseCode: "99",
            responseMessage: "Invalid credentials",
          },
        },
      })
    );
    mockedAxios.isAxiosError = vi.fn().mockReturnValue(true);

    const { tokenManager } = await import("../../src/auth/tokenManager.js");
    tokenManager.clearCache();

    await expect(tokenManager.getToken()).rejects.toThrow(MonnifyApiError);
  });
});
