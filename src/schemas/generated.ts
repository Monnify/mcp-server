import { z } from "zod";

const AuthResponseSuccess = z
  .object({
    requestSuccessful: z.boolean(),
    responseCode: z.number().int(),
    responseBody: z
      .object({ accessToken: z.string(), expiresIn: z.number().int() })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const AuthResponseError = z
  .object({
    requestSuccessful: z.boolean(),
    responseCode: z.number().int(),
    responseMessage: z.string(),
  })
  .partial()
  .passthrough();
const AuthResponseNoHeaderError = z
  .object({
    requestSuccessful: z.boolean(),
    responseCode: z.number().int(),
    responseMessage: z.string(),
  })
  .partial()
  .passthrough();
const InitializeTransactionRequest = z
  .object({
    amount: z.number(),
    customerName: z.string().optional(),
    customerEmail: z.string(),
    paymentReference: z.string(),
    paymentDescription: z.string().optional(),
    currencyCode: z.string(),
    contractCode: z.string(),
    redirectUrl: z.string().optional(),
    paymentMethods: z
      .array(z.enum(["CARD", "ACCOUNT_TRANSFER", "USSD", "PHONE_NUMBER"]))
      .optional(),
    incomeSplitConfig: z
      .array(
        z
          .object({
            subAccountCode: z.string(),
            feePercentage: z.number(),
            splitAmount: z.number(),
            splitPercentage: z.number(),
            feeBearer: z.boolean(),
          })
          .partial()
          .passthrough()
      )
      .optional(),
    metadata: z
      .object({ name: z.string(), age: z.number().int() })
      .partial()
      .passthrough()
      .optional(),
  })
  .passthrough();
const InitializeTransactionSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z
      .object({
        transactionReference: z.string(),
        paymentReference: z.string(),
        merchantName: z.string(),
        merchantLogoUrl: z.string(),
        apiKey: z.string(),
        enabledPaymentMethod: z.array(z.enum(["ACCOUNT_TRANSFER", "CARD"])),
        checkoutUrl: z.string(),
        incomeSplitConfig: z.array(
          z
            .object({
              subAccountCode: z.string(),
              splitAmount: z.number(),
              feePercentage: z.number(),
              feeBearer: z.boolean(),
              splitPercentage: z.number().int(),
            })
            .partial()
            .passthrough()
        ),
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const ErrorResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseCode: z.number().int(),
    responseMessage: z.string(),
  })
  .partial()
  .passthrough();
const InitBankTransferPaymentRequest = z
  .object({ transactionReference: z.string(), bankCode: z.string().optional() })
  .passthrough();
const InitBankTransferPaymentSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z
      .object({
        accountNumber: z.string(),
        accountName: z.string(),
        bankName: z.string(),
        bankCode: z.string(),
        ussdCode: z.string(),
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const CardInfo = z
  .object({
    number: z.string(),
    expiryMonth: z.string(),
    expiryYear: z.string(),
    pin: z.string(),
    cvv: z.string(),
  })
  .passthrough();
const DeviceInformation = z
  .object({
    httpBrowserLanguage: z.string(),
    httpBrowserJavaEnabled: z.boolean(),
    httpBrowserJavaScriptEnabled: z.boolean(),
    httpBrowserColorDepth: z.number().int(),
    httpBrowserScreenHeight: z.number().int(),
    httpBrowserScreenWidth: z.number().int(),
    httpBrowserTimeDifference: z.string(),
    userAgentBrowserValue: z.string(),
  })
  .passthrough();
const ChargeRequest = z
  .object({
    transactionReference: z.string(),
    collectionChannel: z.string().optional(),
    card: CardInfo,
    deviceInformation: DeviceInformation,
  })
  .passthrough();
const ChargeResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z
      .object({
        status: z.string(),
        message: z.string(),
        transactionReference: z.string(),
        paymentReference: z.string(),
        authorizedAmount: z.number().int(),
        otpData: z
          .object({ id: z.string(), message: z.string(), authData: z.string() })
          .partial()
          .passthrough(),
        secure3dData: z
          .object({ id: z.string(), redirectUrl: z.string() })
          .partial()
          .passthrough(),
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const AuthorizeOTPRequest = z
  .object({
    transactionReference: z.string(),
    collectionChannel: z.string().optional(),
    tokenId: z.string(),
    token: z.string(),
  })
  .passthrough();
const AuthorizeOTPSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z
      .object({
        paymentStatus: z.string(),
        paymentDescription: z.string(),
        transactionReference: z.string(),
        paymentReference: z.string(),
        amountPaid: z.number(),
        currencyPaid: z.string(),
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const Authorize3DSCardRequest = z
  .object({
    transactionReference: z.string(),
    apiKey: z.string(),
    collectionChannel: z.string().optional(),
    card: z
      .object({
        number: z.number().int(),
        expiryMonth: z.number().int(),
        expiryYear: z.number().int(),
        cvv: z.number().int(),
        pin: z.number().int(),
      })
      .partial()
      .passthrough(),
  })
  .passthrough();
const Authorize3DSCardSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z
      .object({
        paymentStatus: z.string(),
        paymentDescription: z.string(),
        transactionReference: z.string(),
        paymentReference: z.string(),
        amountPaid: z.number(),
        currencyPaid: z.string(),
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const TransactionSearchResponse = z
  .object({
    content: z.array(
      z
        .object({
          transactionReference: z.string(),
          paymentReference: z.string(),
          amount: z.number(),
          customerName: z.string(),
          customerEmail: z.string(),
          paymentStatus: z.string(),
          transactionDate: z.string().datetime({ offset: true }),
        })
        .partial()
        .passthrough()
    ),
    pageable: z
      .object({
        sort: z
          .object({
            empty: z.boolean(),
            sorted: z.boolean(),
            unsorted: z.boolean(),
          })
          .partial()
          .passthrough(),
        offset: z.number().int(),
        pageSize: z.number().int(),
        pageNumber: z.number().int(),
        unpaged: z.boolean(),
        paged: z.boolean(),
      })
      .partial()
      .passthrough(),
    last: z.boolean(),
    totalPages: z.number().int(),
    totalElements: z.number().int(),
    size: z.number().int(),
    number: z.number().int(),
    sort: z
      .object({
        empty: z.boolean(),
        sorted: z.boolean(),
        unsorted: z.boolean(),
      })
      .partial()
      .passthrough(),
    first: z.boolean(),
    numberOfElements: z.number().int(),
    empty: z.boolean(),
  })
  .partial()
  .passthrough();
const TransactionStatusResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z
      .object({
        transactionReference: z.string(),
        paymentReference: z.string(),
        amountPaid: z.string(),
        totalPayable: z.string(),
        settlementAmount: z.string(),
        paidOn: z.string(),
        paymentStatus: z.string(),
        paymentDescription: z.string(),
        currency: z.string(),
        paymentMethod: z.string(),
        product: z
          .object({ type: z.string(), reference: z.string() })
          .partial()
          .passthrough(),
        cardDetails: z
          .object({
            cardType: z.string(),
            last4: z.string(),
            expMonth: z.string(),
            expYear: z.string(),
            bin: z.string(),
            bankCode: z.null(),
            bankName: z.null(),
            reusable: z.boolean(),
            countryCode: z.null(),
            cardToken: z.null(),
            supportsTokenization: z.boolean(),
            maskedPan: z.string(),
          })
          .partial()
          .passthrough(),
        accountDetails: z.null(),
        accountPayments: z.array(z.unknown()),
        customer: z
          .object({ email: z.string(), name: z.string() })
          .partial()
          .passthrough(),
        metaData: z.object({}).partial().passthrough(),
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const InitiateTransferRequest = z
  .object({
    amount: z.number(),
    reference: z.string(),
    narration: z.string(),
    destinationBankCode: z.string(),
    destinationAccountNumber: z.string(),
    destinationAccountName: z.string(),
    currency: z.string(),
    sourceAccountNumber: z.string(),
    senderInfo: z
      .object({
        sourceAccountNumber: z.string(),
        sourceAccountName: z.string(),
        sourceAccountBvn: z.string().optional(),
        senderBankCode: z.string(),
      })
      .passthrough()
      .optional(),
    async: z.boolean().optional(),
  })
  .passthrough();
const InitiateTransferOTPResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z
      .object({
        amount: z.number().int(),
        reference: z.string(),
        status: z.string(),
        dateCreated: z.string().datetime({ offset: true }),
        totalFee: z.number().int(),
        destinationAccountName: z.string(),
        destinationBankName: z.string(),
        destinationAccountNumber: z.string(),
        destinationBankCode: z.string(),
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const InitiateTransferSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z
      .object({
        amount: z.number().int(),
        reference: z.string(),
        status: z.string(),
        dateCreated: z.string().datetime({ offset: true }),
        totalFee: z.number().int(),
        destinationAccountName: z.string(),
        destinationBankName: z.string(),
        destinationAccountNumber: z.string(),
        destinationBankCode: z.string(),
        senderInfo: z
          .object({
            sourceAccountNumber: z.string(),
            sourceAccountName: z.string(),
            senderBankCode: z.string(),
          })
          .partial()
          .passthrough(),
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const InitiateBulkTransferRequest = z
  .object({
    title: z.string(),
    batchReference: z.string(),
    narration: z.string(),
    sourceAccountNumber: z.string(),
    onValidationFailure: z.enum(["CONTINUE", "BREAK"]),
    notificationInterval: z.number().int(),
    transactionList: z.array(
      z
        .object({
          amount: z.number().int(),
          reference: z.string(),
          narration: z.string(),
          destinationBankCode: z.string(),
          destinationAccountNumber: z.string(),
          destinationAccountName: z.string(),
          currency: z.string(),
        })
        .passthrough()
    ),
  })
  .passthrough();
const InitiateBulkTransferSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z
      .object({
        totalAmount: z.number().int(),
        totalFee: z.number().int(),
        batchReference: z.string(),
        batchStatus: z.string(),
        totalTransactionsCount: z.number().int(),
        dateCreated: z.string().datetime({ offset: true }),
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const AuthorizeTransferRequest = z
  .object({ reference: z.string(), authorizationCode: z.string() })
  .passthrough();
const ResendOTPRequest = z.object({ reference: z.string() }).passthrough();
const ResendOTPSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z.object({ message: z.string() }).partial().passthrough(),
  })
  .partial()
  .passthrough();
const ResendOTPRequestBulk = z
  .object({ batchReference: z.string() })
  .passthrough();
const ResendOTPSuccessResponseBulk = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z.object({ message: z.string() }).partial().passthrough(),
  })
  .partial()
  .passthrough();
const SingleTransferStatusResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z
      .object({
        amount: z.number().int(),
        reference: z.string(),
        narration: z.string(),
        currency: z.string(),
        fee: z.number().int(),
        twoFaEnabled: z.boolean(),
        status: z.string(),
        transactionDescription: z.string(),
        transactionReference: z.string(),
        createdOn: z.string().datetime({ offset: true }),
        sourceAccountNumber: z.string(),
        destinationAccountNumber: z.string(),
        destinationAccountName: z.string(),
        destinationBankCode: z.string(),
        destinationBankName: z.string(),
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const SingleTransferDetails = z
  .object({
    amount: z.number().int(),
    reference: z.string(),
    narration: z.string(),
    currency: z.string(),
    fee: z.number().int(),
    twoFaEnabled: z.boolean(),
    status: z.string(),
    transactionDescription: z.string(),
    transactionReference: z.string(),
    createdOn: z.string().datetime({ offset: true }),
    sourceAccountNumber: z.string(),
    destinationAccountNumber: z.string(),
    destinationAccountName: z.string(),
    destinationBankCode: z.string(),
    destinationBankName: z.string(),
  })
  .partial()
  .passthrough();
const ListSingleTransfersResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z
      .object({
        content: z.array(SingleTransferDetails),
        pageable: z
          .object({
            sort: z
              .object({
                sorted: z.boolean(),
                unsorted: z.boolean(),
                empty: z.boolean(),
              })
              .partial()
              .passthrough(),
            pageSize: z.number().int(),
            pageNumber: z.number().int(),
            offset: z.number().int(),
            paged: z.boolean(),
            unpaged: z.boolean(),
          })
          .partial()
          .passthrough(),
        last: z.boolean(),
        totalPages: z.number().int(),
        totalElements: z.number().int(),
        sort: z
          .object({
            sorted: z.boolean(),
            unsorted: z.boolean(),
            empty: z.boolean(),
          })
          .partial()
          .passthrough(),
        first: z.boolean(),
        numberOfElements: z.number().int(),
        size: z.number().int(),
        number: z.number().int(),
        empty: z.boolean(),
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const BulkTransferDetails = z
  .object({
    totalAmount: z.number().int(),
    totalFee: z.number().int(),
    batchReference: z.string(),
    batchStatus: z.string(),
    totalTransactionsCount: z.number().int(),
    dateCreated: z.string().datetime({ offset: true }),
  })
  .partial()
  .passthrough();
const ListBulkTransfersResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z
      .object({
        content: z.array(BulkTransferDetails),
        pageable: z
          .object({
            sort: z
              .object({
                sorted: z.boolean(),
                unsorted: z.boolean(),
                empty: z.boolean(),
              })
              .partial()
              .passthrough(),
            pageSize: z.number().int(),
            pageNumber: z.number().int(),
            offset: z.number().int(),
            unpaged: z.boolean(),
            paged: z.boolean(),
          })
          .partial()
          .passthrough(),
        totalPages: z.number().int(),
        last: z.boolean(),
        totalElements: z.number().int(),
        sort: z
          .object({
            sorted: z.boolean(),
            unsorted: z.boolean(),
            empty: z.boolean(),
          })
          .partial()
          .passthrough(),
        first: z.boolean(),
        numberOfElements: z.number().int(),
        size: z.number().int(),
        number: z.number().int(),
        empty: z.boolean(),
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const BulkTransferTransactionsResponse = z.object({}).partial().passthrough();
const BulkBatchSummaryResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z
      .object({
        title: z.string(),
        totalAmount: z.number().int(),
        totalFee: z.number().int(),
        batchReference: z.string(),
        totalTransactionsCount: z.number().int(),
        initiator: z.string(),
        failedCount: z.number().int(),
        successfulCount: z.number().int(),
        pendingCount: z.number().int(),
        pendingAmount: z.number().int(),
        failedAmount: z.number().int(),
        successfulAmount: z.number().int(),
        batchStatus: z.string(),
        dateCreated: z.string().datetime({ offset: true }),
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const DisbursementTransactionDetails = z
  .object({
    amount: z.number().int(),
    reference: z.string(),
    narration: z.string(),
    currency: z.string(),
    fee: z.number().int(),
    twoFaEnabled: z.boolean(),
    status: z.string(),
    transactionDescription: z.string(),
    transactionReference: z.string(),
    createdOn: z.string().datetime({ offset: true }),
    sourceAccountNumber: z.string(),
    destinationAccountNumber: z.string(),
    destinationAccountName: z.string(),
    destinationBankCode: z.string(),
    destinationBankName: z.string(),
  })
  .partial()
  .passthrough();
const SearchDisbursementTransactionsResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z
      .object({
        content: z.array(DisbursementTransactionDetails),
        pageable: z
          .object({
            sort: z
              .object({
                sorted: z.boolean(),
                unsorted: z.boolean(),
                empty: z.boolean(),
              })
              .partial()
              .passthrough(),
            pageSize: z.number().int(),
            pageNumber: z.number().int(),
            offset: z.number().int(),
            paged: z.boolean(),
            unpaged: z.boolean(),
          })
          .partial()
          .passthrough(),
        last: z.boolean(),
        totalPages: z.number().int(),
        totalElements: z.number().int(),
        sort: z
          .object({
            sorted: z.boolean(),
            unsorted: z.boolean(),
            empty: z.boolean(),
          })
          .partial()
          .passthrough(),
        first: z.boolean(),
        numberOfElements: z.number().int(),
        size: z.number().int(),
        number: z.number().int(),
        empty: z.boolean(),
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const GetWalletBalanceResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z
      .object({ availableBalance: z.string(), ledgerBalance: z.string() })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const IncomeSplitConfig = z
  .object({
    subAccountCode: z.string(),
    feePercentage: z.number(),
    splitPercentage: z.number(),
    feeBearer: z.boolean(),
    splitAmount: z.number(),
  })
  .partial()
  .passthrough();
const BankAccount = z
  .object({ accountNumber: z.string(), bankCode: z.string() })
  .partial()
  .passthrough();
const AllowedPaymentSources = z
  .object({
    bvns: z.array(z.string()),
    bankAccounts: z.array(BankAccount),
    accountNames: z.array(z.string()),
  })
  .partial()
  .passthrough();
const CreateReservedAccountRequest = z
  .object({
    accountReference: z.string(),
    accountName: z.string(),
    currencyCode: z.string(),
    contractCode: z.string(),
    customerEmail: z.string(),
    customerName: z.string(),
    bvn: z.string(),
    getAllAvailableBanks: z.boolean(),
    preferredBanks: z.array(z.string()),
    incomeSplitConfig: z.array(IncomeSplitConfig).optional(),
    restrictPaymentSource: z.boolean().optional().default(true),
    allowedPaymentSources: AllowedPaymentSources.optional(),
    nin: z.string().optional(),
  })
  .passthrough();
const Account = z
  .object({
    bankCode: z.string(),
    bankName: z.string(),
    accountNumber: z.string(),
    accountName: z.string(),
  })
  .partial()
  .passthrough();
const IncomeSplitConfigResponse = z
  .object({
    subAccountCode: z.string(),
    feePercentage: z.number(),
    feeBearer: z.boolean(),
    splitPercentage: z.number(),
    reservedAccountConfigCode: z.string(),
  })
  .partial()
  .passthrough();
const ReservedAccountDetails = z
  .object({
    contractCode: z.string(),
    accountReference: z.string(),
    accountName: z.string(),
    currencyCode: z.string(),
    customerEmail: z.string(),
    customerName: z.string(),
    accounts: z.array(Account),
    collectionChannel: z.string(),
    reservationReference: z.string(),
    reservedAccountType: z.string(),
    status: z.string(),
    createdOn: z.string().datetime({ offset: true }),
    incomeSplitConfig: z.array(IncomeSplitConfigResponse),
    bvn: z.string(),
    restrictPaymentSource: z.boolean(),
    allowedPaymentSources: AllowedPaymentSources,
  })
  .partial()
  .passthrough();
const CreateReservedAccountResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: ReservedAccountDetails,
  })
  .partial()
  .passthrough();
const CreateInvoiceReservedAccountRequest = z
  .object({
    contractCode: z.string(),
    accountName: z.string(),
    currencyCode: z.string(),
    accountReference: z.string(),
    customerEmail: z.string(),
    customerName: z.string(),
    bvn: z.string(),
    nin: z.string().optional(),
    reservedAccountType: z.string(),
  })
  .passthrough();
const InvoiceReservedAccountDetails = z
  .object({
    contractCode: z.string(),
    accountReference: z.string(),
    accountName: z.string(),
    currencyCode: z.string(),
    customerEmail: z.string(),
    customerName: z.string(),
    accountNumber: z.string(),
    bankName: z.string(),
    bankCode: z.string(),
    collectionChannel: z.string(),
    reservationReference: z.string(),
    reservedAccountType: z.string(),
    status: z.string(),
    createdOn: z.string().datetime({ offset: true }),
    incomeSplitConfig: z.array(z.unknown()),
    bvn: z.string(),
    restrictPaymentSource: z.boolean(),
  })
  .partial()
  .passthrough();
const CreateInvoiceReservedAccountSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: InvoiceReservedAccountDetails,
  })
  .partial()
  .passthrough();
const GetReservedAccountDetailsSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: ReservedAccountDetails,
  })
  .partial()
  .passthrough();
const AddLinkedAccountsRequest = z
  .object({
    getAllAvailableBanks: z.boolean(),
    preferredBanks: z.array(z.string()).optional(),
  })
  .passthrough();
const LinkedAccountDetails = z
  .object({
    contractCode: z.string(),
    accountReference: z.string(),
    accountName: z.string(),
    currencyCode: z.string(),
    customerEmail: z.string(),
    customerName: z.string(),
    accounts: z.array(Account),
    collectionChannel: z.string(),
    reservationReference: z.string(),
    reservedAccountType: z.string(),
    status: z.string(),
    createdOn: z.string().datetime({ offset: true }),
    bvn: z.string(),
    restrictPaymentSource: z.boolean(),
  })
  .partial()
  .passthrough();
const AddLinkedAccountsSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: LinkedAccountDetails,
  })
  .partial()
  .passthrough();
const UpdateBvnRequest = z.object({ bvn: z.string() }).passthrough();
const UpdatedBvnAccountDetails = z
  .object({
    contractCode: z.string(),
    accountReference: z.string(),
    currencyCode: z.string(),
    customerEmail: z.string(),
    customerName: z.string(),
    accountNumber: z.string(),
    bankName: z.string(),
    bankCode: z.string(),
    collectionChannel: z.string(),
    reservationReference: z.string(),
    reservedAccountType: z.string(),
    status: z.string(),
    createdOn: z.string().datetime({ offset: true }),
    incomeSplitConfig: z.array(IncomeSplitConfig),
    bvn: z.string(),
    restrictPaymentSource: z.boolean(),
  })
  .partial()
  .passthrough();
const UpdateBvnSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: UpdatedBvnAccountDetails,
  })
  .partial()
  .passthrough();
const AllowedPaymentSourcesRequest = z
  .object({
    restrictPaymentSource: z.boolean(),
    allowedPaymentSources: z
      .object({
        bvns: z.array(z.string()),
        bankAccounts: z.array(BankAccount),
        accountNames: z.array(z.string()),
      })
      .partial()
      .passthrough(),
  })
  .passthrough();
const AllowedPaymentSourcesDetails = z
  .object({
    restrictPaymentSource: z.boolean(),
    allowedPaymentSources: z
      .object({
        bvns: z.array(z.string()),
        bankAccounts: z.array(BankAccount),
        accountNames: z.array(z.string()),
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const AllowedPaymentSourcesSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: AllowedPaymentSourcesDetails,
  })
  .partial()
  .passthrough();
const UpdateSplitConfigRequestItem = z
  .object({
    subAccountCode: z.string(),
    feeBearer: z.boolean().optional().default(false),
    feePercentage: z.number().optional().default(0),
    splitPercentage: z.number().optional().default(0),
  })
  .passthrough();
const SplitConfigDetail = z
  .object({
    subAccountCode: z.string(),
    feePercentage: z.number(),
    feeBearer: z.boolean(),
    splitPercentage: z.number(),
    reservedAccountConfigCode: z.string(),
  })
  .partial()
  .passthrough();
const UpdatedSplitConfigDetails = z
  .object({
    code: z.string(),
    reservedAccountCode: z.string(),
    feeBearer: z.string(),
    configDetails: z.array(SplitConfigDetail),
  })
  .partial()
  .passthrough();
const UpdateSplitConfigSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: UpdatedSplitConfigDetails,
  })
  .partial()
  .passthrough();
const DeallocatedAccountDetails = z
  .object({
    contractCode: z.string(),
    accountReference: z.string(),
    accountName: z.string(),
    currencyCode: z.string(),
    customerEmail: z.string(),
    customerName: z.string(),
    accountNumber: z.string(),
    bankName: z.string(),
    bankCode: z.string(),
    collectionChannel: z.string(),
    reservationReference: z.string(),
    reservedAccountType: z.string(),
    status: z.string(),
    createdOn: z.string().datetime({ offset: true }),
    bvn: z.string(),
    restrictPaymentSource: z.boolean(),
  })
  .partial()
  .passthrough();
const DeallocateAccountSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: DeallocatedAccountDetails,
  })
  .partial()
  .passthrough();
const CustomerDTO = z
  .object({ email: z.string(), name: z.string(), merchantCode: z.string() })
  .partial()
  .passthrough();
const Transaction = z
  .object({
    customerDTO: CustomerDTO,
    providerAmount: z.number(),
    paymentMethod: z.string(),
    createdOn: z.string().datetime({ offset: true }),
    amount: z.number(),
    flagged: z.boolean(),
    providerCode: z.string(),
    fee: z.number(),
    currencyCode: z.string(),
    completedOn: z.string().datetime({ offset: true }),
    paymentDescription: z.string(),
    paymentStatus: z.string(),
    transactionReference: z.string(),
    paymentReference: z.string(),
    merchantCode: z.string(),
    merchantName: z.string(),
    payableAmount: z.number(),
    amountPaid: z.number(),
    completed: z.boolean(),
    settleInstantly: z.boolean(),
  })
  .partial()
  .passthrough();
const Sort = z
  .object({ sorted: z.boolean(), unsorted: z.boolean(), empty: z.boolean() })
  .partial()
  .passthrough();
const Pageable = z
  .object({
    sort: Sort,
    pageSize: z.number().int(),
    pageNumber: z.number().int(),
    offset: z.number().int(),
    unpaged: z.boolean(),
    paged: z.boolean(),
  })
  .partial()
  .passthrough();
const TransactionsResponseBody = z
  .object({
    content: z.array(Transaction),
    pageable: Pageable,
    totalElements: z.number().int(),
    totalPages: z.number().int(),
    last: z.boolean(),
    sort: Sort,
    first: z.boolean(),
    numberOfElements: z.number().int(),
    size: z.number().int(),
    number: z.number().int(),
    empty: z.boolean(),
  })
  .partial()
  .passthrough();
const GetTransactionsSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: TransactionsResponseBody,
  })
  .partial()
  .passthrough();
const UpdateKycInfoRequest = z
  .object({ bvn: z.string(), nin: z.string() })
  .passthrough();
const UpdatedKycInfoDetails = z
  .object({
    accountReference: z.string(),
    accountName: z.string(),
    customerEmail: z.string(),
    customerName: z.string(),
    bvn: z.string(),
  })
  .partial()
  .passthrough();
const UpdateKycInfoSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: UpdatedKycInfoDetails,
  })
  .partial()
  .passthrough();
const CreateInvoiceRequest = z
  .object({
    amount: z.number(),
    currencyCode: z.string(),
    invoiceReference: z.string(),
    customerName: z.string(),
    customerEmail: z.string(),
    contractCode: z.string(),
    description: z.string(),
    expiryDate: z.string().datetime({ offset: true }),
    paymentMethods: z.array(z.string()).optional(),
    incomeSplitConfig: z.array(IncomeSplitConfig).optional(),
    redirectUrl: z.string().optional(),
    accountReference: z.string().optional(),
  })
  .passthrough();
const InvoiceSplitConfig = z
  .object({
    subAccountCode: z.string(),
    splitAmount: z.number(),
    feePercentage: z.number(),
    feeBearer: z.boolean(),
    splitPercentage: z.number().nullable(),
  })
  .partial()
  .passthrough();
const InvoiceDetails = z
  .object({
    amount: z.number(),
    invoiceReference: z.string(),
    invoiceStatus: z.string(),
    description: z.string(),
    contractCode: z.string(),
    customerEmail: z.string(),
    customerName: z.string(),
    expiryDate: z.string().datetime({ offset: true }),
    createdBy: z.string(),
    createdOn: z.string().datetime({ offset: true }),
    checkoutUrl: z.string(),
    accountNumber: z.string(),
    accountName: z.string(),
    bankName: z.string(),
    bankCode: z.string(),
    redirectUrl: z.string(),
    transactionReference: z.string(),
    incomeSplitConfig: z.array(InvoiceSplitConfig),
  })
  .partial()
  .passthrough();
const CreateInvoiceSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: InvoiceDetails,
  })
  .partial()
  .passthrough();
const ViewInvoiceDetailsSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: InvoiceDetails,
  })
  .partial()
  .passthrough();
const InvoiceListItem = z
  .object({
    amount: z.number(),
    invoiceReference: z.string(),
    invoiceStatus: z.string(),
    description: z.string(),
    contractCode: z.string(),
    customerEmail: z.string(),
    customerName: z.string(),
    expiryDate: z.string().datetime({ offset: true }),
    createdBy: z.string(),
    createdOn: z.string().datetime({ offset: true }),
    accountNumber: z.string(),
    bankName: z.string(),
    bankCode: z.string(),
  })
  .partial()
  .passthrough();
const InvoiceList = z
  .object({
    content: z.array(InvoiceListItem),
    pageable: Pageable,
    last: z.boolean(),
    totalElements: z.number().int(),
    totalPages: z.number().int(),
    sort: Sort,
    first: z.boolean(),
    numberOfElements: z.number().int(),
    size: z.number().int(),
    number: z.number().int(),
    empty: z.boolean(),
  })
  .partial()
  .passthrough();
const GetAllInvoicesSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: InvoiceList,
  })
  .partial()
  .passthrough();
const CancelledInvoiceDetails = z
  .object({
    amount: z.number(),
    invoiceReference: z.string(),
    invoiceStatus: z.string(),
    description: z.string(),
    contractCode: z.string(),
    customerEmail: z.string(),
    customerName: z.string(),
    expiryDate: z.string().datetime({ offset: true }),
    createdBy: z.string(),
    createdOn: z.string().datetime({ offset: true }),
    accountNumber: z.string(),
    bankName: z.string(),
    bankCode: z.string(),
  })
  .partial()
  .passthrough();
const CancelInvoiceSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: CancelledInvoiceDetails,
  })
  .partial()
  .passthrough();
