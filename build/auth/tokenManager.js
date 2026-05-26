import axios from "axios";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { MonnifyApiError } from "../utils/errors.js";
class TokenManager {
    cachedToken = null;
    expiresAt = 0;
    inflightRequest = null;
    async getToken() {
        if (this.cachedToken && Date.now() < this.expiresAt) {
            return this.cachedToken;
        }
        if (this.inflightRequest) {
            return this.inflightRequest;
        }
        this.inflightRequest = this.fetchNewToken().finally(() => {
            this.inflightRequest = null;
        });
        return this.inflightRequest;
    }
    clearCache() {
        this.cachedToken = null;
        this.expiresAt = 0;
    }
    async fetchNewToken() {
        const { MONNIFY_API_KEY, MONNIFY_SECRET_KEY, MONNIFY_BASE_URL } = env();
        const credentials = Buffer.from(`${MONNIFY_API_KEY}:${MONNIFY_SECRET_KEY}`).toString("base64");
        logger.debug("Fetching new Monnify access token");
        let response;
        try {
            response = await axios.post(`${MONNIFY_BASE_URL}/api/v1/auth/login`, {}, {
                headers: {
                    Authorization: `Basic ${credentials}`,
                    "Content-Type": "application/json",
                },
                timeout: 30_000,
            });
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                throw new MonnifyApiError(error.response?.data?.responseCode ?? "AUTH_FAILED", error.response?.data?.responseMessage ?? "Authentication failed", error.response?.status ?? 0);
            }
            throw error;
        }
        const body = response.data.responseBody;
        const accessToken = body?.accessToken;
        const expiresIn = body?.expiresIn;
        if (!accessToken || !expiresIn) {
            throw new MonnifyApiError("AUTH_FAILED", "Invalid auth response — missing token or expiry", 0);
        }
        this.cachedToken = accessToken;
        // Subtract 60s buffer from expiry
        this.expiresAt = Date.now() + (expiresIn - 60) * 1000;
        logger.info("Monnify access token refreshed", {
            expiresIn,
            expiresAt: new Date(this.expiresAt).toISOString(),
        });
        return accessToken;
    }
}
export const tokenManager = new TokenManager();
//# sourceMappingURL=tokenManager.js.map