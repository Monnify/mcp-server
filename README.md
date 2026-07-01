# @monnify/mcp-server

[![CI](https://github.com/monnify/monnify-mcp-server/actions/workflows/ci.yml/badge.svg)](https://github.com/monnify/monnify-mcp-server/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@monnify/mcp-server.svg)](https://www.npmjs.com/package/@monnify/mcp-server)

Give your AI assistant the ability to accept payments, verify identities, manage virtual accounts, and query transactions — all through [Monnify](https://monnify.com).

This is an [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server. Once connected, your AI client can talk directly to the Monnify API using plain language — no custom integration code required.

---

## What you can do once it's connected

**Payment collection**
> *"Initiate a payment of ₦15,000 for invoice #INV-2024-007 and send me the checkout link"*
> *"Create a dedicated virtual account for customer cust_089 so they can pay anytime by bank transfer"*
> *"Get me the status of transaction TRX-20240601-001"*
> *"Show me all failed transactions from last week"*

**Identity verification**
> *"Verify that account 0123456789 belongs to John Doe at GTBank"*
> *"Check BVN 22345678901 — does the name and date of birth match?"*
> *"Verify NIN 12345678901 for a customer named Amaka Obi"*

**Account management**
> *"What transactions came into reserved account ACCT-REF-001 this month?"*
> *"Deallocate the virtual account for the customer who churned last quarter"*
> *"Create a payment invoice for ₦50,000 that expires in 48 hours"*

**Engineering / integrations**
> *"List all banks and their codes so I can populate a dropdown"*
> *"Get the full details of transaction REF-XYZ for a support ticket"*
> *"Process a partial refund of ₦2,500 on transaction TRX-20240601-009"*

---

## Prerequisites

- Node.js 20 or later
- A [Monnify account](https://app.monnify.com/login) with API access enabled
- Your **API Key**, **Secret Key**, and **Contract Code** from the Monnify Dashboard → Developer → API Keys & Contracts

---

## Quick start (no install needed)

```bash
npx -y @monnify/mcp-server \
  --apiKey=YOUR_API_KEY \
  --secretKey=YOUR_SECRET_KEY \
  --contractCode=YOUR_CONTRACT_CODE \
  --env=sandbox
```

Switch `--env=sandbox` to `--env=production` when you're ready to go live.

---

## Connect to your AI client

The server speaks the MCP stdio protocol, which is supported by all major AI tools. Pick yours below.

---

### Claude Desktop

**Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "monnify": {
      "command": "npx",
      "args": [
        "-y",
        "@monnify/mcp-server",
        "--apiKey=YOUR_API_KEY",
        "--secretKey=YOUR_SECRET_KEY",
        "--contractCode=YOUR_CONTRACT_CODE",
        "--env=sandbox"
      ]
    }
  }
}
```

Restart Claude Desktop after saving. You will see "monnify" appear in the tools panel.

---

### Claude Code (CLI)

**Project-level** — add to `.claude/mcp.json` in your repo (checked in, shared with your team):

```json
{
  "servers": {
    "monnify": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@monnify/mcp-server",
        "--apiKey=YOUR_API_KEY",
        "--secretKey=YOUR_SECRET_KEY",
        "--contractCode=YOUR_CONTRACT_CODE",
        "--env=sandbox"
      ]
    }
  }
}
```

**Global** — add to `~/.claude/claude_desktop_config.json` so it's available in every Claude Code session:

```bash
claude mcp add monnify \
  -- npx -y @monnify/mcp-server \
  --apiKey=YOUR_API_KEY \
  --secretKey=YOUR_SECRET_KEY \
  --contractCode=YOUR_CONTRACT_CODE \
  --env=sandbox
```

Verify it loaded:
```bash
claude mcp list
```

---

### ChatGPT Desktop (OpenAI)

**Mac:** `~/Library/Application Support/ChatGPT/mcp.json`
**Windows:** `%APPDATA%\ChatGPT\mcp.json`

```json
{
  "mcpServers": {
    "monnify": {
      "command": "npx",
      "args": [
        "-y",
        "@monnify/mcp-server",
        "--apiKey=YOUR_API_KEY",
        "--secretKey=YOUR_SECRET_KEY",
        "--contractCode=YOUR_CONTRACT_CODE",
        "--env=sandbox"
      ]
    }
  }
}
```

Restart ChatGPT Desktop. MCP tools will appear in the tool-use panel when you start a new conversation.

---

### Gemini CLI

Add to `~/.gemini/settings.json`:

```json
{
  "mcpServers": {
    "monnify": {
      "command": "npx",
      "args": [
        "-y",
        "@monnify/mcp-server",
        "--apiKey=YOUR_API_KEY",
        "--secretKey=YOUR_SECRET_KEY",
        "--contractCode=YOUR_CONTRACT_CODE",
        "--env=sandbox"
      ]
    }
  }
}
```

Run `gemini` in your terminal — type `@monnify` to confirm the server is available.

---

### Cursor

Add to `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` in your project root:

```json
{
  "mcpServers": {
    "monnify": {
      "command": "npx",
      "args": [
        "-y",
        "@monnify/mcp-server",
        "--apiKey=YOUR_API_KEY",
        "--secretKey=YOUR_SECRET_KEY",
        "--contractCode=YOUR_CONTRACT_CODE",
        "--env=sandbox"
      ]
    }
  }
}
```

Open Cursor Settings → MCP to confirm the server shows as active.

---

### VS Code + GitHub Copilot

Create `.vscode/mcp.json` in your workspace root:

```json
{
  "servers": {
    "monnify": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@monnify/mcp-server",
        "--apiKey=YOUR_API_KEY",
        "--secretKey=YOUR_SECRET_KEY",
        "--contractCode=YOUR_CONTRACT_CODE",
        "--env=sandbox"
      ]
    }
  }
}
```

Open the Copilot Chat panel, switch to **Agent mode**, and the Monnify tools will be available. Commit `.vscode/mcp.json` to share the setup with your team (credentials should come from environment variables — see [using environment variables](#using-environment-variables)).

---

### Windsurf

Add to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "monnify": {
      "command": "npx",
      "args": [
        "-y",
        "@monnify/mcp-server",
        "--apiKey=YOUR_API_KEY",
        "--secretKey=YOUR_SECRET_KEY",
        "--contractCode=YOUR_CONTRACT_CODE",
        "--env=sandbox"
      ]
    }
  }
}
```

