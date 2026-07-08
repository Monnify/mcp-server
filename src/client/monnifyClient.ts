import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { env } from "../config/env.js";
import { tokenManager } from "../auth/tokenManager.js";
import { logger } from "../utils/logger.js";
import { MonnifyApiError } from "../utils/errors.js";

interface AxiosRequestConfigWithRetry extends InternalAxiosRequestConfig {
  _retryCount?: number;
}

const SENSITIVE_FIELDS = new Set([
  "token",
  "accessToken",
  "secretKey",
  "apiKey",
  "bvn",
  "accountNumber",
  "authorizationCode",
  "password",
]);

function redactBody(body: unknown): unknown {
  if (!body || typeof body !== "object") return body;
  return Object.fromEntries(
    Object.entries(body as Record<string, unknown>).map(([k, v]) => [
      k,
      SENSITIVE_FIELDS.has(k) ? "[REDACTED]" : v,
    ])
  );
}

function shouldRetry(error: AxiosError): boolean {
  return !error.response || error.response.status >= 500;
}

function createClient(): AxiosInstance {
  const instance = axios.create({
    timeout: 30_000,
    headers: { "Content-Type": "application/json" },
  });

  instance.interceptors.request.use(async (config) => {
    config.baseURL = env().MONNIFY_BASE_URL;
    const token = await tokenManager.getToken();
    config.headers["Authorization"] = `Bearer ${token}`;

    const start = Date.now();
    (config as AxiosRequestConfigWithRetry & { _startTime?: number })._startTime = start;

    logger.debug("Monnify request", {
      method: config.method?.toUpperCase(),
      url: config.url,
    });

    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      const config = response.config as AxiosRequestConfigWithRetry & {
        _startTime?: number;
      };
      const duration = config._startTime ? Date.now() - config._startTime : 0;
      logger.info("Monnify response", {
        method: response.config.method?.toUpperCase(),
        url: response.config.url,
        status: response.status,
        duration,
      });
      return response;
    },
    async (error: AxiosError) => {
      // Strip auth headers FIRST — before any logging or retry logic
      if (error.config?.headers) {
        delete error.config.headers["Authorization"];
        delete error.config.headers["authorization"];
      }

      const retryCount =
        (error.config as AxiosRequestConfigWithRetry)?._retryCount ?? 0;

      // Retry 5xx and network errors (max 3, exponential backoff)
      if (retryCount < 3 && shouldRetry(error)) {
        (error.config as AxiosRequestConfigWithRetry)._retryCount =
          retryCount + 1;
        const delay = 500 * Math.pow(2, retryCount);
        logger.warn("Retrying Monnify request", {
          url: error.config?.url,
          attempt: retryCount + 1,
          delay,
        });
        await new Promise((res) => setTimeout(res, delay));
        return instance(error.config!);
      }

      // On 401: clear token cache and retry once
      if (error.response?.status === 401 && retryCount === 0) {
        tokenManager.clearCache();
        (error.config as AxiosRequestConfigWithRetry)._retryCount = 1;
        logger.warn("Got 401 — clearing token cache and retrying once");
        return instance(error.config!);
      }

      const responseData = error.response?.data as
        | Record<string, unknown>
        | undefined;
      const httpStatus = error.response?.status ?? 0;

      logger.error("Monnify API error", {
        url: error.config?.url,
        status: httpStatus,
        responseCode: responseData?.["responseCode"],
        responseMessage: responseData?.["responseMessage"],
      });

      throw new MonnifyApiError(
        (responseData?.["responseCode"] as string) ?? "UNKNOWN",
        (responseData?.["responseMessage"] as string) ?? error.message,
        httpStatus
      );
    }
  );

  return instance;
}

export const monnifyClient = createClient();

export async function apiGet<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  const cleanParams: Record<string, string> = {};
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) cleanParams[k] = String(v);
    }
  }
  const { data } = await monnifyClient.get<{ responseBody: T }>(path, {
    params: cleanParams,
  });
  return (data as unknown as { responseBody: T }).responseBody;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const { data } = await monnifyClient.post<{ responseBody: T }>(path, body);
  return (data as unknown as { responseBody: T }).responseBody;
}

export async function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  const { data } = await monnifyClient.patch<{ responseBody: T }>(path, body);
  return (data as unknown as { responseBody: T }).responseBody;
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const { data } = await monnifyClient.put<{ responseBody: T }>(path, body);
  return (data as unknown as { responseBody: T }).responseBody;
}

export async function apiDelete<T>(path: string): Promise<T> {
  const { data } = await monnifyClient.delete<{ responseBody: T }>(path);
  return (data as unknown as { responseBody: T }).responseBody;
}
