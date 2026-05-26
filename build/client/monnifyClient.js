import axios from "axios";
import { env } from "../config/env.js";
import { tokenManager } from "../auth/tokenManager.js";
import { logger } from "../utils/logger.js";
import { MonnifyApiError } from "../utils/errors.js";
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
function redactBody(body) {
    if (!body || typeof body !== "object")
        return body;
    return Object.fromEntries(Object.entries(body).map(([k, v]) => [
        k,
        SENSITIVE_FIELDS.has(k) ? "[REDACTED]" : v,
    ]));
}
function shouldRetry(error) {
    return !error.response || error.response.status >= 500;
}
function createClient() {
    const instance = axios.create({
        timeout: 30_000,
        headers: { "Content-Type": "application/json" },
    });
    instance.interceptors.request.use(async (config) => {
        config.baseURL = env().MONNIFY_BASE_URL;
        const token = await tokenManager.getToken();
        config.headers["Authorization"] = `Bearer ${token}`;
        const start = Date.now();
        config._startTime = start;
        logger.debug("Monnify request", {
            method: config.method?.toUpperCase(),
            url: config.url,
        });
        return config;
    });
    instance.interceptors.response.use((response) => {
        const config = response.config;
        const duration = config._startTime ? Date.now() - config._startTime : 0;
        logger.info("Monnify response", {
            method: response.config.method?.toUpperCase(),
            url: response.config.url,
            status: response.status,
            duration,
        });
        return response;
    }, async (error) => {
        // Strip auth headers FIRST — before any logging or retry logic
        if (error.config?.headers) {
            delete error.config.headers["Authorization"];
            delete error.config.headers["authorization"];
        }
        const retryCount = error.config?._retryCount ?? 0;
        // Retry 5xx and network errors (max 3, exponential backoff)
        if (retryCount < 3 && shouldRetry(error)) {
            error.config._retryCount =
                retryCount + 1;
            const delay = 500 * Math.pow(2, retryCount);
            logger.warn("Retrying Monnify request", {
                url: error.config?.url,
                attempt: retryCount + 1,
                delay,
            });
            await new Promise((res) => setTimeout(res, delay));
            return instance(error.config);
        }
        // On 401: clear token cache and retry once
        if (error.response?.status === 401 && retryCount === 0) {
            tokenManager.clearCache();
            error.config._retryCount = 1;
            logger.warn("Got 401 — clearing token cache and retrying once");
            return instance(error.config);
        }
        const responseData = error.response?.data;
        const httpStatus = error.response?.status ?? 0;
        logger.error("Monnify API error", {
            url: error.config?.url,
            status: httpStatus,
            responseCode: responseData?.["responseCode"],
            responseMessage: responseData?.["responseMessage"],
        });
        throw new MonnifyApiError(responseData?.["responseCode"] ?? "UNKNOWN", responseData?.["responseMessage"] ?? error.message, httpStatus);
    });
    return instance;
}
export const monnifyClient = createClient();
export async function apiGet(path, params) {
    const cleanParams = {};
    if (params) {
        for (const [k, v] of Object.entries(params)) {
            if (v !== undefined)
                cleanParams[k] = String(v);
        }
    }
    const { data } = await monnifyClient.get(path, {
        params: cleanParams,
    });
    return data.responseBody;
}
export async function apiPost(path, body) {
    const { data } = await monnifyClient.post(path, body);
    return data.responseBody;
}
export async function apiPatch(path, body) {
    const { data } = await monnifyClient.patch(path, body);
    return data.responseBody;
}
//# sourceMappingURL=monnifyClient.js.map