---

### Zed

Add to `~/.config/zed/settings.json` under `"context_servers"`:

```json
{
  "context_servers": {
    "monnify": {
      "command": {
        "path": "npx",
        "args": [
          "-y",
          "@monnify/mcp-server",
          "--apiKey=YOUR_API_KEY",
          "--secretKey=YOUR_SECRET_KEY",
          "--contractCode=YOUR_CONTRACT_CODE",
          "--env=sandbox"
        ]
      }
    }
  }
}
```

---

### Continue.dev (VS Code / JetBrains)

Add to `~/.continue/config.json` under `"mcpServers"`:

```json
{
  "mcpServers": [
    {
      "name": "monnify",
      "command": "npx",
      "args": [
        "-y",
        "@monnify/mcp-server",
        "--apiKey=YOUR_API_KEY",
        "--secretKey=YOUR_SECRET_KEY",
        "--contractCode=YOUR_CONTRACT_CODE",
        "--env=sandbox"
      ]
    }
  ]
}
```

---

## Using environment variables

Avoid hardcoding credentials in config files by passing them via environment variables instead:

```json
{
  "mcpServers": {
    "monnify": {
      "command": "npx",
      "args": ["-y", "@monnify/mcp-server"],
      "env": {
        "MONNIFY_API_KEY": "YOUR_API_KEY",
        "MONNIFY_SECRET_KEY": "YOUR_SECRET_KEY",
        "MONNIFY_CONTRACT_CODE": "YOUR_CONTRACT_CODE",
        "MONNIFY_ENV": "sandbox"
      }
    }
  }
}
```

All CLI flags have an equivalent environment variable:

