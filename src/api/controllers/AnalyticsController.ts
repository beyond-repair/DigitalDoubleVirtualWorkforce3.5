import { Router, Request, Response } from 'express';
import { AnalyticsService } from '../../core/AnalyticsService';
import { validateApiKey } from '../middleware/auth';

export class AnalyticsController {
    private router = Router();
    private analyticsService: AnalyticsService;

    constructor(analyticsService: AnalyticsService) {
        this.analyticsService = analyticsService;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.use(validateApiKey);
        this.router.get('/metrics', this.getMetrics.bind(this));
        this.router.get('/performance', this.getPerformance.bind(this));
    }

    private async getPerformance(req: Request, res: Response): Promise<void> {
        try {
            const performanceData = await this.analyticsService.getPerformanceData();
            res.json(performanceData);
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve performance data' });
        }
    }

    private async getMetrics(req: Request, res: Response): Promise<void> {
        try {
            const metrics = this.analyticsService.getMetricsSummary();
            res.json(metrics);
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve metrics' });
        }
    }
}
