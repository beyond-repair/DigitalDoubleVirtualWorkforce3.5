export interface IResourceMetrics {
  cpuUsage: number;
  memoryUsage: number;
  activeThreads: number;
  timestamp: number;
}

export interface IResourceMonitor {
  startMonitoring(): Promise<void>;
  stopMonitoring(): Promise<void>;
  getCurrentMetrics(): Promise<IResourceMetrics>;
  getAverageMetrics(timespan: number): Promise<IResourceMetrics>;
}
