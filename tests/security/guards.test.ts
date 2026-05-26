import { describe, it, expect, vi, afterEach } from "vitest";
import {
  assertEnvironmentConsistency,
  isOperationAllowed,
} from "../../src/security/guards.js";
import type { Env } from "../../src/config/env.js";

function makeEnv(overrides: Partial<Env> = {}): Env {
  return {
    MONNIFY_API_KEY: "MK_TEST_sandbox123",
    MONNIFY_SECRET_KEY: "test-secret",
    MONNIFY_CONTRACT_CODE: "test-contract",
    MONNIFY_BASE_URL: "https://sandbox.monnify.com",
    MONNIFY_ENV: "sandbox",
    TRANSPORT: "stdio",
    PORT: 3000,
    NODE_ENV: "test",
    LOG_LEVEL: "error",
    ...overrides,
  };
}

const VALID_PROD_KEY = "MK_PROD_Ab1Cd2Ef3G";
const VALID_SANDBOX_KEY = "MK_TEST_sandbox123";

describe("assertEnvironmentConsistency", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("exits with code 1 when URL is production but env is sandbox", () => {
    const exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation((_code?: number | string | null) => {
        throw new Error("process.exit called");
      });

    const stderrSpy = vi
      .spyOn(process.stderr, "write")
      .mockImplementation(() => true);

    const env = makeEnv({
      MONNIFY_BASE_URL: "https://app.monnify.com",
      MONNIFY_ENV: "sandbox",
    });

    expect(() => assertEnvironmentConsistency(env)).toThrow(
      "process.exit called"
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(stderrSpy).toHaveBeenCalledWith(expect.stringContaining("WARNING"));
  });

  it("passes silently when both URL and env are sandbox", () => {
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("should not exit");
    });

    const env = makeEnv({
      MONNIFY_BASE_URL: "https://sandbox.monnify.com",
      MONNIFY_ENV: "sandbox",
    });

    expect(() => assertEnvironmentConsistency(env)).not.toThrow();
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it("logs production warning when both URL and env are production", () => {
    const stderrSpy = vi
      .spyOn(process.stderr, "write")
      .mockImplementation(() => true);
    vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("unexpected exit");
    });

    const env = makeEnv({
      MONNIFY_API_KEY: VALID_PROD_KEY,
      MONNIFY_BASE_URL: "https://app.monnify.com",
      MONNIFY_ENV: "production",
    });

    expect(() => assertEnvironmentConsistency(env)).not.toThrow();
    expect(stderrSpy).toHaveBeenCalledWith(
      expect.stringContaining("PRODUCTION MODE")
    );
  });

  it("exits with code 1 when env is production but URL is sandbox", () => {
    const exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation(() => {
        throw new Error("process.exit called");
      });

    vi.spyOn(process.stderr, "write").mockImplementation(() => true);

    const env = makeEnv({
      MONNIFY_API_KEY: VALID_PROD_KEY,
      MONNIFY_BASE_URL: "https://sandbox.monnify.com",
      MONNIFY_ENV: "production",
    });

    expect(() => assertEnvironmentConsistency(env)).toThrow(
      "process.exit called"
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it("exits with code 1 when a sandbox key is used in production environment", () => {
    const exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation(() => {
        throw new Error("process.exit called");
      });
    vi.spyOn(process.stderr, "write").mockImplementation(() => true);

    const env = makeEnv({
      MONNIFY_API_KEY: VALID_SANDBOX_KEY,
      MONNIFY_BASE_URL: "https://app.monnify.com",
      MONNIFY_ENV: "production",
    });

    expect(() => assertEnvironmentConsistency(env)).toThrow(
      "process.exit called"
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it("exits with code 1 when a production key is used in sandbox environment", () => {
    const exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation(() => {
        throw new Error("process.exit called");
      });
    vi.spyOn(process.stderr, "write").mockImplementation(() => true);

    const env = makeEnv({
      MONNIFY_API_KEY: VALID_PROD_KEY,
      MONNIFY_BASE_URL: "https://sandbox.monnify.com",
      MONNIFY_ENV: "sandbox",
    });

    expect(() => assertEnvironmentConsistency(env)).toThrow(
      "process.exit called"
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it("passes when a valid production key matches production environment", () => {
    vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("unexpected exit");
    });
    vi.spyOn(process.stderr, "write").mockImplementation(() => true);

    const env = makeEnv({
      MONNIFY_API_KEY: VALID_PROD_KEY,
      MONNIFY_BASE_URL: "https://app.monnify.com",
      MONNIFY_ENV: "production",
    });

    expect(() => assertEnvironmentConsistency(env)).not.toThrow();
  });

  it("passes when a valid sandbox key matches sandbox environment", () => {
    vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("unexpected exit");
    });
    vi.spyOn(process.stderr, "write").mockImplementation(() => true);

    const env = makeEnv({
      MONNIFY_API_KEY: VALID_SANDBOX_KEY,
      MONNIFY_BASE_URL: "https://sandbox.monnify.com",
      MONNIFY_ENV: "sandbox",
    });

    expect(() => assertEnvironmentConsistency(env)).not.toThrow();
  });
});

describe("isOperationAllowed", () => {
  it("returns true for any category when MONNIFY_ALLOWED_OPERATIONS is unset", () => {
    const env = makeEnv({ MONNIFY_ALLOWED_OPERATIONS: undefined });

    expect(isOperationAllowed("collections", env)).toBe(true);
    expect(isOperationAllowed("directDebit", env)).toBe(true);
    expect(isOperationAllowed("verification", env)).toBe(true);
    expect(isOperationAllowed("utilities", env)).toBe(true);
  });

  it("returns false for 'collections' when MONNIFY_ALLOWED_OPERATIONS=verification,utilities", () => {
    const env = makeEnv({
      MONNIFY_ALLOWED_OPERATIONS: "verification,utilities",
    });

    expect(isOperationAllowed("collections", env)).toBe(false);
  });

  it("returns false for 'directDebit' when MONNIFY_ALLOWED_OPERATIONS=verification,utilities", () => {
    const env = makeEnv({
      MONNIFY_ALLOWED_OPERATIONS: "verification,utilities",
    });

    expect(isOperationAllowed("directDebit", env)).toBe(false);
  });

  it("returns true for 'verification' when explicitly listed", () => {
    const env = makeEnv({
      MONNIFY_ALLOWED_OPERATIONS: "verification,utilities",
    });

    expect(isOperationAllowed("verification", env)).toBe(true);
    expect(isOperationAllowed("utilities", env)).toBe(true);
  });

  it("handles whitespace in MONNIFY_ALLOWED_OPERATIONS", () => {
    const env = makeEnv({
      MONNIFY_ALLOWED_OPERATIONS: " verification , utilities ",
    });

    expect(isOperationAllowed("verification", env)).toBe(true);
    expect(isOperationAllowed("collections", env)).toBe(false);
  });
});
