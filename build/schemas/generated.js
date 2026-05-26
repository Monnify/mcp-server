import { makeApi, Zodios } from "@zodios/core";
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
        .array(z
        .object({
        subAccountCode: z.string(),
        feePercentage: z.number(),
        splitAmount: z.number(),
        splitPercentage: z.number(),
        feeBearer: z.boolean(),
    })
        .partial()
        .passthrough())
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
        incomeSplitConfig: z.array(z
            .object({
            subAccountCode: z.string(),
            splitAmount: z.number(),
            feePercentage: z.number(),
            feeBearer: z.boolean(),
            splitPercentage: z.number().int(),
        })
            .partial()
            .passthrough()),
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
    content: z.array(z
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
        .passthrough()),
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
    transactionList: z.array(z
        .object({
        amount: z.number().int(),
        reference: z.string(),
        narration: z.string(),
        destinationBankCode: z.string(),
        destinationAccountNumber: z.string(),
        destinationAccountName: z.string(),
        currency: z.string(),
    })
        .passthrough()),
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
        .array(z
        .object({
        subAccountCode: z.string(),
        feePercentage: z.number(),
        splitAmount: z.number(),
        splitPercentage: z.number(),
        feeBearer: z.boolean(),
    })
        .partial()
        .passthrough())
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
        content: z.array(z
            .object({ code: z.string(), name: z.string() })
            .partial()
            .passthrough()),
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
        content: z.array(z
            .object({
            code: z.string(),
            name: z.string(),
            categories: z.array(z
                .object({ code: z.string(), name: z.string() })
                .partial()
                .passthrough()),
        })
            .partial()
            .passthrough()),
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
        content: z.array(z
            .object({
            code: z.string(),
            name: z.string(),
            minAmount: z.number().nullable(),
            maxAmount: z.number().nullable(),
            price: z.number().nullable(),
            priceType: z.string(),
        })
            .partial()
            .passthrough()),
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
export const schemas = {
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
const endpoints = makeApi([
    {
        method: "post",
        path: "/api/v1/auth/login",
        alias: "postApiv1authlogin",
        description: `This endpoint generates an access token that would be used to authenticate all other endpoints.`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: z.void(),
        errors: [
            {
                status: NaN,
                description: `Successful response`,
                schema: AuthResponseSuccess,
            },
            {
                status: NaN,
                description: `Failed Response due to Invalid Token`,
                schema: AuthResponseError,
            },
            {
                status: NaN,
                description: `Failed Response due to no header provided`,
                schema: AuthResponseNoHeaderError,
            },
        ],
    },
    {
        method: "post",
        path: "/api/v1/bank-transfer/reserved-accounts",
        alias: "postApiv1bankTransferreservedAccounts",
        description: `This endpoint allows the creation of an invoiced reserved account.`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: CreateInvoiceReservedAccountRequest,
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: CreateInvoiceReservedAccountSuccessResponse,
        errors: [
            {
                status: 400,
                description: `Bad request`,
                schema: ErrorResponse,
            },
            {
                status: 422,
                description: `Unprocessable Entity`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "put",
        path: "/api/v1/bank-transfer/reserved-accounts/:accountReference/kyc-info",
        alias: "putApiv1bankTransferreservedAccountsAccountReferencekycInfo",
        description: `This endpoint links customers&#x27; BVN/NIN to their respective reserved accounts.
`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: UpdateKycInfoRequest,
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "accountReference",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: UpdateKycInfoSuccessResponse,
        errors: [
            {
                status: 400,
                description: `Bad request`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "put",
        path: "/api/v1/bank-transfer/reserved-accounts/add-linked-accounts/:accountReference",
        alias: "putApiv1bankTransferreservedAccountsaddLinkedAccountsAccountReference",
        description: `This endpoint links accounts with another partner bank to an existing customer.`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: AddLinkedAccountsRequest,
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "accountReference",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: AddLinkedAccountsSuccessResponse,
        errors: [
            {
                status: 404,
                description: `Reserved account not found`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "post",
        path: "/api/v1/bank-transfer/reserved-accounts/limit",
        alias: "postApiv1bankTransferreservedAccountslimit",
        description: `This endpoint reserves an account for your customers with a transaction limit profile on it.`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: ReserveAccountWithLimitRequest,
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: ReserveAccountWithLimitSuccessResponse,
        errors: [
            {
                status: 404,
                description: `Not Found`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "put",
        path: "/api/v1/bank-transfer/reserved-accounts/limit",
        alias: "putApiv1bankTransferreservedAccountslimit",
        description: `This endpoint updates the information on an existing Limit Profile for a Reserved Account.`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: UpdateReserveAccountLimitRequest,
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: UpdateReserveAccountLimitSuccessResponse,
        errors: [
            {
                status: 404,
                description: `Not Found`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "delete",
        path: "/api/v1/bank-transfer/reserved-accounts/reference/:accountReference",
        alias: "deleteApiv1bankTransferreservedAccountsreferenceAccountReference",
        description: `This endpoint allows you to deallocate/delete already created a reserved account.`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "accountReference",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: DeallocateAccountSuccessResponse,
        errors: [
            {
                status: 400,
                description: `Bad request`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "get",
        path: "/api/v1/bank-transfer/reserved-accounts/transactions",
        alias: "getApiv1bankTransferreservedAccountstransactions",
        description: `This endpoint returns the list of all transactions done on a reserved account.`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "accountReference",
                type: "Query",
                schema: z.string(),
            },
            {
                name: "page",
                type: "Query",
                schema: z.number().int().optional(),
            },
            {
                name: "size",
                type: "Query",
                schema: z.number().int().optional(),
            },
        ],
        response: GetTransactionsSuccessResponse,
        errors: [
            {
                status: 400,
                description: `Bad request`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "put",
        path: "/api/v1/bank-transfer/reserved-accounts/update-customer-bvn/:reservedAccountReference",
        alias: "putApiv1bankTransferreservedAccountsupdateCustomerBvnReservedAccountReference",
        description: `This endpoint updates BVN of customers reserved account`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: z.object({ bvn: z.string() }).passthrough(),
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "reservedAccountReference",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: UpdateBvnSuccessResponse,
        errors: [
            {
                status: 400,
                description: `Invalid BVN provided`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "put",
        path: "/api/v1/bank-transfer/reserved-accounts/update-income-split-config/:accountReference",
        alias: "putApiv1bankTransferreservedAccountsupdateIncomeSplitConfigAccountReference",
        description: `This endpoint updates the split config of a customer reserved account.`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: z.array(UpdateSplitConfigRequestItem),
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "accountReference",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: UpdateSplitConfigSuccessResponse,
        errors: [
            {
                status: 400,
                description: `Bad request`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "put",
        path: "/api/v1/bank-transfer/reserved-accounts/update-payment-source-filter/:accountReference",
        alias: "putApiv1bankTransferreservedAccountsupdatePaymentSourceFilterAccountReference",
        description: `This endpoint manages accounts that can fund a reserved account using either BVNs, Account Name or Account Number.`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: AllowedPaymentSourcesRequest,
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "accountReference",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: AllowedPaymentSourcesSuccessResponse,
        errors: [
            {
                status: 400,
                description: `Invalid request`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "get",
        path: "/api/v1/banks",
        alias: "getApiv1banks",
        description: `This endpoint returns a list of all banks supported by Monnify for collections and disbursements.`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: BankListSuccessResponse,
        errors: [
            {
                status: 401,
                description: `Failed Response`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "get",
        path: "/api/v1/direct-debit/mandate/",
        alias: "getApiv1directDebitmandate",
        description: `This endpoint retrieves the details of a created mandate.`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "mandateReferences",
                type: "Query",
                schema: z.string(),
            },
        ],
        response: GetMandateStatusSuccessResponse,
        errors: [
            {
                status: 404,
                description: `Not Found`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "patch",
        path: "/api/v1/direct-debit/mandate/cancel-mandate/:mandateCode",
        alias: "patchApiv1directDebitmandatecancelMandateMandateCode",
        description: `This endpoint cancels/deactivates a mandate.`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "mandateCode",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: UpdateMandateSuccessResponse,
        errors: [
            {
                status: 404,
                description: `Not Found`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "post",
        path: "/api/v1/direct-debit/mandate/create",
        alias: "postApiv1directDebitmandatecreate",
        description: `This endpoint initiates the creation of a mandate.`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: CreateMandateRequest,
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: CreateMandateSuccessResponse,
        errors: [
            {
                status: 404,
                description: `Not Found`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "post",
        path: "/api/v1/direct-debit/mandate/debit",
        alias: "postApiv1directDebitmandatedebit",
        description: `This endpoint debits an active mandate.`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: DebitMandateRequest,
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: DebitMandateSuccessResponse,
        errors: [
            {
                status: 404,
                description: `Not Found`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "get",
        path: "/api/v1/direct-debit/mandate/debit-status",
        alias: "getApiv1directDebitmandatedebitStatus",
        description: `This endpoint gets the status of a debited mandate.`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "paymentReference",
                type: "Query",
                schema: z.string(),
            },
        ],
        response: GetDebitStatusSuccessResponse,
        errors: [
            {
                status: 404,
                description: `Not Found`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "get",
        path: "/api/v1/disbursements/account/validate",
        alias: "getApiv1disbursementsaccountvalidate",
        description: `This endpoint validates a Customer&#x27;s NUBAN Account.`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "accountNumber",
                type: "Query",
                schema: z.string(),
            },
            {
                name: "bankCode",
                type: "Query",
                schema: z.string(),
            },
        ],
        response: ValidateBankAccountSuccessResponse,
        errors: [
            {
                status: 404,
                description: `Not Found`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "post",
        path: "/api/v1/disbursements/wallet",
        alias: "postApiv1disbursementswallet",
        description: `This endpoint enables a merchant to creates wallets for their customers

&gt; [!IMPORTANT]
&gt; Please note that the wallet creation is only available for merchants who
 have been granted access to the wallet feature. Kindly contact sales@monnify.com
 to get access to this feature.
`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: CreateWalletRequest,
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: CreateWalletSuccessResponse,
        errors: [
            {
                status: 422,
                description: `Unprocessable Entity (Validation Error)`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "get",
        path: "/api/v1/disbursements/wallet",
        alias: "getApiv1disbursementswallet",
        description: `This endpoint returns all the wallets created by a merchant`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "walletReference",
                type: "Query",
                schema: z.string().optional(),
            },
            {
                name: "pageSize",
                type: "Query",
                schema: z.number().int().optional(),
            },
            {
                name: "pageNo",
                type: "Query",
                schema: z.number().int().optional(),
            },
        ],
        response: GetWalletsResponse,
        errors: [
            {
                status: 401,
                description: `Unauthorized Request`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "get",
        path: "/api/v1/disbursements/wallet/balance",
        alias: "getApiv1disbursementswalletbalance",
        description: `This endpoint returns the balance associated with a wallet`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "walletReference",
                type: "Query",
                schema: z.string().optional(),
            },
        ],
        response: WalletBalanceResponse,
        errors: [
            {
                status: 401,
                description: `Unauthorized Request`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "get",
        path: "/api/v1/disbursements/wallet/transactions",
        alias: "getApiv1disbursementswallettransactions",
        description: `This endpoint returns all the transactions performed by a wallet`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "accountNumber",
                type: "Query",
                schema: z.string().optional(),
            },
            {
                name: "pageSize",
                type: "Query",
                schema: z.string().optional(),
            },
            {
                name: "pageNo",
                type: "Query",
                schema: z.string().optional(),
            },
        ],
        response: WalletTransactionsResponse,
        errors: [
            {
                status: 401,
                description: `Unauthorized Request`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "delete",
        path: "/api/v1/invoice/:invoiceReference/cancel",
        alias: "deleteApiv1invoiceInvoiceReferencecancel",
        description: `This endpoint cancels an Invoice on your integration.`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "invoiceReference",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: CancelInvoiceSuccessResponse,
        errors: [
            {
                status: 404,
                description: `Not Found`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "get",
        path: "/api/v1/invoice/:invoiceReference/details",
        alias: "getApiv1invoiceInvoiceReferencedetails",
        description: `This endpoint returns details of an invoice on your integration.`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "invoiceReference",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: ViewInvoiceDetailsSuccessResponse,
        errors: [
            {
                status: 404,
                description: `Not Found`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "get",
        path: "/api/v1/invoice/all",
        alias: "getApiv1invoiceall",
        description: `This endpoint returns the list of all the invoice available on your integration.`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: GetAllInvoicesSuccessResponse,
        errors: [
            {
                status: 404,
                description: `Not Found`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "post",
        path: "/api/v1/invoice/create",
        alias: "postApiv1invoicecreate",
        description: `This endpoint enables merchant to create an invoice.
&gt; [!IMPORTANT] **NOTE**: When creating a Static Invoice, the &#x60;accountReference&#x60; key is compulsory. Excluding it would create a Dynamic Invoice.`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: CreateInvoiceRequest,
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: CreateInvoiceSuccessResponse,
        errors: [
            {
                status: 422,
                description: `Unprocessable Entity`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "post",
        path: "/api/v1/limit-profile/",
        alias: "postApiv1limitProfile",
        description: `This endpoint creates limit profiles on a customer&#x27;s account.`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: CreateLimitProfileRequest,
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: CreateLimitProfileSuccessResponse,
        errors: [
            {
                status: 404,
                description: `Not Found`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "get",
        path: "/api/v1/limit-profile/",
        alias: "getApiv1limitProfile",
        description: `This endpoint returns the list of all Limit Profiles that have been created for your customers.`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: GetLimitProfilesSuccessResponse,
        errors: [
            {
                status: 404,
                description: `Not Found`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "put",
        path: "/api/v1/limit-profile/:limitProfileCode",
        alias: "putApiv1limitProfileLimitProfileCode",
        description: `This endpoint updates the information on an existing Limit Profile.`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: UpdateLimitProfileRequest,
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "limitProfileCode",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: UpdateLimitProfileSuccessResponse,
        errors: [
            {
                status: 404,
                description: `Not Found`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "post",
        path: "/api/v1/merchant/bank-transfer/init-payment",
        alias: "postApiv1merchantbankTransferinitPayment",
        description: `This endpoint generates a dynamic account number and its associated bank for one time payment.`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: InitBankTransferPaymentRequest,
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: InitBankTransferPaymentSuccessResponse,
        errors: [
            {
                status: 400,
                description: `Bad request.`,
                schema: ErrorResponse,
            },
            {
                status: 422,
                description: `Unprocessable Entity.`,
                schema: ErrorResponse,
            },
            {
                status: 500,
                description: `Internal Server Error.`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "post",
        path: "/api/v1/merchant/cards/charge",
        alias: "postApiv1merchantcardscharge",
        description: `Initiate a charge on a card.
#### Test Card Info: &lt;br/&gt;

+ Card Without OTP: &#x60;4111111111111111 10/2025 1234 123&#x60; &lt;br/&gt;
+ Card With OTP: &#x60;5060995994247093 12/2025 1234 123&#x60; &lt;br/&gt;
+ Card With 3DS: &#x60;4000000000000002 12/2025 1234 123&#x60; &lt;br/&gt;
+ Failed Card: &#x60;4111111111111110 10/2025 1234 123&#x60; &lt;br/&gt;`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: ChargeRequest,
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: ChargeResponse,
        errors: [
            {
                status: 400,
                description: `Bad Request (e.g., invalid card number)`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "post",
        path: "/api/v1/merchant/cards/charge-card-token",
        alias: "postApiv1merchantcardschargeCardToken",
        description: `This endpoint allows you to charge an already tokenized card with it’s card token.
&gt; [!IMPORTANT] **NOTE**: The customer email address used in the first successful charge should be stored along with the card token.`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: ChargeCardTokenRequest,
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: ChargeCardTokenSuccessResponse,
        errors: [
            {
                status: 404,
                description: `Not Found (e.g., Invalid card token)`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "post",
        path: "/api/v1/merchant/cards/otp/authorize",
        alias: "postApiv1merchantcardsotpauthorize",
        description: `The endpoint authorizes an OTP to complete a charge on a card.`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: AuthorizeOTPRequest,
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: AuthorizeOTPSuccessResponse,
        errors: [
            {
                status: 400,
                description: `Bad request.`,
                schema: ErrorResponse,
            },
            {
                status: 422,
                description: `Unprocessable Entity.`,
                schema: ErrorResponse,
            },
            {
                status: 500,
                description: `Internal Server Error.`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "post",
        path: "/api/v1/merchant/transactions/init-transaction",
        alias: "postApiv1merchanttransactionsinitTransaction",
        description: `This endpoint initialises the transaction that would be used for card payments and dynamic transfers. In sandbox mode, You can use our [Web Similator](https://websim.sdk.monnify.com/#/bankingapp) to complete this transaction via the Bank transfer option.
&gt; [!IMPORTANT] **NOTE**: It is important to confirm that the values returned by this endpoint (and the SDK) corresponds to the values you provided in the request payload, as bad actors can intercept the request and make alterations to values such as the transaction amount.`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: InitializeTransactionRequest,
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: InitializeTransactionSuccessResponse,
        errors: [
            {
                status: 400,
                description: `Bad request.`,
                schema: ErrorResponse,
            },
            {
                status: 422,
                description: `Unprocessable Entity.`,
                schema: ErrorResponse,
            },
            {
                status: 500,
                description: `Internal Server Error.`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "post",
        path: "/api/v1/paycode",
        alias: "postApiv1paycode",
        description: `The endpoint allows merchant create paycodes via API.`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: CreatePaycodeRequest,
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: CreatePaycodeSuccessResponse,
        errors: [
            {
                status: 400,
                description: `Bad Request`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "get",
        path: "/api/v1/paycode",
        alias: "getApiv1paycode",
        description: `This endpoint returns a history of generated Paycodes over a period of time using some search criteria.`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "transactionReference",
                type: "Query",
                schema: z.string().optional(),
            },
            {
                name: "beneficiaryName",
                type: "Query",
                schema: z.string().optional(),
            },
            {
                name: "transactionStatus",
                type: "Query",
                schema: z.string().optional(),
            },
            {
                name: "from",
                type: "Query",
                schema: z.number().int().optional(),
            },
            {
                name: "to",
                type: "Query",
                schema: z.number().int().optional(),
            },
        ],
        response: FetchPaycodesSuccessResponse,
    },
    {
        method: "get",
        path: "/api/v1/paycode/:paycodeReference",
        alias: "getApiv1paycodePaycodeReference",
        description: `This endpoint returns paycode information for a given paycode reference.`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "paycodeReference",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: GetPaycodeSuccessResponse,
        errors: [
            {
                status: 404,
                description: `Not Found`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "delete",
        path: "/api/v1/paycode/:paycodeReference",
        alias: "deleteApiv1paycodePaycodeReference",
        description: `This endpoint cancels or invalidates a generated Paycode.`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "paycodeReference",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: CreatePaycodeSuccessResponse,
        errors: [
            {
                status: 404,
                description: `Not Found`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "get",
        path: "/api/v1/paycode/:paycodeReference/authorize",
        alias: "getApiv1paycodePaycodeReferenceauthorize",
        description: `This endpoint is used to get an unmasked paycode information.`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "paycodeReference",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: GetPaycodeSuccessResponse,
        errors: [
            {
                status: 404,
                description: `Not Found`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "get",
        path: "/api/v1/refunds",
        alias: "getApiv1refunds",
        description: `This endpoint returns the list of all refunds available on your integration.`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "page",
                type: "Query",
                schema: z.string().optional(),
            },
            {
                name: "size",
                type: "Query",
                schema: z.string().optional(),
            },
        ],
        response: GetAllRefundsSuccessResponse,
        errors: [
            {
                status: 404,
                description: `Not Found`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "get",
        path: "/api/v1/refunds/:refundReference",
        alias: "getApiv1refundsRefundReference",
        description: `This endpoint returns the status of an initiated refund.`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "refundReference",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: GetRefundStatusSuccessResponse,
        errors: [
            {
                status: 404,
                description: `Not Found`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "post",
        path: "/api/v1/refunds/initiate-refund",
        alias: "postApiv1refundsinitiateRefund",
        description: `This endpoint allows you to Initiate a refund.
&gt; [!IMPORTANT] Please note that usage of this API in live environment requires approval from your relationship manager, kindly reach out to them or contact sales@monnify.com to get approval for this feature.`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: InitiateRefundRequest,
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: InitiateRefundSuccessResponse,
        errors: [
            {
                status: 404,
                description: `Not Found`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "post",
        path: "/api/v1/sdk/cards/secure-3d/authorize",
        alias: "postApiv1sdkcardssecure3dauthorize",
        description: `This endpoint authorizes charge on a card that uses 3DS Secure Authentication.`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: Authorize3DSCardRequest,
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: Authorize3DSCardSuccessResponse,
        errors: [
            {
                status: 400,
                description: `Bad request.`,
                schema: ErrorResponse,
            },
            {
                status: 422,
                description: `Unprocessable Entity.`,
                schema: ErrorResponse,
            },
            {
                status: 500,
                description: `Internal Server Error.`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "get",
        path: "/api/v1/sdk/transactions/banks",
        alias: "getApiv1sdktransactionsbanks",
        description: `This endpoint returns the list of all supported banks with their valid USSD short code.`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: BankListSuccessResponse,
        errors: [
            {
                status: 401,
                description: `Failed Response`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "get",
        path: "/api/v1/settlement-detail",
        alias: "getApiv1settlementDetail",
        description: `This endpoint returns settlement information on transactions made to your settlement account.`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "transactionReference",
                type: "Query",
                schema: z.string(),
            },
        ],
        response: GetSettlementInformationForTransactionSuccessResponse,
        errors: [
            {
                status: 404,
                description: `Not Found`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "post",
        path: "/api/v1/sub-accounts",
        alias: "postApiv1subAccounts",
        description: `This endpoint allows you to create a sub account to enable the spliting of payments between different accounts.
&gt; [!IMPORTANT] Please note that usage of this API in live environment requires approval from your relationship manager, kindly reach out to them or contact sales@monnify.com to get approval for this feature.`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: z.array(CreateSubAccountRequest),
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: CreateSubAccountSuccessResponse,
        errors: [
            {
                status: 404,
                description: `Not Found`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "get",
        path: "/api/v1/sub-accounts",
        alias: "getApiv1subAccounts",
        description: `This endpoint returns the list of sub accounts that have been created on your integration.`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: GetSubAccountsSuccessResponse,
    },
    {
        method: "put",
        path: "/api/v1/sub-accounts",
        alias: "putApiv1subAccounts",
        description: `This endpoint updates the details of an existing sub account.`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: UpdateSubAccountRequest,
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: UpdateSubAccountSuccessResponse,
        errors: [
            {
                status: 404,
                description: `Not Found`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "delete",
        path: "/api/v1/sub-accounts/:subAccountCode",
        alias: "deleteApiv1subAccountsSubAccountCode",
        description: `This endpoint deletes a sub account on your integration.`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "subAccountCode",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: DeleteSubAccountSuccessResponse,
        errors: [
            {
                status: 404,
                description: `Not Found`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "get",
        path: "/api/v1/transactions/find-by-settlement-reference",
        alias: "getApiv1transactionsfindBySettlementReference",
        description: `This endpoint returns all transactions that made up a settlement.`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "reference",
                type: "Query",
                schema: z.string(),
            },
            {
                name: "page",
                type: "Query",
                schema: z.string().optional(),
            },
            {
                name: "size",
                type: "Query",
                schema: z.string().optional(),
            },
        ],
        response: GetTransactionsBySettlementReferenceSuccessResponse,
        errors: [
            {
                status: 404,
                description: `Not Found`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "get",
        path: "/api/v1/transactions/search",
        alias: "getApiv1transactionssearch",
        description: `This endpoint returns a list of transactions carried out on your integration.`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "page",
                type: "Query",
                schema: z.string().optional(),
            },
            {
                name: "size",
                type: "Query",
                schema: z.string().optional(),
            },
            {
                name: "paymentReference",
                type: "Query",
                schema: z.string().optional(),
            },
            {
                name: "transactionReference",
                type: "Query",
                schema: z.string().optional(),
            },
            {
                name: "fromAmount",
                type: "Query",
                schema: z.string().optional(),
            },
            {
                name: "toAmount",
                type: "Query",
                schema: z.string().optional(),
            },
            {
                name: "amount",
                type: "Query",
                schema: z.string().optional(),
            },
            {
                name: "customerName",
                type: "Query",
                schema: z.string().optional(),
            },
            {
                name: "customerEmail",
                type: "Query",
                schema: z.string().optional(),
            },
            {
                name: "paymentStatus",
                type: "Query",
                schema: z.string().optional(),
            },
            {
                name: "from",
                type: "Query",
                schema: z.string().optional(),
            },
            {
                name: "to",
                type: "Query",
                schema: z.string().optional(),
            },
        ],
        response: TransactionSearchResponse,
        errors: [
            {
                status: 400,
                description: `Bad request.`,
                schema: ErrorResponse,
            },
            {
                status: 500,
                description: `Internal Server Error.`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "get",
        path: "/api/v1/vas/bills-payment/biller-categories",
        alias: "getApiv1vasbillsPaymentbillerCategories",
        description: `Retrieves a paginated list of all available biller categories, such as transportation, cable TV, and data services.`,
        requestFormat: "json",
        parameters: [
            {
                name: "size",
                type: "Query",
                schema: z.number().int().optional().default(10),
            },
            {
                name: "page",
                type: "Query",
                schema: z.number().int().optional().default(1),
            },
        ],
        response: CategoryResponse,
    },
    {
        method: "get",
        path: "/api/v1/vas/bills-payment/biller-products",
        alias: "getApiv1vasbillsPaymentbillerProducts",
        description: `Retrieves a paginated list of products available for a specific biller by passing their biller code.`,
        requestFormat: "json",
        parameters: [
            {
                name: "page",
                type: "Query",
                schema: z.number().int().optional().default(1),
            },
            {
                name: "size",
                type: "Query",
                schema: z.number().int().optional().default(20),
            },
            {
                name: "biller_code",
                type: "Query",
                schema: z.string().optional(),
            },
        ],
        response: ProductResponse,
    },
    {
        method: "get",
        path: "/api/v1/vas/bills-payment/billers",
        alias: "getApiv1vasbillsPaymentbillers",
        description: `Retrieves a paginated list of all billers. You can optionally filter the list by a specific category code.`,
        requestFormat: "json",
        parameters: [
            {
                name: "size",
                type: "Query",
                schema: z.number().int().optional().default(20),
            },
            {
                name: "page",
                type: "Query",
                schema: z.number().int().optional().default(1),
            },
            {
                name: "category_code",
                type: "Query",
                schema: z.string().optional(),
            },
        ],
        response: BillerResponse,
    },
    {
        method: "get",
        path: "/api/v1/vas/bills-payment/requery",
        alias: "getApiv1vasbillsPaymentrequery",
        description: `Checks and retrieves the final status of a previously initiated transaction using its unique reference.`,
        requestFormat: "json",
        parameters: [
            {
                name: "reference",
                type: "Query",
                schema: z.string(),
            },
        ],
        response: RequeryResponse,
        errors: [
            {
                status: 400,
                description: `Bad Request, the provided reference is invalid or poorly formatted.`,
                schema: ErrorResponse,
            },
            {
                status: 404,
                description: `Transaction not found for the given reference.`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "post",
        path: "/api/v1/vas/bills-payment/validate-customer",
        alias: "postApiv1vasbillsPaymentvalidateCustomer",
        description: `Validates a customer&#x27;s details (like a meter number or phone number) for a specific product before initiating a transaction.

 &gt; [!IMPORTANT]
**NOTE**: Some biller products require a validationReference during the Vend request, while others do not. After performing Customer Validation, check the vendInstruction field in the response. If requireValidationRef is true, you must include the provided validationReference when sending the Vend request. If requireValidationRef is false, omit validationReference from the Vend request. This ensures the correct handling of products that require additional verification (e.g., electricity meter validation) versus products that do not (e.g., airtime or open-price utilities).`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                description: `The product and customer identifiers to validate.`,
                type: "Body",
                schema: ValidateCustomerRequest,
            },
        ],
        response: ValidateCustomerResponse,
        errors: [
            {
                status: 400,
                description: `Bad Request, e.g., invalid customer ID or missing parameters.`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "post",
        path: "/api/v1/vas/bills-payment/vend",
        alias: "postApiv1vasbillsPaymentvend",
        description: `Initiates a payment or vending transaction for a specific product, such as airtime top-up or a utility bill payment.`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                description: `Details of the transaction to be initiated.`,
                type: "Body",
                schema: VendRequest,
            },
        ],
        response: VendResponse,
        errors: [
            {
                status: 400,
                description: `Bad Request, e.g., a required field like &#x27;productCode&#x27; is missing.`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "post",
        path: "/api/v1/vas/bvn-account-match",
        alias: "postApiv1vasbvnAccountMatch",
        description: `This endpoint verifies that the Bank verification number and the account number supplied by a user match the BVN and account number linked to that account.
&gt; [!IMPORTANT] Please note that the this API is only available on **LIVE MODE** at the moment. The sample responses here mirrors the expected response from the API and can be used to setup workflows in your application.`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: BVNAccountMatchRequest,
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: BVNAccountMatchSuccessResponse,
        errors: [
            {
                status: 99,
                description: `Invalid BVN or account provided`,
                schema: BVNAccountMatchFailureResponse,
            },
        ],
    },
    {
        method: "post",
        path: "/api/v1/vas/bvn-details-match",
        alias: "postApiv1vasbvnDetailsMatch",
        description: `This endpoint verifies the BVN information of your customers.
&gt; [!IMPORTANT] Please note that the this API is only available on **LIVE MODE** at the moment. The sample responses here mirrors the expected response from the API and can be used to setup workflows in your application.`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: BVNVerificationRequest,
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: BVNVerificationSuccessResponse,
        errors: [
            {
                status: 99,
                description: `Invalid BVN provided`,
                schema: BVNVerificationFailureResponse,
            },
        ],
    },
    {
        method: "post",
        path: "/api/v1/vas/nin-details",
        alias: "postApiv1vasninDetails",
        description: `This endpoint verifies the supplied NIN of the customer.
&gt; [!IMPORTANT] Please note that the this API is only available on **LIVE MODE** at the moment. The sample responses here mirrors the expected response from the API and can be used to setup workflows in your application.`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: z.object({ nin: z.string() }).passthrough(),
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: NINVerificationSuccessResponse,
        errors: [
            {
                status: 400,
                description: `NIN not found`,
                schema: NINVerificationFailureResponse,
            },
        ],
    },
    {
        method: "post",
        path: "/api/v2/bank-transfer/reserved-accounts",
        alias: "postApiv2bankTransferreservedAccounts",
        description: `This endpoint allows the creation of dedicated virtual accounts for your customers.`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: CreateReservedAccountRequest,
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: CreateReservedAccountResponse,
        errors: [
            {
                status: 400,
                description: `Bad request`,
                schema: ErrorResponse,
            },
            {
                status: 422,
                description: `Unprocessable Entity`,
                schema: ErrorResponse,
            },
            {
                status: 500,
                description: `Internal Server Error`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "get",
        path: "/api/v2/bank-transfer/reserved-accounts/:accountReference",
        alias: "getApiv2bankTransferreservedAccountsAccountReference",
        description: `This endpoint returns details of an account reserved for a customer`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "accountReference",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: GetReservedAccountDetailsSuccessResponse,
        errors: [
            {
                status: 404,
                description: `Reserved account not found`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "post",
        path: "/api/v2/disbursements/batch",
        alias: "postApiv2disbursementsbatch",
        description: `This endpoint allows merchant to initiate Bulk Transfer transactions.
&gt; [!IMPORTANT] Please note that the usage of the Transfer feature is only available for merchants who meet the regulatory requirements for it. Kindly contact sales@monnify.com to get access to this feature.`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: InitiateBulkTransferRequest,
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: InitiateBulkTransferSuccessResponse,
        errors: [
            {
                status: 400,
                description: `Bad request.`,
                schema: ErrorResponse,
            },
            {
                status: 500,
                description: `Internal Server Error.`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "post",
        path: "/api/v2/disbursements/batch/resend-otp",
        alias: "postApiv2disbursementsbatchresendOtp",
        description: `This endpoint generates a new OTP in the event that there were         challenges with the former OTP sent.`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: z.object({ batchReference: z.string() }).passthrough(),
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string().optional(),
            },
        ],
        response: ResendOTPSuccessResponseBulk,
        errors: [
            {
                status: 400,
                description: `Bad request.`,
                schema: ErrorResponse,
            },
            {
                status: 500,
                description: `Internal Server Error.`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "get",
        path: "/api/v2/disbursements/batch/summary",
        alias: "getApiv2disbursementsbatchsummary",
        description: `This endpoint provides the summary of a completed batch transaction.`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "reference",
                type: "Query",
                schema: z.string(),
            },
        ],
        response: BulkBatchSummaryResponse,
        errors: [
            {
                status: 400,
                description: `Bad request.`,
                schema: ErrorResponse,
            },
            {
                status: 404,
                description: `Batch not found.`,
                schema: ErrorResponse,
            },
            {
                status: 500,
                description: `Internal Server Error.`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "post",
        path: "/api/v2/disbursements/batch/validate-otp",
        alias: "postApiv2disbursementsbatchvalidateOtp",
        description: `This endpoint authorizes bulk transfers on your integration.`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: AuthorizeTransferRequest,
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: InitiateBulkTransferSuccessResponse,
        errors: [
            {
                status: 400,
                description: `Bad request.`,
                schema: ErrorResponse,
            },
            {
                status: 500,
                description: `Internal Server Error.`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "get",
        path: "/api/v2/disbursements/bulk/:batchReference/transactions",
        alias: "getApiv2disbursementsbulkBatchReferencetransactions",
        description: `This endpoint verifies the status of a bulk transfer on your integration.`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "batchReference",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: z.object({}).partial().passthrough(),
        errors: [
            {
                status: 400,
                description: `Bad request.`,
                schema: ErrorResponse,
            },
            {
                status: 404,
                description: `Batch not found.`,
                schema: ErrorResponse,
            },
            {
                status: 500,
                description: `Internal Server Error.`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "get",
        path: "/api/v2/disbursements/bulk/transactions",
        alias: "getApiv2disbursementsbulktransactions",
        description: `This endpoint returns the list of all bulk transfers made on your integration.`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "pageSize",
                type: "Query",
                schema: z.number().int().optional(),
            },
            {
                name: "pageNo",
                type: "Query",
                schema: z.number().int().optional(),
            },
        ],
        response: ListBulkTransfersResponse,
    },
    {
        method: "get",
        path: "/api/v2/disbursements/search-transactions",
        alias: "getApiv2disbursementssearchTransactions",
        description: `This endpoint returns the list of all disbursement transactions.`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "sourceAccountNumber",
                type: "Query",
                schema: z.string(),
            },
            {
                name: "pageSize",
                type: "Query",
                schema: z.number().int().optional(),
            },
            {
                name: "pageNo",
                type: "Query",
                schema: z.number().int().optional(),
            },
            {
                name: "startDate",
                type: "Query",
                schema: z.string().optional(),
            },
            {
                name: "endDate",
                type: "Query",
                schema: z.string().optional(),
            },
            {
                name: "amountFrom",
                type: "Query",
                schema: z.string().optional(),
            },
            {
                name: "amountTo",
                type: "Query",
                schema: z.string().optional(),
            },
        ],
        response: SearchDisbursementTransactionsResponse,
        errors: [
            {
                status: 400,
                description: `Bad request.`,
                schema: ErrorResponse,
            },
            {
                status: 500,
                description: `Internal Server Error.`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "post",
        path: "/api/v2/disbursements/single",
        alias: "postApiv2disbursementssingle",
        description: `This endpoint initiats a transfer to specified bank account.
&gt; [!IMPORTANT] Please note that the usage of the Transfer feature is only available for merchants who meet the regulatory requirements for it. Kindly contact sales@monnify.com to get access to this feature.`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: InitiateTransferRequest,
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: z.void(),
        errors: [
            {
                status: 400,
                description: `Bad request.`,
                schema: ErrorResponse,
            },
            {
                status: 500,
                description: `Internal Server Error.`,
                schema: ErrorResponse,
            },
            {
                status: NaN,
                description: `Successful response for merchants with OTP requirement (default)`,
                schema: InitiateTransferOTPResponse,
            },
            {
                status: NaN,
                description: `Successful response for merchants who have disabled their OTP.`,
                schema: InitiateTransferSuccessResponse,
            },
        ],
    },
    {
        method: "post",
        path: "/api/v2/disbursements/single/resend-otp",
        alias: "postApiv2disbursementssingleresendOtp",
        description: `This endpoint generates a new OTP in the event that there were challenges with the former OTP sent.`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: z.object({ reference: z.string() }).passthrough(),
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: ResendOTPSuccessResponse,
        errors: [
            {
                status: 400,
                description: `Bad request.`,
                schema: ErrorResponse,
            },
            {
                status: 500,
                description: `Internal Server Error.`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "get",
        path: "/api/v2/disbursements/single/summary",
        alias: "getApiv2disbursementssinglesummary",
        description: `This endpoint verifies the status of a single transfer on your integration. &lt;/br&gt;
**Transaction States:**
  - PENDING
  - SUCCESS
  - FAILED
  - REVERSED
  - PENDING_AUTHORIZATION
  - OTP_EMAIL_DISPATCH_FAILED`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "reference",
                type: "Query",
                schema: z.string(),
            },
        ],
        response: SingleTransferStatusResponse,
        errors: [
            {
                status: 400,
                description: `Bad request.`,
                schema: ErrorResponse,
            },
            {
                status: 404,
                description: `Transfer not found.`,
                schema: ErrorResponse,
            },
            {
                status: 500,
                description: `Internal Server Error.`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "get",
        path: "/api/v2/disbursements/single/transactions",
        alias: "getApiv2disbursementssingletransactions",
        description: `This endpoint returns the list of all single transfers made on your integration.`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "pageSize",
                type: "Query",
                schema: z.number().int().optional(),
            },
            {
                name: "pageNo",
                type: "Query",
                schema: z.number().int().optional(),
            },
        ],
        response: ListSingleTransfersResponse,
        errors: [
            {
                status: 400,
                description: `Bad request.`,
                schema: ErrorResponse,
            },
            {
                status: 500,
                description: `Internal Server Error.`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "post",
        path: "/api/v2/disbursements/single/validate-otp",
        alias: "postApiv2disbursementssinglevalidateOtp",
        description: `This endpoint authorizes single transfers on your integration.`,
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: AuthorizeTransferRequest,
            },
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
        ],
        response: InitiateTransferSuccessResponse,
        errors: [
            {
                status: 400,
                description: `Bad request.`,
                schema: ErrorResponse,
            },
            {
                status: 500,
                description: `Internal Server Error.`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "get",
        path: "/api/v2/disbursements/wallet-balance",
        alias: "getApiv2disbursementswalletBalance",
        description: `This endpoint returns the available balance in your monnify wallet.`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "accountNumber",
                type: "Query",
                schema: z.string(),
            },
        ],
        response: GetWalletBalanceResponse,
        errors: [
            {
                status: 400,
                description: `Bad request.`,
                schema: ErrorResponse,
            },
            {
                status: 500,
                description: `Internal Server Error`,
                schema: z.void(),
            },
        ],
    },
    {
        method: "get",
        path: "/api/v2/merchant/transactions/query",
        alias: "getApiv2merchanttransactionsquery",
        description: `This endpoint returns the status of a transaction using either the Monnify transaction reference or the merchant&#x27;s payment reference as query parameters.
`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "transactionReference",
                type: "Query",
                schema: z.string().optional(),
            },
            {
                name: "paymentReference",
                type: "Query",
                schema: z.string().optional(),
            },
        ],
        response: TransactionStatusResponse,
        errors: [
            {
                status: 404,
                description: `Transaction not found.`,
                schema: ErrorResponse,
            },
            {
                status: 500,
                description: `Internal Server Error.`,
                schema: ErrorResponse,
            },
        ],
    },
    {
        method: "get",
        path: "/api/v2/transactions/:transactionReference",
        alias: "getApiv2transactionsTransactionReference",
        description: `This endpoint returns the status of a transaction`,
        requestFormat: "json",
        parameters: [
            {
                name: "Authorization",
                type: "Header",
                schema: z.string(),
            },
            {
                name: "transactionReference",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: TransactionStatusResponse,
        errors: [
            {
                status: 404,
                description: `Transaction not found.`,
                schema: ErrorResponse,
            },
            {
                status: 500,
                description: `Internal Server Error.`,
                schema: ErrorResponse,
            },
        ],
    },
]);
export const api = new Zodios(endpoints);
export function createApiClient(baseUrl, options) {
    return new Zodios(baseUrl, endpoints, options);
}
//# sourceMappingURL=generated.js.map