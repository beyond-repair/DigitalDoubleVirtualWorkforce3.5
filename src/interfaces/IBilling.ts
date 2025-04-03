export interface IUsageMetrics {
    computeMinutes: number;
    taskCount: number;
    storageBytes: number;
    apiCalls: number;
}

export interface IBillingTier {
    name: string;
    ratePerComputeMinute: number;
    ratePerTask: number;
    ratePerGBStorage: number;
    ratePerThousandAPICalls: number;
    includedUsage: Partial<IUsageMetrics>;
}

export interface ICustomerBilling {
    customerId: string;
    tier: IBillingTier;
    currentUsage: IUsageMetrics;
    billingCycle: {
        startDate: Date;
        endDate: Date;
    };
}
