export interface IWorkloadPrediction {
    timestamp: Date;
    expectedTasks: number;
    requiredAgents: number;
    confidence: number;
}

export interface IResourcePrediction {
    timestamp: Date;
    cpuUtilization: number;
    memoryUsage: number;
    predictedBottlenecks: string[];
    confidence: number;
}

export interface ITrainingMetrics {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    trainingDuration: number;
}
