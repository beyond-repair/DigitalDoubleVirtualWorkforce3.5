import { IResourceMonitor, IResourceMetrics } from '../interfaces/monitor.interface';

export class ResourceMonitorService implements IResourceMonitor {
  private metrics: IResourceMetrics[] = [];
  private monitoringInterval?: NodeJS.Timer;
  private readonly INTERVAL_MS = 1000;
  private readonly MAX_HISTORY = 3600; // 1 hour of history

  async startMonitoring(): Promise<void> {
    this.monitoringInterval = setInterval(async () => {
      const metric = await this.collectMetrics();
      this.metrics.push(metric);
      if (this.metrics.length > this.MAX_HISTORY) {
        this.metrics.shift();
      }
    }, this.INTERVAL_MS);
  }

  async stopMonitoring(): Promise<void> {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
  }

  async getCurrentMetrics(): Promise<IResourceMetrics> {
    return this.collectMetrics();
  }

  async getAverageMetrics(timespan: number): Promise<IResourceMetrics> {
    const now = Date.now();
    const relevantMetrics = this.metrics.filter(m => now - m.timestamp <= timespan);
    
    return {
      cpuUsage: this.average(relevantMetrics.map(m => m.cpuUsage)),
      memoryUsage: this.average(relevantMetrics.map(m => m.memoryUsage)),
      activeThreads: Math.round(this.average(relevantMetrics.map(m => m.activeThreads))),
      timestamp: now
    };
  }

  private async collectMetrics(): Promise<IResourceMetrics> {
    return {
      cpuUsage: process.cpuUsage().user / 1000000,
      memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024,
      activeThreads: process.pid ? 1 : 0,
      timestamp: Date.now()
    };
  }

  private average(numbers: number[]): number {
    return numbers.length ? numbers.reduce((a, b) => a + b) / numbers.length : 0;
  }
}