const MetaData = z
  .object({ ipAddress: z.string(), deviceType: z.string() })
  .partial()
  .passthrough();
const ChargeCardTokenRequest = z
  .object({
    cardToken: z.string(),
    amount: z.number(),
    customerName: z.string().optional(),
    customerEmail: z.string().email(),
    paymentReference: z.string(),
    paymentDescription: z.string().optional(),
    currencyCode: z.string().optional().default("NGN"),
    contractCode: z.string(),
    apiKey: z.string(),
    metaData: MetaData.optional(),
    incomeSplitConfig: z.array(IncomeSplitConfig).optional(),
  })
  .passthrough();
const Product = z
  .object({ type: z.string(), reference: z.string() })
  .partial()
  .passthrough();
const CardDetails = z
  .object({
    cardType: z.string(),
    last4: z.string(),
    expMonth: z.string(),
    expYear: z.string(),
    bin: z.string(),
    bankCode: z.string(),
    bankName: z.string(),
    reusable: z.boolean(),
    countryCode: z.string().nullable(),
    cardToken: z.string(),
    supportsTokenization: z.boolean(),
    maskedPan: z.string(),
  })
  .partial()
  .passthrough();
const CustomerDetails = z
  .object({ email: z.string().email(), name: z.string() })
  .partial()
  .passthrough();
