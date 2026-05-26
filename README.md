# @monnify/mcp

[![CI](https://github.com/monnify/monnify-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/monnify/monnify-mcp/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@monnify/mcp.svg)](https://www.npmjs.com/package/@monnify/mcp)

A production-grade [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server for the [Monnify payment APIs](https://developers.monnify.com). Built in TypeScript with OpenAPI-derived type safety, purpose-built tool descriptions, and fintech-grade security guardrails.

## Overview

This server exposes 22 named MCP tools across four categories: **collections**, **direct debit**, **verification**, and **utilities**. It is designed for use by AI agents (Claude, GPT, etc.) in regulated fintech environments where type safety, security, and idempotency are non-negotiable.

Key properties:

- **OpenAPI-driven type safety** — types and schemas are generated from the Monnify OpenAPI spec; API changes surface as TypeScript compile errors
- **Purpose-built tool descriptions** — every tool includes WHEN TO USE, PREREQUISITES, SIDE EFFECTS, and KEY OUTPUT FIELDS sections for accurate agent reasoning
- **Response sanitisation** — whitelisted output fields prevent prompt injection via adversarial API responses
- **Dual transport** — runs as a local stdio process (Claude Code) or a persistent HTTP server (team/production deployments)
- **Zero-install via npx** — no local installation required for quick setup

## Architecture

```
Monnify Postman Collection
        ↓ postman-to-openapi
openapi/monnify.yaml
        ↓ openapi-typescript          ↓ openapi-zod-client
src/types/monnify-api.d.ts    src/schemas/generated.ts
 (compile-time path types)      (runtime Zod schemas)
                  ↓ extend with .describe()
          src/schemas/extended/
                  ↓
          src/tools/**/*.ts
          (named tool handlers)
                  ↓
          MCP Server (stdio | http)
```

## Security Model

Five layers of defence:

1. **Auth header stripping** — Axios error interceptor removes `Authorization` headers before any logging or rethrowing, preventing token leakage
2. **Response sanitiser** — Every tool handler passes API responses through a whitelist sanitiser before returning to the MCP client; free-text fields that could contain adversarial instructions are blocked
3. **Operation allow-list** — `MONNIFY_ALLOWED_OPERATIONS` env var restricts which tool categories are registered at startup; enables least-privilege deployments
4. **Environment/URL consistency check** — Startup guard exits with code 1 if `MONNIFY_BASE_URL` and `MONNIFY_ENV` point to different environments; prevents accidental production operations
5. **Sensitive field redaction** — Winston logger redacts `bvn`, `accountNumber`, `token`, `apiKey`, `secretKey`, `authorizationCode`, and `password` from all log output

## Prerequisites

- Node.js 20 or later
- A [Monnify developer account](https://app.monnify.com/login) with API keys
- API key, secret key, and contract code from Monnify Dashboard → Developer → API Keys & Contracts

## Zero-install Usage (npx)

```bash
npx -y @monnify/mcp \
  --apiKey=YOUR_API_KEY \
  --secretKey=YOUR_SECRET_KEY \
  --contractCode=YOUR_CONTRACT_CODE \
  --env=sandbox
```

### CLI Options

| Flag             | Required | Default   | Description                         |
| ---------------- | -------- | --------- | ----------------------------------- |
| `--apiKey`       | ✅       | —         | Monnify API key                     |
| `--secretKey`    | ✅       | —         | Monnify secret key                  |
| `--contractCode` | ✅       | —         | Monnify contract code               |
| `--env`          | —        | `sandbox` | `sandbox` or `production`           |
| `--transport`    | —        | `stdio`   | `stdio` or `http`                   |
| `--port`         | —        | `3000`    | HTTP port (http transport only)     |
| `--tools`        | —        | all       | Comma-separated category allow-list |

### MCP Client Integration

This server uses the open [Model Context Protocol](https://modelcontextprotocol.io) and works with any MCP-compatible client. The `command` and `args` are identical across all clients — only the config key and file location differ.

| Client                   | Config key     | Config file                                                          |
| ------------------------ | -------------- | -------------------------------------------------------------------- |
| Claude Code              | `"servers"`    | `~/.claude/claude_desktop_config.json` or project `.claude/mcp.json` |
| Claude Desktop           | `"mcpServers"` | `~/Library/Application Support/Claude/claude_desktop_config.json`    |
| Cursor                   | `"mcpServers"` | `~/.cursor/mcp.json`                                                 |
| Windsurf                 | `"mcpServers"` | `~/.codeium/windsurf/mcp_config.json`                                |
| GitHub Copilot (VS Code) | `"servers"`    | `.vscode/mcp.json` in your workspace                                 |

**Claude Code**

```json
{
  "servers": {
    "monnify-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@monnify/mcp",
        "--apiKey=YOUR_API_KEY",
        "--secretKey=YOUR_SECRET_KEY",
        "--contractCode=YOUR_CONTRACT_CODE",
        "--env=sandbox"
      ]
    }
  }
}
```

**Claude Desktop / Cursor / Windsurf**

```json
{
  "mcpServers": {
    "monnify-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "@monnify/mcp",
        "--apiKey=YOUR_API_KEY",
        "--secretKey=YOUR_SECRET_KEY",
        "--contractCode=YOUR_CONTRACT_CODE",
        "--env=sandbox"
      ]
    }
  }
}
```

**GitHub Copilot (VS Code)** — create `.vscode/mcp.json` in your workspace with the same shape as the Claude Code config above (`"servers"` key).

> **ChatGPT, Gemini (web), Lovable** — these clients do not have an MCP runtime. Use the [HTTP transport](#http-transport) instead and connect via a custom plugin or function-calling integration.

## Installation from Source

```bash
git clone https://github.com/monnify/monnify-mcp.git
cd monnify-mcp
npm install
cp .env.example .env
# Edit .env with your Monnify credentials
npm run generate   # Generate types from OpenAPI spec
npm run build
npm start
```

## Regenerating Types

Run after any update to `openapi/monnify.yaml`:

```bash
npm run generate
npm run typecheck  # Verify no type errors introduced
```

The `generate` script runs `openapi-typescript` and `openapi-zod-client` in sequence.

## Available Tools (22)

### Collections

| Tool                              | Description                                               |
| --------------------------------- | --------------------------------------------------------- |
| `monnify_initiate_payment`        | Initiates a payment and returns a checkout URL            |
| `monnify_reserve_account`         | Reserves a virtual bank account for persistent collection |
| `monnify_get_transaction_status`  | Queries transaction status by reference                   |
| `monnify_get_transaction_details` | Fetches full details of a transaction                     |
| `monnify_get_all_transactions`    | Lists transactions with pagination and filters            |
| `monnify_create_invoice`          | Creates a payment invoice with expiry date                |
| `monnify_process_refund`          | Initiates a full or partial refund                        |
| `monnify_pay_with_bank_transfer`  | Initiates a pay-by-bank-transfer flow                     |
| `monnify_charge_card`             | Charges a card directly with PAN and CVV                  |
| `monnify_charge_card_token`       | Charges a previously tokenised card                       |
| `monnify_authorise_card_otp`      | Submits OTP to complete a card charge                     |
| `monnify_authorise_card_3ds`      | Completes 3DS authorisation for a card charge             |

### Direct Debit (Mandate Lifecycle)

| Tool                               | Description                                               |
| ---------------------------------- | --------------------------------------------------------- |
| `monnify_create_mandate`           | Creates a mandate (step 1 — always first)                 |
| `monnify_get_mandate_status`       | Checks mandate status (must be ACTIVATED before debiting) |
| `monnify_debit_mandate`            | Debits an ACTIVATED mandate                               |
| `monnify_get_mandate_debit_status` | Checks status of a debit attempt                          |
| `monnify_cancel_mandate`           | Cancels a mandate permanently                             |

### Verification

| Tool                          | Description                                     |
| ----------------------------- | ----------------------------------------------- |
| `monnify_verify_bank_account` | Verifies account number and returns holder name |
| `monnify_verify_bvn`          | Matches BVN against name, DOB, and phone        |
| `monnify_verify_bvn_info`     | Verifies all BVN details match (single boolean) |
| `monnify_verify_nin`          | Verifies NIN details and returns record fields  |

### Utilities

| Tool                          | Description                          |
| ----------------------------- | ------------------------------------ |
| `monnify_get_supported_banks` | Lists all supported banks with codes |

## Required Monnify Permissions

| Tool Category                     | Required Permission               |
| --------------------------------- | --------------------------------- |
| `utilities`                       | Basic API access                  |
| `verification`                    | Identity Verification API         |
| `collections`                     | Collections API                   |
| `collections` (reserved accounts) | Reserved Accounts feature enabled |
| `directDebit`                     | Direct Debit API                  |

### Least-privilege Deployment Examples

```bash
# Read-only (support tooling)
MONNIFY_ALLOWED_OPERATIONS=verification,utilities

# Collections only
MONNIFY_ALLOWED_OPERATIONS=collections,verification,utilities

# Full access (default when unset)
# all categories enabled
```

## HTTP Transport

For persistent team deployments:

```bash
TRANSPORT=http PORT=3000 node build/index.js
```

Connect via:

```bash
claude mcp add monnify-mcp --transport http http://localhost:3000/mcp
```

Health check: `GET /health` returns `{ status: "ok", environment: "sandbox", timestamp: "..." }`.

**Security note:** Add `Authorization: Bearer <token>` middleware before `/mcp` in production.

## Testing

```bash
npm test              # Run all tests once
npm run test:watch    # Watch mode
npm run typecheck     # TypeScript type checking only
```

## Automated Dependency Updates

[Renovate](https://docs.renovatebot.com) is configured in `renovate.json`. Patch updates and minor updates to the MCP SDK, Zod, Axios, and Winston auto-merge. Major updates require manual review.

## License

MIT
