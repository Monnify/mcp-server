import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

const EnvSchema = z.object({
  MONNIFY_API_KEY: z.string().min(1, "MONNIFY_API_KEY is required"),
  MONNIFY_SECRET_KEY: z.string().min(1, "MONNIFY_SECRET_KEY is required"),
  MONNIFY_CONTRACT_CODE: z.string().min(1, "MONNIFY_CONTRACT_CODE is required"),
  MONNIFY_BASE_URL: z.string().url().default("https://sandbox.monnify.com"),
  MONNIFY_ENV: z.enum(["sandbox", "production"]).default("sandbox"),
  TRANSPORT: z.enum(["stdio", "http"]).default("stdio"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  MONNIFY_ALLOWED_OPERATIONS: z.string().optional(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
});

export type Env = z.infer<typeof EnvSchema>;

let _env: Env | undefined;

export function validateEnv(): Env {
  const result = EnvSchema.safeParse(process.env);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  ${String(i.path[0])}: ${i.message}`)
      .join("\n");
    process.stderr.write(
      `\nMissing or invalid environment variables:\n${issues}\n\n`
    );
    process.exit(1);
  }
  _env = result.data;
  return _env;
}

export const env = (): Env => {
  if (!_env)
    throw new Error("validateEnv() must be called before accessing env()");
  return _env;
};