const ChargeCardTokenResponseBody = z
  .object({
    transactionReference: z.string(),
    paymentReference: z.string(),
    amountPaid: z.string(),
    totalPayable: z.string(),
    settlementAmount: z.string(),
    paidOn: z.string(),
    paymentStatus: z.string(),
    paymentDescription: z.string(),
    currency: z.string(),
    paymentMethod: z.string(),
    product: Product,
    cardDetails: CardDetails,
    accountDetails: z.object({}).partial().passthrough().nullable(),
    accountPayments: z.array(z.object({}).partial().passthrough()),
    customer: CustomerDetails,
    metaData: MetaData,
  })
  .partial()
  .passthrough();
const ChargeCardTokenSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: ChargeCardTokenResponseBody,
  })
  .partial()
  .passthrough();
const CreateMandateRequest = z
  .object({
    contractCode: z.string(),
    mandateReference: z.string(),
    mandateAmount: z.number().optional(),
    autoRenew: z.boolean().optional(),
    customerCancellation: z.boolean().optional(),
    customerName: z.string(),
    customerPhoneNumber: z.string(),
    customerEmailAddress: z.string().email(),
    customerAddress: z.string(),
    customerAccountNumber: z.string(),
    customerAccountBankCode: z.string(),
    mandateDescription: z.string(),
    mandateStartDate: z.string().datetime({ offset: true }),
    mandateEndDate: z.string().datetime({ offset: true }),
    redirectUrl: z.string().optional(),
    debitAmount: z.number().nullish(),
  })
  .passthrough();
