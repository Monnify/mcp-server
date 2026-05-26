import winston from "winston";

const REDACTED_FIELDS = new Set([
  "token",
  "accessToken",
  "secretKey",
  "apiKey",
  "bvn",
  "accountNumber",
  "authorizationCode",
  "password",
]);

const redactSensitive = winston.format((info) => {
  if (info["data"] && typeof info["data"] === "object") {
    info["data"] = Object.fromEntries(
      Object.entries(info["data"] as Record<string, unknown>).map(([k, v]) => [
        k,
        REDACTED_FIELDS.has(k) ? "[REDACTED]" : v,
      ])
    );
  }
  return info;
});

export const logger = winston.createLogger({
  level: process.env["LOG_LEVEL"] ?? "info",
  format: winston.format.combine(
    redactSensitive(),
    process.env["NODE_ENV"] === "production"
      ? winston.format.json()
      : winston.format.prettyPrint()
  ),
  transports: [
    new winston.transports.Stream({ stream: process.stderr }),
  ],
});
