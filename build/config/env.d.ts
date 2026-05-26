import { z } from "zod";
declare const EnvSchema: z.ZodObject<{
    MONNIFY_API_KEY: z.ZodString;
    MONNIFY_SECRET_KEY: z.ZodString;
    MONNIFY_CONTRACT_CODE: z.ZodString;
    MONNIFY_BASE_URL: z.ZodDefault<z.ZodString>;
    MONNIFY_ENV: z.ZodDefault<z.ZodEnum<["sandbox", "production"]>>;
    TRANSPORT: z.ZodDefault<z.ZodEnum<["stdio", "http"]>>;
    PORT: z.ZodDefault<z.ZodNumber>;
    MONNIFY_ALLOWED_OPERATIONS: z.ZodOptional<z.ZodString>;
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    LOG_LEVEL: z.ZodDefault<z.ZodEnum<["error", "warn", "info", "debug"]>>;
}, "strip", z.ZodTypeAny, {
    MONNIFY_API_KEY: string;
    MONNIFY_SECRET_KEY: string;
    MONNIFY_CONTRACT_CODE: string;
    MONNIFY_BASE_URL: string;
    MONNIFY_ENV: "sandbox" | "production";
    TRANSPORT: "stdio" | "http";
    PORT: number;
    NODE_ENV: "production" | "development" | "test";
    LOG_LEVEL: "error" | "warn" | "info" | "debug";
    MONNIFY_ALLOWED_OPERATIONS?: string | undefined;
}, {
    MONNIFY_API_KEY: string;
    MONNIFY_SECRET_KEY: string;
    MONNIFY_CONTRACT_CODE: string;
    MONNIFY_BASE_URL?: string | undefined;
    MONNIFY_ENV?: "sandbox" | "production" | undefined;
    TRANSPORT?: "stdio" | "http" | undefined;
    PORT?: number | undefined;
    MONNIFY_ALLOWED_OPERATIONS?: string | undefined;
    NODE_ENV?: "production" | "development" | "test" | undefined;
    LOG_LEVEL?: "error" | "warn" | "info" | "debug" | undefined;
}>;
export type Env = z.infer<typeof EnvSchema>;
export declare function validateEnv(): Env;
export declare const env: () => Env;
export {};
//# sourceMappingURL=env.d.ts.map