const MandateCreationResponseBody = z
  .object({
    responseMessage: z.string(),
    mandateReference: z.string(),
    mandateCode: z.string(),
    mandateStatus: z.string(),
    redirectUrl: z.string(),
  })
  .partial()
  .passthrough();
const CreateMandateSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: MandateCreationResponseBody,
  })
  .partial()
  .passthrough();
const MandateStatusDetails = z
  .object({
    mandateCode: z.string(),
    externalMandateReference: z.string(),
    startDate: z.string().datetime({ offset: true }),
    endDate: z.string().datetime({ offset: true }),
    mandateStatus: z.string(),
    mandateAmount: z.number().int(),
    contractCode: z.string(),
    autoRenew: z.boolean(),
    customerPhoneNumber: z.string(),
    customerEmailAddress: z.string().email(),
    customerAddress: z.string(),
    customerName: z.string(),
    customerAccountName: z.string(),
    customerAccountNumber: z.string(),
    customerAccountBankCode: z.string(),
    mandateDescription: z.string(),
    debitAmount: z.number().int().nullable(),
    authorizationMessage: z.string().nullable(),
    authorizationLink: z.string().nullable(),
  })
  .partial()
  .passthrough();
const GetMandateStatusSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z.array(MandateStatusDetails),
  })
  .partial()
  .passthrough();
