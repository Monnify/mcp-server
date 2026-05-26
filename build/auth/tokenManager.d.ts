declare class TokenManager {
    private cachedToken;
    private expiresAt;
    private inflightRequest;
    getToken(): Promise<string>;
    clearCache(): void;
    private fetchNewToken;
}
export declare const tokenManager: TokenManager;
export {};
//# sourceMappingURL=tokenManager.d.ts.map