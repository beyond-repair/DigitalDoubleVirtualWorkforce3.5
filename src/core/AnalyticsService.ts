import { ISystemMetrics, ITimeSeriesData } from '../interfaces/IAnalytics';

export class AnalyticsService {
    private metrics: Map<string, ITimeSeriesData[]> = new Map();
    private readonly RETENTION_DAYS = 30;

    public recordMetric(name: string, value: number): void {
        const data = this.metrics.get(name) || [];
        data.push({ timestamp: new Date(), value });
        this.metrics.set(name, this.cleanupOldData(data));
    }

    private cleanupOldData(data: ITimeSeriesData[]): ITimeSeriesData[] {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - this.RETENTION_DAYS);
        return data.filter(item => item.timestamp >= cutoff);
    }

    public getMetrics(name: string, days = 7): ITimeSeriesData[] {
        const data = this.metrics.get(name);
        if (!data) return [];

        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        
        return data.filter(item => item.timestamp >= cutoff);
    }

    public getMetricsSummary(): ISystemMetrics {
        return {
            totalAgents: 0,
            activeAgents: 0,
            queuedTasks: 0,
            processingTasks: 0,
            averageTaskTime: 0,
            systemLoad: 0
        };
    }

    public async getPerformanceData(): Promise<{ performanceMetrics: { accuracy: number; responseTime: number; } }> {
        return {
            performanceMetrics: {
                accuracy: 95,
                responseTime: 200,
            }
        };
    }
}
