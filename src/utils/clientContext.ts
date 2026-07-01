// Tracks which MCP client connected and derives the preferred response format.
// Set once during server initialization via setClientName(); read everywhere else.

type ResponseFormat = "markdown" | "json";

let _clientName: string | undefined;
let _formatOverride: ResponseFormat | undefined;

// Claude-based clients that prefer conversational Markdown responses
const MARKDOWN_CLIENTS = ["claude", "anthropic"];

export function setClientName(name: string | undefined): void {
  _clientName = name?.toLowerCase();
}

export function setFormatOverride(format: ResponseFormat | undefined): void {
  _formatOverride = format;
}

export function getClientName(): string | undefined {
  return _clientName;
}

export function getResponseFormat(): ResponseFormat {
  if (_formatOverride) return _formatOverride;
  if (!_clientName) return "markdown"; // default: conversational until we know otherwise
  const isClaudeClient = MARKDOWN_CLIENTS.some(n => _clientName!.includes(n));
  return isClaudeClient ? "markdown" : "json";
}