const DebitMandateRequest = z
  .object({
    paymentReference: z.string(),
    mandateCode: z.string(),
    debitAmount: z.number(),
    narration: z.string(),
    customerEmail: z.string().email(),
    incomeSplitConfig: z
      .array(
        z
          .object({
            subAccountCode: z.string(),
            feePercentage: z.number(),
            splitAmount: z.number(),
            splitPercentage: z.number(),
            feeBearer: z.boolean(),
          })
          .partial()
          .passthrough()
      )
      .optional(),
  })
  .passthrough();
const DebitMandateResponseBody = z
  .object({
    transactionStatus: z.string(),
    responseMessage: z.string(),
    transactionReference: z.string(),
    paymentReference: z.string(),
    debitAmount: z.number().int(),
    narration: z.string(),
    mandateCode: z.string(),
  })
  .partial()
  .passthrough();
const DebitMandateSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: DebitMandateResponseBody,
  })
  .partial()
  .passthrough();
const DebitStatusDetails = z
  .object({
    transactionStatus: z.string(),
    responseMessage: z.object({}).partial().passthrough().nullable(),
    transactionReference: z.string(),
    paymentReference: z.string(),
    debitAmount: z.number().int(),
    narration: z.string(),
    mandateCode: z.string(),
  })
  .partial()
  .passthrough();
const GetDebitStatusSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: DebitStatusDetails,
  })
  .partial()
  .passthrough();
const UpdateMandateResponseBody = z
  .object({
    responseMessage: z.string(),
    mandateReference: z.string(),
    mandateCode: z.string(),
    mandateStatus: z.string(),
  })
  .partial()
  .passthrough();
const UpdateMandateSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: UpdateMandateResponseBody,
  })
  .partial()
  .passthrough();
const CreateSubAccountRequest = z
  .object({
    currencyCode: z.string(),
    accountNumber: z.string(),
    bankCode: z.string(),
    email: z.string().email(),
    defaultSplitPercentage: z.number(),
  })
  .passthrough();
const SubAccountDetails = z
  .object({
    subAccountCode: z.string(),
    accountNumber: z.string(),
    accountName: z.string(),
    currencyCode: z.string(),
    email: z.string().email(),
    bankCode: z.string(),
    bankName: z.string(),
    defaultSplitPercentage: z.number(),
    settlementProfileCode: z.string(),
    settlementReportEmails: z.array(z.string()),
  })
  .partial()
  .passthrough();
const CreateSubAccountSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z.array(SubAccountDetails),
  })
  .partial()
  .passthrough();
const GetSubAccountsSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z.array(SubAccountDetails),
  })
  .partial()
  .passthrough();
const UpdateSubAccountRequest = z
  .object({
    subAccountCode: z.string(),
    currencyCode: z.string(),
    accountNumber: z.string(),
    bankCode: z.string(),
    email: z.string().email(),
    defaultSplitPercentage: z.number(),
  })
  .passthrough();
const UpdateSubAccountSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: SubAccountDetails,
  })
  .partial()
  .passthrough();
const DeleteSubAccountSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
  })
  .partial()
  .passthrough();
const CreateLimitProfileRequest = z
  .object({
    limitProfileName: z.string(),
    singleTransactionValue: z.number(),
    dailyTransactionValue: z.number(),
    dailyTransactionVolume: z.number().int(),
  })
  .passthrough();
const LimitProfileDetails = z
  .object({
    limitProfileCode: z.string(),
    limitProfileName: z.string(),
    singleTransactionValue: z.number().int(),
    dailyTransactionVolume: z.number().int(),
    dailyTransactionValue: z.number().int(),
    dateCreated: z.string(),
    lastModified: z.string(),
  })
  .partial()
  .passthrough();
const CreateLimitProfileSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: LimitProfileDetails,
  })
  .partial()
  .passthrough();
const SortObject = z
  .object({ sorted: z.boolean(), unsorted: z.boolean(), empty: z.boolean() })
  .partial()
  .passthrough();
const PageableObject = z
  .object({
    sort: SortObject,
    pageSize: z.number().int(),
    pageNumber: z.number().int(),
    offset: z.number().int(),
    unpaged: z.boolean(),
    paged: z.boolean(),
  })
  .partial()
  .passthrough();
