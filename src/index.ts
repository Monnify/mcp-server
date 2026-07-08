import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type CallToolResult,
} from "@modelcontextprotocol/sdk/types.js";
import { validateEnv, env } from "./config/env.js";
import { getAllToolDefinitions, dispatchTool } from "./tools/registry.js";
import {
  assertEnvironmentConsistency,
  isOperationAllowed,
} from "./security/guards.js";
import { logger } from "./utils/logger.js";
import { MonnifyApiError, ValidationError } from "./utils/errors.js";
import { errorResult } from "./types/mcp.js";
import { setClientName, setFormatOverride } from "./utils/clientContext.js";

validateEnv();
assertEnvironmentConsistency(env());

const formatEnv = env().MONNIFY_RESPONSE_FORMAT;
if (formatEnv !== "auto") {
  setFormatOverride(formatEnv as "markdown" | "json");
}

if (isOperationAllowed("utilities", env())) {
  await import("./tools/utilities/getSupportedBanks.js");
}
if (isOperationAllowed("verification", env())) {
  await import("./tools/verification/verifyBankAccount.js");
  await import("./tools/verification/verifyBvn.js");
await import("./tools/verification/verifyBvnInfo.js");
  await import("./tools/verification/verifyNin.js");
}
if (isOperationAllowed("collections", env())) {
  await import("./tools/collections/initiatePayment.js");
  await import("./tools/collections/reserveAccount.js");
  await import("./tools/collections/getReservedAccount.js");
  await import("./tools/collections/getReservedAccountTransactions.js");
  await import("./tools/collections/deallocateReservedAccount.js");
  await import("./tools/collections/getTransactionStatus.js");
  await import("./tools/collections/getTransactionDetails.js");
  await import("./tools/collections/getAllTransactions.js");
  await import("./tools/collections/createInvoice.js");
  await import("./tools/collections/processRefund.js");
  await import("./tools/collections/payWithBankTransfer.js");
  await import("./tools/collections/chargeCard.js");
  await import("./tools/collections/chargeCardToken.js");
  await import("./tools/collections/authoriseCardOtp.js");
  await import("./tools/collections/authoriseCard3ds.js");
}
if (isOperationAllowed("directDebit", env())) {
  await import("./tools/directDebit/createMandate.js");
  await import("./tools/directDebit/getMandateStatus.js");
  await import("./tools/directDebit/debitMandate.js");
  await import("./tools/directDebit/getMandateDebitStatus.js");
  await import("./tools/directDebit/cancelMandate.js");
}
if (isOperationAllowed("subAccounts", env())) {
  await import("./tools/subAccounts/createSubAccounts.js");
  await import("./tools/subAccounts/getSubAccounts.js");
  await import("./tools/subAccounts/updateSubAccount.js");
  await import("./tools/subAccounts/deleteSubAccount.js");
}

export const server = new Server(
  { name: "monnify-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.oninitialized = () => {
  const clientName = server.getClientVersion()?.name;
  setClientName(clientName);
  logger.info("MCP client connected", { client: clientName ?? "unknown" });
};

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: getAllToolDefinitions(),
}));

server.setRequestHandler(CallToolRequestSchema, async (request): Promise<CallToolResult> => {
  const { name, arguments: args } = request.params;
  try {
    const result = await dispatchTool(name, args ?? {});
    return { content: result.content, isError: result.isError } as CallToolResult;
  } catch (error) {
    if (error instanceof MonnifyApiError) {
      return { content: [error.toMcpContent()], isError: true } as CallToolResult;
    }
    if (error instanceof ValidationError) {
      return { content: [error.toMcpContent()], isError: true } as CallToolResult;
    }
    logger.error("Unhandled tool error", { tool: name, error });
    return errorResult(`Internal error in "${name}". Check server logs.`) as unknown as CallToolResult;
  }
});

const transport = env().TRANSPORT;
if (transport === "http") {
  const { startHttpTransport } = await import("./transport/http.js");
  await startHttpTransport(server);
} else {
  const { startStdioTransport } = await import("./transport/stdio.js");
  await startStdioTransport(server);
}
