import { z } from "zod";
import { VerifyBvnBodySchema } from "../compat.js";

export const VerifyBankAccountInputSchema = z.object({
  accountNumber: z
    .string()
    .length(10)
    .describe("10-digit NUBAN bank account number to verify."),
  bankCode: z
    .string()
    .length(3)
    .describe(
      "3-digit bank code. Call monnify_get_supported_banks to get the list of valid codes."
    ),
});

export const VerifyBvnInputSchema = VerifyBvnBodySchema.extend({
  bvn: z
    .string()
    .length(11)
    .describe("11-digit Bank Verification Number (BVN) to verify."),
  name: z
    .string()
    .min(1)
    .describe(
      "Full name to match against BVN records (e.g. 'John Doe'). Must be in the format 'FirstName LastName'."
    ),
  dateOfBirth: z
    .string()
    .describe(
      "Date of birth to match in DD-MM-YYYY format (e.g. '15-03-1990')."
    ),
  mobileNo: z
    .string()
    .describe(
      "Mobile number to match against BVN records in international format (e.g. '2348012345678')."
    ),
});

export const VerifyBvnInfoInputSchema = z.object({
  bvn: z
    .string()
    .length(11)
    .describe("11-digit Bank Verification Number (BVN) to verify."),
  name: z
    .string()
    .min(1)
    .describe(
      "Full name as registered with the BVN record (e.g. 'John Doe')."
    ),
  dateOfBirth: z
    .string()
    .describe(
      "Date of birth in DD-Mon-YYYY format (e.g. '01-Jan-1990')."
    ),
  mobileNo: z
    .string()
    .describe(
      "Mobile number registered with the BVN (e.g. '08012345678' or international format '2348012345678')."
    ),
});

export const VerifyNinInputSchema = z.object({
  nin: z
    .string()
    .length(11)
    .describe("11-digit National Identification Number (NIN) to verify."),
});