const LimitProfilePage = z
  .object({
    content: z.array(LimitProfileDetails),
    pageable: PageableObject,
    last: z.boolean(),
    totalElements: z.number().int(),
    totalPages: z.number().int(),
    sort: SortObject,
    first: z.boolean(),
    numberOfElements: z.number().int(),
    size: z.number().int(),
    number: z.number().int(),
    empty: z.boolean(),
  })
  .partial()
  .passthrough();
const GetLimitProfilesSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: LimitProfilePage,
  })
  .partial()
  .passthrough();
const UpdateLimitProfileRequest = z
  .object({
    limitProfileName: z.string(),
    singleTransactionValue: z.number(),
    dailyTransactionValue: z.number(),
    dailyTransactionVolume: z.number().int(),
  })
  .passthrough();
const UpdateLimitProfileSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: LimitProfileDetails,
  })
  .partial()
  .passthrough();
const ReserveAccountWithLimitRequest = z
  .object({
    contractCode: z.string(),
    accountName: z.string(),
    currencyCode: z.string().optional(),
    accountReference: z.string(),
    customerEmail: z.string().email().optional(),
    customerName: z.string().optional(),
    getAllAvailableBanks: z.boolean().optional(),
    preferredBanks: z.array(z.string()).optional(),
    limitProfileCode: z.string(),
  })
  .passthrough();
const LimitProfileConfigDetails = z
  .object({
    limitProfileCode: z.string(),
    limitProfileName: z.string(),
    singleTransactionValue: z.number(),
    dailyTransactionVolume: z.number().int(),
    dailyTransactionValue: z.number(),
  })
  .partial()
  .passthrough();
const ReservedAccountDetailsWithLimit = z
  .object({
    contractCode: z.string(),
    accountReference: z.string(),
    accountName: z.string(),
    currencyCode: z.string(),
    customerEmail: z.string().email(),
    customerName: z.string(),
    accountNumber: z.string(),
    bankName: z.string(),
    bankCode: z.string(),
    collectionChannel: z.string(),
    reservationReference: z.string(),
    reservedAccountType: z.string(),
    status: z.string(),
    createdOn: z.string().datetime({ offset: true }),
    incomeSplitConfig: z.array(z.object({}).partial().passthrough()),
    restrictPaymentSource: z.boolean(),
    limitProfileConfig: LimitProfileConfigDetails,
  })
  .partial()
  .passthrough();
const ReserveAccountWithLimitSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: ReservedAccountDetailsWithLimit,
  })
  .partial()
  .passthrough();
const UpdateReserveAccountLimitRequest = z
  .object({ accountReference: z.string(), limitProfileCode: z.string() })
  .passthrough();
const UpdateReserveAccountLimitSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: ReservedAccountDetailsWithLimit,
  })
  .partial()
  .passthrough();
const InitiateRefundRequest = z
  .object({
    transactionReference: z.string(),
    refundAmount: z.number(),
    refundReference: z.string(),
    refundReason: z.string(),
    customerNote: z.string(),
    destinationAccountNumber: z.string().optional(),
    destinationAccountBankCode: z.string().optional(),
  })
  .passthrough();
const RefundDetails = z
  .object({
    refundReference: z.string(),
    transactionReference: z.string(),
    refundReason: z.string(),
    customerNote: z.string(),
    refundAmount: z.number().int(),
    refundType: z.string(),
    refundStatus: z.string(),
    refundStrategy: z.string(),
    comment: z.string(),
    createdOn: z.string().datetime({ offset: true }),
  })
  .partial()
  .passthrough();
const InitiateRefundSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: RefundDetails,
  })
  .partial()
  .passthrough();
const GetRefundStatusSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: RefundDetails,
  })
  .partial()
  .passthrough();
const RefundPage = z
  .object({
    content: z.array(RefundDetails),
    pageable: PageableObject,
    last: z.boolean(),
    totalElements: z.number().int(),
    totalPages: z.number().int(),
    sort: SortObject,
    first: z.boolean(),
    numberOfElements: z.number().int(),
    size: z.number().int(),
    number: z.number().int(),
    empty: z.boolean(),
  })
  .partial()
  .passthrough();
const GetAllRefundsSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: RefundPage,
  })
  .partial()
  .passthrough();
const TransactionDetails = z
  .object({
    transactionReference: z.string(),
    paymentReference: z.string(),
    amountPaid: z.string(),
    totalPayable: z.string(),
    settlementAmount: z.string(),
    paidOn: z.string(),
    paymentStatus: z.string(),
    paymentDescription: z.string(),
    transactionHash: z.string(),
    currency: z.string(),
    paymentMethod: z.string(),
    product: z
      .object({ type: z.string(), reference: z.string() })
      .partial()
      .passthrough(),
    cardDetails: z
      .object({
        cardType: z.string(),
        last4: z.string(),
        expMonth: z.string(),
        expYear: z.string(),
        bin: z.string(),
        bankCode: z.string(),
        bankName: z.string(),
        reusable: z.boolean(),
        countryCode: z.null(),
        cardToken: z.string(),
        supportsTokenization: z.boolean(),
        maskedPan: z.string(),
      })
      .partial()
      .passthrough(),
    accountDetails: z.null(),
    accountPayments: z.array(z.object({}).partial().passthrough()),
    customer: z
      .object({ email: z.string(), name: z.string() })
      .partial()
      .passthrough(),
    metaData: z.object({}).partial().passthrough(),
  })
  .partial()
  .passthrough();
const TransactionPage = z
  .object({
    content: z.array(TransactionDetails),
    pageable: PageableObject,
    last: z.boolean(),
    totalElements: z.number().int(),
    totalPages: z.number().int(),
    sort: SortObject,
    first: z.boolean(),
    numberOfElements: z.number().int(),
    size: z.number().int(),
    number: z.number().int(),
    empty: z.boolean(),
  })
  .partial()
  .passthrough();
const GetTransactionsBySettlementReferenceSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: TransactionPage,
  })
  .partial()
  .passthrough();
const GetSettlementInformationForTransactionSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z
      .object({
        transactionReference: z.string(),
        settlementReference: z.string(),
        settlementDate: z.string(),
        settlementAmount: z.number(),
        currency: z.string(),
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const AccountValidationDetails = z
  .object({
    accountNumber: z.string(),
    accountName: z.string(),
    bankCode: z.string(),
  })
  .partial()
  .passthrough();
const ValidateBankAccountSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: AccountValidationDetails,
  })
  .partial()
  .passthrough();
const BVNVerificationRequest = z
  .object({
    bvn: z.string(),
    name: z.string(),
    dateOfBirth: z.string(),
    mobileNo: z.string(),
  })
  .passthrough();
const BVNVerificationFailureResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
  })
  .partial()
  .passthrough();
const BVNVerificationDetails = z
  .object({
    bvn: z.string(),
    name: z
      .object({
        matchStatus: z.enum(["FULL_MATCH", "PARTIAL_MATCH", "NO_MATCH"]),
        matchPercentage: z.number().int(),
      })
      .partial()
      .passthrough(),
    dateOfBirth: z.enum(["FULL_MATCH", "NO_MATCH"]),
    mobileNo: z.enum(["FULL_MATCH", "NO_MATCH"]),
  })
  .partial()
  .passthrough();
const BVNVerificationSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: BVNVerificationDetails,
  })
  .partial()
  .passthrough();
const BVNAccountMatchRequest = z
  .object({ bankCode: z.string(), accountNumber: z.string(), bvn: z.string() })
  .passthrough();
const BVNAccountMatchFailureResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
  })
  .partial()
  .passthrough();
