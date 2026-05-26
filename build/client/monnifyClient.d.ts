import { type AxiosInstance } from "axios";
export declare const monnifyClient: AxiosInstance;
export declare function apiGet<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T>;
export declare function apiPost<T>(path: string, body: unknown): Promise<T>;
export declare function apiPatch<T>(path: string, body?: unknown): Promise<T>;
//# sourceMappingURL=monnifyClient.d.ts.map