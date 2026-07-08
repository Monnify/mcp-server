import { z } from "zod";
import {
  CreateSubAccountBodySchema,
  UpdateSubAccountBodySchema,
} from "../compat.js";

const SubAccountItemSchema = CreateSubAccountBodySchema.extend({
  currencyCode: z
    .enum(["NGN"])
    .default("NGN")
    .describe("Settlement currency — currently only NGN is supported."),
  accountNumber: z
    .string()
    .length(10)
    .describe(
      "10-digit NUBAN account number that should receive the split."
    ),
  bankCode: z
    .string()
    .length(3)
    .describe(
      "3-digit bank code where accountNumber is domiciled. Call monnify_get_supported_banks to look this up."
    ),
  email: z
    .string()
    .email()
    .describe("Email address tied to this sub-account — receives settlement notifications."),
  defaultSplitPercentage: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "Default percentage (0-100) of each transaction routed to this sub-account when no per-transaction split is specified."
    ),
});

export const CreateSubAccountsInputSchema = z.object({
  subAccounts: z
    .array(SubAccountItemSchema)
    .min(1)
    .describe("One or more sub-accounts to create in a single call."),
});

export const GetSubAccountsInputSchema = z.object({});

export const UpdateSubAccountInputSchema = UpdateSubAccountBodySchema.extend({
  subAccountCode: z
    .string()
    .min(1)
    .describe(
      "The sub-account code to update — returned as subAccountCode from monnify_create_sub_accounts or monnify_get_sub_accounts."
    ),
  currencyCode: z
    .enum(["NGN"])
    .default("NGN")
    .describe("Settlement currency — currently only NGN is supported."),
  accountNumber: z
    .string()
    .length(10)
    .describe("10-digit NUBAN account number that should receive the split."),
  bankCode: z
    .string()
    .length(3)
    .describe(
      "3-digit bank code where accountNumber is domiciled. Call monnify_get_supported_banks to look this up."
    ),
  email: z
    .string()
    .email()
    .describe("Email address tied to this sub-account."),
  defaultSplitPercentage: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "Default percentage (0-100) of each transaction routed to this sub-account when no per-transaction split is specified."
    ),
});

export const DeleteSubAccountInputSchema = z.object({
  subAccountCode: z
    .string()
    .min(1)
    .describe("The sub-account code to permanently delete."),
});