| CLI flag          | Environment variable        |
|-------------------|-----------------------------|
| `--apiKey`        | `MONNIFY_API_KEY`           |
| `--secretKey`     | `MONNIFY_SECRET_KEY`        |
| `--contractCode`  | `MONNIFY_CONTRACT_CODE`     |
| `--env`           | `MONNIFY_ENV`               |
| `--transport`     | `MONNIFY_TRANSPORT`         |
| `--port`          | `MONNIFY_PORT`              |
| `--tools`         | `MONNIFY_TOOLS`             |
| `--format`        | `MONNIFY_RESPONSE_FORMAT`   |

---

## Smart response formatting

The server automatically detects which client is connecting and adapts its responses:

| Client | Response format |
|--------|----------------|
| Claude Desktop, Claude Code CLI | Conversational Markdown with status icons, Naira formatting, and human-readable dates |
| Cursor, VS Code Copilot, Windsurf, Zed, Continue.dev | Clean JSON — machine-readable and easy to pipe into other tools |
| ChatGPT, Gemini | Conversational Markdown |

**Override the format** with the `--format` flag if the auto-detection doesn't match your workflow:

```bash
# Force JSON for all clients (e.g. a custom integration)
npx -y @monnify/mcp-server --apiKey=... --format=json

# Force Markdown for all clients
npx -y @monnify/mcp-server --apiKey=... --format=markdown
```

**What conversational responses look like:**

```
✅ Payment Initiated

Amount:      ₦15,000.00
Reference:   PAY-20240601-007
Customer:    John Doe (john@example.com)
Checkout:    https://checkout.monnify.com/pay/abc123
Expires:     1 Jul 2024, 11:59 PM WAT
```

**What JSON responses look like (for engineering tools):**

```json
{
  "paymentReference": "PAY-20240601-007",
  "totalPayable": 15000,
  "checkoutUrl": "https://checkout.monnify.com/pay/abc123",
  "paymentStatus": "PENDING"
}
```

---

## All options

| Flag             | Default   | Description                                         |
|------------------|-----------|-----------------------------------------------------|
| `--apiKey`       | —         | Your Monnify API key (required)                     |
| `--secretKey`    | —         | Your Monnify secret key (required)                  |
| `--contractCode` | —         | Your Monnify contract code (required)               |
| `--env`          | `sandbox` | `sandbox` or `production`                           |
| `--transport`    | `stdio`   | `stdio` (local clients) or `http` (team deployments)|
| `--port`         | `3000`    | Port to listen on when using `--transport=http`     |
| `--tools`        | all       | Comma-separated list of tool categories (see below) |
| `--format`       | `auto`    | `auto`, `markdown`, or `json`                       |
| `--httpToken`    | —         | Bearer token to authenticate HTTP `/mcp` requests   |

---

## Available tools (25)

### Collections (15)

| Tool | What it does |
|------|--------------|
| `monnify_initiate_payment` | Creates a payment and returns a checkout URL |
| `monnify_reserve_account` | Reserves a virtual bank account for a customer |
| `monnify_get_reserved_account` | Fetches details and status of a reserved account |
| `monnify_get_reserved_account_transactions` | Lists transactions received on a reserved account |
| `monnify_deallocate_reserved_account` | Permanently removes a reserved account |
| `monnify_get_transaction_status` | Checks the status of a transaction by reference |
| `monnify_get_transaction_details` | Fetches full details of a transaction |
| `monnify_get_all_transactions` | Lists transactions with filters and pagination |
| `monnify_create_invoice` | Creates a payment invoice with an expiry date |
| `monnify_process_refund` | Issues a full or partial refund |
| `monnify_pay_with_bank_transfer` | Starts a pay-by-bank-transfer flow |
| `monnify_charge_card` | Charges a card with PAN and CVV |
| `monnify_charge_card_token` | Charges a previously saved card token |
| `monnify_authorise_card_otp` | Submits OTP to complete a card charge |
| `monnify_authorise_card_3ds` | Completes 3DS verification for a card charge |

### Direct Debit (5)

| Tool | What it does |
|------|--------------|
| `monnify_create_mandate` | Creates a direct debit mandate |
| `monnify_get_mandate_status` | Checks if a mandate is active and ready to debit |
| `monnify_debit_mandate` | Debits an active mandate |
| `monnify_get_mandate_debit_status` | Checks the status of a debit attempt |
| `monnify_cancel_mandate` | Cancels a mandate permanently |

