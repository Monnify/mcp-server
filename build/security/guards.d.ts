import type { Env } from "../config/env.js";
export type OperationCategory = "collections" | "directDebit" | "verification" | "utilities";
export declare function assertEnvironmentConsistency(env: Env): void;
export declare function isOperationAllowed(category: OperationCategory, env: Env): boolean;
//# sourceMappingURL=guards.d.ts.map