const BVNAccountMatchDetails = z
  .object({
    bvn: z.string(),
    accountNumber: z.string(),
    accountName: z.string(),
    matchStatus: z.enum(["FULL_MATCH", "NO_MATCH"]),
    matchPercentage: z.number().int(),
  })
  .partial()
  .passthrough();
const BVNAccountMatchSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: BVNAccountMatchDetails,
  })
  .partial()
  .passthrough();
const NINVerificationRequest = z.object({ nin: z.string() }).passthrough();
const NINVerificationDetails = z
  .object({
    nin: z.string(),
    lastName: z.string(),
    firstName: z.string(),
    middleName: z.string(),
    dateOfBirth: z.string(),
    gender: z.string(),
    mobileNumber: z.string(),
  })
  .partial()
  .passthrough();
const NINVerificationSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: NINVerificationDetails,
  })
  .partial()
  .passthrough();
const NINVerificationFailureResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
  })
  .partial()
  .passthrough();
const CategoryResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z
      .object({
        content: z.array(
          z
            .object({ code: z.string(), name: z.string() })
            .partial()
            .passthrough()
        ),
        totalElements: z.number().int(),
        size: z.number().int(),
        number: z.number().int(),
        empty: z.boolean(),
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const BillerResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z
      .object({
        content: z.array(
          z
            .object({
              code: z.string(),
              name: z.string(),
              categories: z.array(
                z
                  .object({ code: z.string(), name: z.string() })
                  .partial()
                  .passthrough()
              ),
            })
            .partial()
            .passthrough()
        ),
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const ProductResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z
      .object({
        content: z.array(
          z
            .object({
              code: z.string(),
              name: z.string(),
              minAmount: z.number().nullable(),
              maxAmount: z.number().nullable(),
              price: z.number().nullable(),
              priceType: z.string(),
            })
            .partial()
            .passthrough()
        ),
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const VendRequest = z
  .object({
    productCode: z.string(),
    customerId: z.string(),
    validationReference: z.string().optional(),
    amount: z.number(),
    emailAddress: z.string().email().optional(),
    phoneNumber: z.string().optional(),
    reference: z.string(),
  })
  .passthrough();
const VendResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z
      .object({
        vendReference: z.string(),
        transactionReference: z.string(),
        vendStatus: z.string(),
        description: z.string(),
        vendAmount: z.number(),
        payableAmount: z.number(),
        commission: z.number(),
        customerId: z.string(),
        productCode: z.string(),
        productName: z.string(),
        billerCode: z.string(),
        billerName: z.string(),
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const RequeryResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z
      .object({
        transactionReference: z.string(),
        vendStatus: z.string(),
        description: z.string(),
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const ValidateCustomerRequest = z
  .object({ productCode: z.string(), customerId: z.string() })
  .passthrough();
const ValidateCustomerResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z
      .object({
        customerName: z.string(),
        priceType: z.string(),
        price: z.number().nullable(),
        vendInstruction: z
          .object({
            requireValidationRef: z.boolean(),
            validationReference: z.string(),
          })
          .partial()
          .passthrough(),
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const Bank = z
  .object({
    name: z.string(),
    code: z.string(),
    ussdTemplate: z.string().nullable(),
    baseUssdCode: z.string().nullable(),
    transferUssdTemplate: z.string().nullable(),
  })
  .partial()
  .passthrough();
const BankListSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z.array(Bank),
  })
  .partial()
  .passthrough();
const CreateWalletRequest = z
  .object({
    walletReference: z.string(),
    walletName: z.string(),
    customerName: z.string(),
    customerEmail: z.string(),
    bvnDetails: z
      .object({ bvn: z.number().int(), bvnDateOfBirth: z.string() })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const CreateWalletSuccessResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z
      .object({
        walletName: z.string(),
        walletReference: z.string(),
        customerName: z.string(),
        customerEmail: z.string(),
        feeBearer: z.string(),
        bvnDetails: z
          .object({ bvn: z.number().int(), bvnDateOfBirth: z.string() })
          .partial()
          .passthrough(),
        accountNumber: z.string(),
        accountName: z.string(),
        topUpAccountDetails: z
          .object({
            accountNumber: z.string(),
            accountName: z.string(),
            bankCode: z.string(),
            bankName: z.string(),
            createdOn: z.string().datetime({ offset: true }),
          })
          .partial()
          .passthrough(),
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const Wallet = z
  .object({
    walletName: z.string(),
    walletReference: z.string(),
    customerName: z.string(),
    customerEmail: z.string(),
    feeBearer: z.string(),
    bvnDetails: z
      .object({ bvn: z.number().int(), bvnDateOfBirth: z.string() })
      .partial()
      .passthrough(),
    accountNumber: z.string(),
    accountName: z.string(),
    topUpAccountDetails: z
      .object({
        accountNumber: z.string(),
        accountName: z.string(),
        bankCode: z.string(),
        bankName: z.string(),
      })
      .partial()
      .passthrough(),
    createdOn: z.string().datetime({ offset: true }),
  })
  .partial()
  .passthrough();
const GetWalletsResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z
      .object({
        content: z.array(Wallet),
        pageable: z
          .object({
            sort: z
              .object({
                empty: z.boolean(),
                sorted: z.boolean(),
                unsorted: z.boolean(),
              })
              .partial()
              .passthrough(),
            offset: z.number().int(),
            pageNumber: z.number().int(),
            pageSize: z.number().int(),
            paged: z.boolean(),
            unpaged: z.boolean(),
          })
          .partial()
          .passthrough(),
        last: z.boolean(),
        totalElements: z.number().int(),
        totalPages: z.number().int(),
        size: z.number().int(),
        number: z.number().int(),
        sort: z
          .object({
            empty: z.boolean(),
            sorted: z.boolean(),
            unsorted: z.boolean(),
          })
          .partial()
          .passthrough(),
        first: z.boolean(),
        numberOfElements: z.number().int(),
        empty: z.boolean(),
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const WalletBalanceResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z
      .object({
        availableBalance: z.number().int(),
        ledgerBalance: z.number().int(),
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const WalletTransactions = z
  .object({
    walletTransactionReference: z.string(),
    monnifyTransactionReference: z.string(),
    availableBalanceBefore: z.number(),
    availableBalanceAfter: z.number(),
    amount: z.number(),
    transactionDate: z.string().datetime({ offset: true }),
    transactionType: z.string(),
    message: z.string().nullable(),
    narration: z.string(),
    status: z.string(),
  })
  .partial()
  .passthrough();
const WalletTransactionsResponse = z
  .object({
    requestSuccessful: z.boolean(),
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: z
      .object({
        content: z.array(WalletTransactions),
        pageable: z
          .object({
            sort: z
              .object({
                empty: z.boolean(),
                sorted: z.boolean(),
                unsorted: z.boolean(),
              })
              .partial()
              .passthrough(),
            offset: z.number().int(),
            pageNumber: z.number().int(),
            pageSize: z.number().int(),
            paged: z.boolean(),
            unpaged: z.boolean(),
          })
          .partial()
          .passthrough(),
        last: z.boolean(),
        totalElements: z.number().int(),
        totalPages: z.number().int(),
        size: z.number().int(),
        number: z.number().int(),
        sort: z
          .object({
            empty: z.boolean(),
            sorted: z.boolean(),
            unsorted: z.boolean(),
          })
          .partial()
          .passthrough(),
        first: z.boolean(),
        numberOfElements: z.number().int(),
        empty: z.boolean(),
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const CreatePaycodeRequest = z
  .object({
    beneficiaryName: z.string(),
    amount: z.number(),
    paycodeReference: z.string(),
    expiryDate: z.string(),
    clientId: z.string(),
  })
  .passthrough();
const PaycodeDetails = z
  .object({
    paycode: z.string(),
    transactionReference: z.string(),
    paycodeReference: z.string(),
    beneficiaryName: z.string(),
    amount: z.number(),
    fee: z.number().int(),
    transactionStatus: z.string(),
    expiryDate: z.string(),
    createdOn: z.string().datetime({ offset: true }),
    createdBy: z.string(),
    modifiedBy: z.string(),
  })
  .partial()
  .passthrough();
const CreatePaycodeSuccessResponse = z
  .object({
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: PaycodeDetails,
  })
  .partial()
  .passthrough();
const PaycodeHistory = z
  .object({
    content: z.array(PaycodeDetails),
    pageable: Pageable,
    last: z.boolean(),
    totalPages: z.number().int(),
    totalElements: z.number().int(),
    sort: Sort,
    first: z.boolean(),
    numberOfElements: z.number().int(),
    size: z.number().int(),
    number: z.number().int(),
    empty: z.boolean(),
  })
  .partial()
  .passthrough();
const FetchPaycodesSuccessResponse = z
  .object({
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: PaycodeHistory,
  })
  .partial()
  .passthrough();
const GetPaycodeSuccessResponse = z
  .object({
    responseMessage: z.string(),
    responseCode: z.string(),
    responseBody: PaycodeDetails,
  })
  .partial()
  .passthrough();

export const schemas: { [k: string]: import("zod").ZodTypeAny } = {
  AuthResponseSuccess,
  AuthResponseError,
  AuthResponseNoHeaderError,
  InitializeTransactionRequest,
  InitializeTransactionSuccessResponse,
  ErrorResponse,
  InitBankTransferPaymentRequest,
  InitBankTransferPaymentSuccessResponse,
  CardInfo,
  DeviceInformation,
  ChargeRequest,
  ChargeResponse,
  AuthorizeOTPRequest,
  AuthorizeOTPSuccessResponse,
  Authorize3DSCardRequest,
  Authorize3DSCardSuccessResponse,
  TransactionSearchResponse,
  TransactionStatusResponse,
  InitiateTransferRequest,
  InitiateTransferOTPResponse,
  InitiateTransferSuccessResponse,
  InitiateBulkTransferRequest,
  InitiateBulkTransferSuccessResponse,
  AuthorizeTransferRequest,
  ResendOTPRequest,
  ResendOTPSuccessResponse,
  ResendOTPRequestBulk,
  ResendOTPSuccessResponseBulk,
  SingleTransferStatusResponse,
  SingleTransferDetails,
  ListSingleTransfersResponse,
  BulkTransferDetails,
  ListBulkTransfersResponse,
  BulkTransferTransactionsResponse,
  BulkBatchSummaryResponse,
  DisbursementTransactionDetails,
  SearchDisbursementTransactionsResponse,
  GetWalletBalanceResponse,
  IncomeSplitConfig,
  BankAccount,
  AllowedPaymentSources,
  CreateReservedAccountRequest,
  Account,
  IncomeSplitConfigResponse,
  ReservedAccountDetails,
  CreateReservedAccountResponse,
  CreateInvoiceReservedAccountRequest,
  InvoiceReservedAccountDetails,
  CreateInvoiceReservedAccountSuccessResponse,
  GetReservedAccountDetailsSuccessResponse,
  AddLinkedAccountsRequest,
  LinkedAccountDetails,
  AddLinkedAccountsSuccessResponse,
  UpdateBvnRequest,
  UpdatedBvnAccountDetails,
  UpdateBvnSuccessResponse,
  AllowedPaymentSourcesRequest,
  AllowedPaymentSourcesDetails,
  AllowedPaymentSourcesSuccessResponse,
  UpdateSplitConfigRequestItem,
  SplitConfigDetail,
  UpdatedSplitConfigDetails,
  UpdateSplitConfigSuccessResponse,
  DeallocatedAccountDetails,
  DeallocateAccountSuccessResponse,
  CustomerDTO,
  Transaction,
  Sort,
  Pageable,
  TransactionsResponseBody,
  GetTransactionsSuccessResponse,
  UpdateKycInfoRequest,
  UpdatedKycInfoDetails,
  UpdateKycInfoSuccessResponse,
  CreateInvoiceRequest,
  InvoiceSplitConfig,
  InvoiceDetails,
  CreateInvoiceSuccessResponse,
  ViewInvoiceDetailsSuccessResponse,
  InvoiceListItem,
  InvoiceList,
  GetAllInvoicesSuccessResponse,
  CancelledInvoiceDetails,
  CancelInvoiceSuccessResponse,
  MetaData,
  ChargeCardTokenRequest,
  Product,
  CardDetails,
  CustomerDetails,
  ChargeCardTokenResponseBody,
  ChargeCardTokenSuccessResponse,
  CreateMandateRequest,
  MandateCreationResponseBody,
  CreateMandateSuccessResponse,
  MandateStatusDetails,
  GetMandateStatusSuccessResponse,
  DebitMandateRequest,
  DebitMandateResponseBody,
  DebitMandateSuccessResponse,
  DebitStatusDetails,
  GetDebitStatusSuccessResponse,
  UpdateMandateResponseBody,
  UpdateMandateSuccessResponse,
  CreateSubAccountRequest,
  SubAccountDetails,
  CreateSubAccountSuccessResponse,
  GetSubAccountsSuccessResponse,
  UpdateSubAccountRequest,
  UpdateSubAccountSuccessResponse,
  DeleteSubAccountSuccessResponse,
  CreateLimitProfileRequest,
  LimitProfileDetails,
  CreateLimitProfileSuccessResponse,
  SortObject,
  PageableObject,
  LimitProfilePage,
  GetLimitProfilesSuccessResponse,
  UpdateLimitProfileRequest,
  UpdateLimitProfileSuccessResponse,
  ReserveAccountWithLimitRequest,
  LimitProfileConfigDetails,
  ReservedAccountDetailsWithLimit,
  ReserveAccountWithLimitSuccessResponse,
  UpdateReserveAccountLimitRequest,
  UpdateReserveAccountLimitSuccessResponse,
  InitiateRefundRequest,
  RefundDetails,
  InitiateRefundSuccessResponse,
  GetRefundStatusSuccessResponse,
  RefundPage,
  GetAllRefundsSuccessResponse,
  TransactionDetails,
  TransactionPage,
  GetTransactionsBySettlementReferenceSuccessResponse,
  GetSettlementInformationForTransactionSuccessResponse,
  AccountValidationDetails,
  ValidateBankAccountSuccessResponse,
  BVNVerificationRequest,
  BVNVerificationFailureResponse,
  BVNVerificationDetails,
  BVNVerificationSuccessResponse,
  BVNAccountMatchRequest,
  BVNAccountMatchFailureResponse,
  BVNAccountMatchDetails,
  BVNAccountMatchSuccessResponse,
  NINVerificationRequest,
  NINVerificationDetails,
  NINVerificationSuccessResponse,
  NINVerificationFailureResponse,
  CategoryResponse,
  BillerResponse,
  ProductResponse,
  VendRequest,
  VendResponse,
  RequeryResponse,
  ValidateCustomerRequest,
  ValidateCustomerResponse,
  Bank,
  BankListSuccessResponse,
  CreateWalletRequest,
  CreateWalletSuccessResponse,
  Wallet,
  GetWalletsResponse,
  WalletBalanceResponse,
  WalletTransactions,
  WalletTransactionsResponse,
  CreatePaycodeRequest,
  PaycodeDetails,
  CreatePaycodeSuccessResponse,
  PaycodeHistory,
  FetchPaycodesSuccessResponse,
  GetPaycodeSuccessResponse,
};