### Verification (4)

| Tool | What it does |
|------|--------------|
| `monnify_verify_bank_account` | Verifies an account number and returns the account name |
| `monnify_verify_bvn` | Matches a BVN against name, date of birth, and phone number |
| `monnify_verify_bvn_info` | Checks whether all submitted BVN details match holistically |
| `monnify_verify_nin` | Verifies a NIN and returns the associated record |

### Utilities (1)

| Tool | What it does |
|------|--------------|
| `monnify_get_supported_banks` | Lists all supported banks and their codes |

---

## Limiting tool access

Scope the server to only the tools your use case needs. This reduces the surface area exposed to the AI client and keeps the tool list focused.

```bash
# Verification and utilities only (e.g. a KYC onboarding agent)
npx -y @monnify/mcp-server --apiKey=... --secretKey=... --contractCode=... --tools=verification,utilities

# Collections only (e.g. a payment support agent)
npx -y @monnify/mcp-server --apiKey=... --secretKey=... --contractCode=... --tools=collections

# Collections + verification (e.g. a full checkout agent)
npx -y @monnify/mcp-server --apiKey=... --secretKey=... --contractCode=... --tools=collections,verification
```

Available categories: `collections`, `directDebit`, `verification`, `utilities`

---

## Running as an HTTP server (team deployments)

Deploy a single shared instance and connect multiple clients to it — useful for team environments, CI pipelines, or production AI integrations.

**Step 1 — Generate a bearer token:**

```bash
openssl rand -hex 32
# e.g. a3f8c2d1e4b5a6...
```

**Step 2 — Start the server:**

```bash
npx -y @monnify/mcp-server \
  --apiKey=YOUR_API_KEY \
  --secretKey=YOUR_SECRET_KEY \
  --contractCode=YOUR_CONTRACT_CODE \
  --env=production \
  --transport=http \
  --port=3000 \
  --httpToken=YOUR_GENERATED_TOKEN
```

The server will reject any `/mcp` request that does not carry `Authorization: Bearer YOUR_GENERATED_TOKEN`. If you start without `--httpToken`, it starts unauthenticated and logs a warning — acceptable for local development, not for any internet-facing deployment.

**Step 3 — Connect your AI client:**

```bash
# Claude Code
claude mcp add monnify --transport http http://localhost:3000/mcp
```

For clients that accept a custom header, set `Authorization: Bearer YOUR_GENERATED_TOKEN` alongside the endpoint URL.

**Step 4 — Put HTTPS in front of it.** Terminate TLS at a reverse proxy (nginx, Caddy, Cloudflare Tunnel) before exposing the server outside your local network. Never send credentials over plain HTTP.

Health check (no auth required): `GET /health`

---

## Testing locally without deploying

Run the server directly from source against the sandbox environment:

```bash
git clone https://github.com/monnify/monnify-mcp-server
cd monnify-mcp-server
npm install
npm run build

node build/cli.js \
  --apiKey=YOUR_API_KEY \
  --secretKey=YOUR_SECRET_KEY \
  --contractCode=YOUR_CONTRACT_CODE \
  --env=sandbox
```

Or use the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) to explore tools interactively:

```bash
npx @modelcontextprotocol/inspector \
  node $(pwd)/build/cli.js \
  --apiKey=YOUR_API_KEY \
  --secretKey=YOUR_SECRET_KEY \
  --contractCode=YOUR_CONTRACT_CODE \
  --env=sandbox
```

Open `http://localhost:5173` in your browser to browse and invoke tools.

---

## Security

- Credentials are passed as CLI args or environment variables and never stored
- All API responses are filtered through a whitelist — internal Monnify fields are stripped before returning data to the AI client
- Destructive tools (deallocate, cancel mandate) are clearly labelled in their descriptions so the AI client warns before executing them
- Scope tool access with `--tools` to only expose what a given agent needs

---

## License

MIT — built by the [Monnify](https://monnify.com) team.
