export interface ResourceMetrics {
    timestamp: number;
    cpu: {
        usage: number;
        temperature?: number;
    };
    memory: {
        used: number;
        total: number;
        peak: number;
    };
    tasks: {
        completed: number;
        failed: number;
        pending: number;
    };
}

export interface PerformanceMetrics {
    taskLatency: number;
    toolkitLatencies: Map<string, number>;
    errorRates: Map<string, number>;
    throughput: number;
}
