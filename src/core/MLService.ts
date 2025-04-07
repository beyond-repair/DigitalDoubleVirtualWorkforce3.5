import { IWorkloadPrediction, IPredictedFault } from '../interfaces/IMLPrediction';
import { ITimeSeriesData } from '../interfaces/IAnalytics';
import { ModelTracker } from './ModelTracker';
import { AnalyticsService } from './AnalyticsService';
import { ProcessResult, ProcessedData } from '../interfaces/processing.interface';
import { NotificationService } from './NotificationService'; // Import NotificationService

/**
 * Machine Learning Service with UADF (Universal Autonomous Development Framework) integration
 */
export class MLService {
    private trainingData: Map<string, ITimeSeriesData[]> = new Map();
    private readonly MIN_TRAINING_POINTS = 1000;
    private modelTracker: ModelTracker;
    private currentModelVersion = '1.0.0';
    private readonly ACCURACY_THRESHOLD = 0.7; // Threshold for triggering notifications
    private readonly SYSTEM_ADMIN_USER_ID = 'admin_system'; // Placeholder for user ID to notify

    // Inject NotificationService
    /**
     * Constructs the MLService.
     * @param analyticsService Provides access to historical metrics for predictions
     * @param notificationService Service to send alerts and notifications
     */
    constructor(
        private analyticsService: AnalyticsService,
        private notificationService: NotificationService
    ) {
        this.modelTracker = new ModelTracker(analyticsService);
        this.modelTracker.registerModel(
            'workload-predictor',
            this.currentModelVersion,
            { accuracy: 0, precision: 0, recall: 0, f1Score: 0, trainingDuration: 0 }
        );
        console.log("MLService initialized.");
    }

    public async predictWorkload(horizon: number): Promise<IWorkloadPrediction[]> {
        const predictions: IWorkloadPrediction[] = [];
        const now = new Date();

        for (let i = 1; i <= horizon; i++) {
            const timestamp = new Date(now.getTime() + i * 3600000);
            const predictedTasks = await this.predictTaskCount(timestamp);
            const requiredAgents = await this.predictAgentCount(timestamp);
            const confidence = this.calculateConfidence();

            predictions.push({
                timestamp: timestamp,
                expectedTasks: predictedTasks,
                requiredAgents: requiredAgents,
                confidence: confidence
            });
        }

        return predictions;
}

    private calculateConfidence(): number {
        const recentAccuracy = this.modelTracker.getRecentAccuracy(
            'workload-predictor',
            this.currentModelVersion
        );
        const confidence = Math.max(0.5, recentAccuracy * 0.9);
        return confidence;
    }


/**
 * Predicts potential system faults based on historical anomaly data.
 * Initially returns dummy data; extend with real ML logic.
 */
public async predictFaults(): Promise<import('../interfaces/IMLPrediction').IPredictedFault[]> {
    const now = new Date();
    return [
        {
            timestamp: new Date(now.getTime() + 60 * 60 * 1000), // 1 hour ahead
            faultType: 'HighErrorRate',
            confidence: 0.8,
            details: 'Spike in error rate detected in recent analytics.'
        },
        {
            timestamp: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours ahead
            faultType: 'ResourceExhaustion',
            confidence: 0.7,
            details: 'Predicted CPU/memory bottleneck based on trend.'
        }
    ];
    }
    /**

    }

    private calculateConfidence(): number {
        const recentAccuracy = this.modelTracker.getRecentAccuracy(
            'workload-predictor',
            this.currentModelVersion
        );
        // Confidence calculation based on recent accuracy
        const confidence = Math.max(0.5, recentAccuracy * 0.9); // Example calculation
        return confidence;
    }

    public async recordActualValues(timestamp: Date, actualTasks: number, actualAgents: number): Promise<boolean> {
        try {
            const predictedTasks = await this.predictTaskCount(timestamp);
            const predictedAgents = await this.predictAgentCount(timestamp);
            const confidence = this.calculateConfidence(); // Use calculated confidence

            // Record task count prediction accuracy
            this.modelTracker.recordPrediction(
                'workload-predictor',
                this.currentModelVersion,
                actualTasks,
                predictedTasks,
                confidence // Use calculated confidence here too
            );

            // Record agent count prediction accuracy (example, might need separate tracking)
            this.modelTracker.recordPrediction(
                'workload-predictor-agents', // Potentially separate model/tracking ID
                this.currentModelVersion,
                actualAgents,
                predictedAgents,
                confidence // Use calculated confidence
            );

             // Check accuracy *after* successful recording
            const currentAccuracy = this.modelTracker.getRecentAccuracy('workload-predictor', this.currentModelVersion);
            if (currentAccuracy < this.ACCURACY_THRESHOLD) {
                const message = `ML Model 'workload-predictor' (${this.currentModelVersion}) accuracy dropped to ${currentAccuracy.toFixed(2)}, below threshold ${this.ACCURACY_THRESHOLD}.`;
                console.log(`Accuracy below threshold. Attempting to notify admin: ${this.SYSTEM_ADMIN_USER_ID}`);
                this.notificationService.createNotification(
                    message,
                    this.SYSTEM_ADMIN_USER_ID, // Notify system admin
                    'ml_alert' // Notification type
                );
            }

            return true; // Return true only if all try block operations succeed
        } catch (error) {
            console.error("Error recording actual values:", error); // Log the error
            // Optionally notify admin about the error itself
            this.notificationService.createNotification(
                `Error recording ML prediction values: ${(error as Error).message}`,
                this.SYSTEM_ADMIN_USER_ID,
                'system_error'
            );
            return false;
        }
    
    private calculateConfidence(): number {
        const recentAccuracy = this.modelTracker.getRecentAccuracy(
            'workload-predictor',
            this.currentModelVersion
        );
        // Confidence calculation based on recent accuracy
        const confidence = Math.max(0.5, recentAccuracy * 0.9); // Example calculation
        return confidence;
    }

    }

    /**
     * Predicts the number of tasks at a given timestamp.
     * Uses a simple moving average of recent task counts from AnalyticsService (last 24 hours).
     * Falls back to a default if no data is available or on error.
     * @param timestamp The future time to predict for
     * @returns Predicted task count (integer)
     */
    private async predictTaskCount(timestamp: Date): Promise<number> {
        try {
            const recentData = this.analyticsService.getMetrics('task_count', 1); // last 1 day
            if (!recentData || recentData.length === 0) {
                return 100; // fallback default
            }
            const sum = recentData.reduce((acc, point) => acc + point.value, 0);
            const avg = sum / recentData.length;
            return Math.round(avg);
        } catch (error) {
            console.error("Error in predictTaskCount:", error);
            return 100; // fallback on error
        }
    }

