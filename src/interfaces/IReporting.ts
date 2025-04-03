export enum ReportType {
    SYSTEM_HEALTH = 'SYSTEM_HEALTH',
    BILLING_SUMMARY = 'BILLING_SUMMARY',
    PERFORMANCE_METRICS = 'PERFORMANCE_METRICS',
    AGENT_ACTIVITY = 'AGENT_ACTIVITY'
}

export interface IReportConfig {
    type: ReportType;
    startDate: Date;
    endDate: Date;
    format: 'PDF' | 'CSV' | 'JSON';
    filters?: Record<string, unknown>;
}

export interface IReport {
    id: string;
    config: IReportConfig;
    generatedAt: Date;
    data: unknown;
    url?: string;
}
