import { Router, Request, Response } from 'express';
import { BillingService } from '../../core/BillingService';
import { validateApiKey } from '../middleware/auth';
/* import { createPayment } from '../../modules/payment/paypalService'; */

export class BillingController {
    private router = Router();
    private billingService: BillingService;

    constructor(billingService: BillingService) {
        this.billingService = billingService;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.use(validateApiKey);
        this.router.post('/subscribe', this.subscribe.bind(this));
        this.router.get('/usage/:customerId', this.getUsage.bind(this));
    }

    private async getUsage(req: Request, res: Response): Promise<void> {
        const { customerId } = req.params;
        try {
            const usageData = await this.billingService.getUsage(customerId); // Assuming this method exists in BillingService
            res.json(usageData);
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve usage data' });
        }
    }

    private async subscribe(req: Request, res: Response): Promise<void> {
        try {
            const { customerId, tier } = req.body;
            const billing = this.billingService.initializeCustomer(customerId, tier);
            res.status(201).json(billing);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create subscription' });
        }
    }
}