    /**
     * Predicts the number of agents required at a given timestamp.
     * Uses a simple moving average of recent agent counts from AnalyticsService (last 24 hours).
     * Falls back to a default if no data is available or on error.
     * @param timestamp The future time to predict for
     * @returns Predicted agent count (integer)
     */
    private async predictAgentCount(timestamp: Date): Promise<number> {
        try {
            const recentData = this.analyticsService.getMetrics('agent_count', 1); // last 1 day
            if (!recentData || recentData.length === 0) {
                return 5; // fallback default
            }
            const sum = recentData.reduce((acc, point) => acc + point.value, 0);
            const avg = sum / recentData.length;
            return Math.round(avg);
        } catch (error) {
            console.error("Error in predictAgentCount:", error);
            return 5; // fallback on error
        }
    }

    // --- Input Processing and Error Handling ---
    public async processResult(result: ProcessResult): Promise<ProcessResult> {
        // Basic pass-through or add more logic
        const { status, message, data } = result;
        return { status, message, data };
    }
/**
 * Trains or updates the ML model using accumulated data.
 * Currently a stub; extend with actual ML training logic.
 * @param force If true, forces retraining regardless of conditions
 * @returns True if training was successful (stubbed)
 */
public async trainOrUpdateModel(force = false): Promise<boolean> {
    try {
        console.log(`Training ML model (force=${force})...`);
        // TODO: Implement actual training logic here
        return true;
    } catch (error) {
        console.error('Error during model training:', error);
        return false;
    }
}

    public async handleError(error: Error): Promise<ProcessResult> {
        console.error("MLService encountered an error:", error); // Log error
        return {
            status: 'error',
            message: `ML Service Error: ${error.message}`
        };
    }

    private async processInput(input: unknown): Promise<ProcessedData> {
        // Placeholder: Implement input processing logic
        console.log("Processing input data...");
        // Example validation: Check if input is not null/undefined
        if (input === null || input === undefined) {
            throw new Error("Input data cannot be null or undefined.");
        }
        // Add more complex validation/transformation as needed
        return {
            status: 'success',
            message: 'Input processing complete',
            // data: processedInput // Example: return processed data
        };
    }

    public async processData(input: unknown): Promise<ProcessedData> {
        try {
            return await this.processInput(input);
        } catch (error) {
            const errorResult = await this.handleError(error as Error);
            return {
                status: errorResult.status,
                message: errorResult.message
                // No data field in case of error
            };
        }
    }
}
