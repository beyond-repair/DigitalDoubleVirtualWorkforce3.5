import { IReport, IReportConfig, ReportType } from '../interfaces/IReporting';
import { AnalyticsService } from './AnalyticsService';
import { BillingService } from './BillingService';

export class ReportingService {
    constructor(
        private analyticsService: AnalyticsService,
        private billingService: BillingService
    ) {}

    public async generateReport(config: IReportConfig): Promise<IReport> {
        const report: IReport = {
            id: crypto.randomUUID(),
            config,
            generatedAt: new Date(),
            data: await this.collectReportData(config)
        };

        return report;
    }

    private async collectReportData(config: IReportConfig): Promise<unknown> {
        switch (config.type) {
            case ReportType.SYSTEM_HEALTH:
                return this.analyticsService.getMetricsSummary();
            // Add other report types
            default:
                throw new Error(`Unsupported report type: ${config.type}`);
        }
    }
}
