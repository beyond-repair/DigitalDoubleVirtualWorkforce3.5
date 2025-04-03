import { Router, Request, Response } from 'express';
import { ReportingService } from '../../core/ReportingService';
import { validateApiKey } from '../middleware/auth';

export class ReportingController {
    private router = Router();
    private reportingService: ReportingService;

    constructor(reportingService: ReportingService) {
        this.reportingService = reportingService;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.use(validateApiKey);
        this.router.post('/generate', this.generateReport.bind(this));
    }

    private async generateReport(req: Request, res: Response): Promise<void> {
        try {
            const report = await this.reportingService.generateReport(req.body);
            res.status(201).json(report);
        } catch (error) {
            res.status(500).json({ error: 'Failed to generate report' });
        }
    }
}
