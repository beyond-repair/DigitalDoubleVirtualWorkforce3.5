import { ITrainingMetrics } from './IMLPrediction';

export interface IModelVersion {
    modelId: string;
    version: string;
    createdAt: Date;
    trainingMetrics: ITrainingMetrics;
    deploymentStatus: 'active'|'staged'|'retired';
}

export interface IPredictionAccuracy {
    modelId: string;
    version: string;
    timestamp: Date;
    actualValue: number;
    predictedValue: number;
    error: number;
    confidence: number;
}

export interface IModelPerformance {
    modelId: string;
    version: string;
    windowStart: Date;
    windowEnd: Date;
    averageError: number;
    errorStdDev: number;
    predictionCount: number;
    accuracy: number;
}

export interface IModelTracker {
    getRecentAccuracy(modelId: string, version: string, days?: number): number;
}