export interface ISystemMetrics {
    totalAgents: number;
    activeAgents: number;
    queuedTasks: number;
    processingTasks: number;
    averageTaskTime: number;
    systemLoad: number;
}

export interface ITimeSeriesData {
    timestamp: Date;
    value: number;
}

export interface IPerformanceMetrics {
    cpuUtilization: ITimeSeriesData[];
    memoryUsage: ITimeSeriesData[];
    taskThroughput: ITimeSeriesData[];
    errorRate: ITimeSeriesData[];
}
