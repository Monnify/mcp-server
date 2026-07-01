# Security Policy

## Reporting a vulnerability

If you discover a security vulnerability in this project, please **do not open a public GitHub issue**.

Email the Monnify team at **security@monnify.com** with:
- A description of the vulnerability
- Steps to reproduce it
- The potential impact
- Any suggested fix (optional)

We will acknowledge your report within 48 hours and aim to release a fix within 14 days for critical issues.

---

## Deployment security

### Credentials

- Never commit `.env` to version control. The `.gitignore` excludes it by default.
- Use environment variables or a secrets manager (AWS Secrets Manager, GCP Secret Manager, HashiCorp Vault) in production.
- Rotate your Monnify API keys immediately if you suspect they have been exposed.
- Sandbox keys (`MK_TEST_...`) and production keys must never be mixed — the server validates this at startup and will exit if they conflict.

### stdio transport (default)

This is the transport used by Claude Desktop, Claude Code, Cursor, VS Code Copilot, Windsurf, Zed, and most local AI clients. The server process is spawned by the AI client and communicates over stdin/stdout. No network port is opened. This mode is inherently scoped to the local machine and requires no additional authentication.

### HTTP transport (`--transport=http`)

HTTP mode opens a network port and should only be used for team deployments in controlled environments.

**Before exposing the HTTP server beyond localhost:**

1. **Set a bearer token.** Generate a strong random token and pass it at startup:
   ```bash
   # Generate a token
   openssl rand -hex 32

   # Pass it to the server
   npx -y @monnify/mcp-server \
     --apiKey=... --secretKey=... --contractCode=... \
     --transport=http \
     --httpToken=YOUR_TOKEN
   ```
   Clients must send `Authorization: Bearer YOUR_TOKEN` with every request. The server logs a warning at startup if no token is configured.

2. **Use HTTPS.** Terminate TLS at a reverse proxy (nginx, Caddy, Cloudflare Tunnel) and point it at `http://localhost:PORT`. Never expose HTTP directly to the public internet.

3. **Restrict network access.** Bind behind a firewall or VPN rather than exposing to `0.0.0.0` publicly.

4. **Rate limiting is built in.** The server enforces 100 requests per minute per IP. For production deployments under heavy load, add an additional rate-limiting layer at your reverse proxy.

### Tool scoping

Limit the tools available to a given deployment using `--tools`:

```bash
# A KYC agent that can only verify identities — no payment operations
npx -y @monnify/mcp-server --apiKey=... --tools=verification,utilities

# A support agent that can only look up transactions
npx -y @monnify/mcp-server --apiKey=... --tools=collections,utilities
```

This reduces the blast radius if credentials are compromised.

---

## Data handling

- **No persistence.** The server holds credentials and request data only in memory for the duration of a request. Nothing is written to disk.
- **Response sanitisation.** All Monnify API responses are filtered through a whitelist before being returned to the AI client. Internal fields, settlement data, and raw authorization codes are stripped.
- **Logging.** Sensitive fields (`apiKey`, `secretKey`, `bvn`, `accountNumber`, `authorizationCode`, `token`, `password`) are automatically redacted in all log output. Authorization headers are stripped before error logging.
- **Card data.** Card numbers, CVVs, and PINs pass through in-memory only and are never logged or stored.

---

## Supported versions

Security fixes are applied to the latest published version on npm. We do not maintain backported patches for older versions.
