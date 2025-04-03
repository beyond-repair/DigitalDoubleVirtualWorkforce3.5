import { ICustomerBilling, IBillingTier, IUsageMetrics } from '../interfaces/IBilling';

export class BillingService {
    private customerBilling: Map<string, ICustomerBilling> = new Map();
    private readonly CYCLE_LENGTH_DAYS = 30;

    public initializeCustomer(customerId: string, tier: IBillingTier): ICustomerBilling {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + this.CYCLE_LENGTH_DAYS);

        const billing: ICustomerBilling = {
            customerId,
            tier,
            currentUsage: {
                computeMinutes: 0,
                taskCount: 0,
                storageBytes: 0,
                apiCalls: 0
            },
            billingCycle: { startDate, endDate }
        };

        this.customerBilling.set(customerId, billing);
        return billing;
    }

    public trackUsage(customerId: string, usage: Partial<IUsageMetrics>): void {
        const billing = this.customerBilling.get(customerId);
        if (!billing) throw new Error('Customer not found');

        Object.entries(usage).forEach(([key, value]) => {
            if (typeof value === 'number') {
                billing.currentUsage[key as keyof IUsageMetrics] += value;
            }
        });
    }
}
