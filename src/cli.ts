#!/usr/bin/env node
import { Command } from "commander";

const program = new Command();

program
  .name("monnify-mcp")
  .description("MCP server for Monnify payment APIs")
  .version("1.0.0")
  .requiredOption(
    "--apiKey <key>",
    "Monnify API key (from Dashboard → Settings → API Keys)"
  )
  .requiredOption("--secretKey <secret>", "Monnify secret key")
  .requiredOption("--contractCode <code>", "Monnify contract code")
  .option(
    "--env <environment>",
    "Target environment: sandbox or production",
    "sandbox"
  )
  .option("--transport <transport>", "Transport mode: stdio or http", "stdio")
  .option(
    "--port <port>",
    "HTTP port (only used when --transport=http)",
    "3000"
  )
  .option(
    "--tools <categories>",
    "Comma-separated list of tool categories to enable: collections,directDebit,verification,utilities,subAccounts"
  )
  .option(
    "--format <format>",
    "Response format override: auto (default), markdown, or json. Auto detects the client — Claude clients get markdown, engineering tools (VS Code, Copilot, Cursor) get JSON.",
    "auto"
  )
  .option(
    "--httpToken <token>",
    "Bearer token to authenticate /mcp requests (only used with --transport=http). Strongly recommended when exposing the server beyond localhost."
  )
  .parse(process.argv);

const opts = program.opts<{
  apiKey: string;
  secretKey: string;
  contractCode: string;
  env: string;
  transport: string;
  port: string;
  tools?: string;
  format: string;
  httpToken?: string;
}>();

process.env["MONNIFY_API_KEY"] = opts.apiKey;
process.env["MONNIFY_SECRET_KEY"] = opts.secretKey;
process.env["MONNIFY_CONTRACT_CODE"] = opts.contractCode;
process.env["MONNIFY_ENV"] = opts.env;
process.env["MONNIFY_BASE_URL"] =
  opts.env === "production"
    ? "https://app.monnify.com"
    : "https://sandbox.monnify.com";
process.env["TRANSPORT"] = opts.transport;
process.env["PORT"] = opts.port;

if (opts.tools) {
  process.env["MONNIFY_ALLOWED_OPERATIONS"] = opts.tools;
}

if (opts.format && opts.format !== "auto") {
  process.env["MONNIFY_RESPONSE_FORMAT"] = opts.format;
}

if (opts.httpToken) {
  process.env["MONNIFY_HTTP_TOKEN"] = opts.httpToken;
}

await import("./index.js");
