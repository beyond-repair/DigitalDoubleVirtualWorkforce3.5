import { IWorkloadPrediction } from '../interfaces/IMLPrediction';
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
    constructor(
        analyticsService: AnalyticsService,
        private notificationService: NotificationService // Added NotificationService dependency
    ) {
        this.modelTracker = new ModelTracker(analyticsService);
        this.modelTracker.registerModel(
            'workload-predictor',
            this.currentModelVersion,
            { accuracy: 0, precision: 0, recall: 0, f1Score: 0, trainingDuration: 0 }
        );
        console.log("MLService initialized."); // Added log
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
    }

    private async predictTaskCount(timestamp: Date): Promise<number> {
        // Placeholder: Implement actual prediction logic
        // console.log(`Predicting task count for ${timestamp.toISOString()}`);
        return 100; // Example value
    }

    private async predictAgentCount(timestamp: Date): Promise<number> {
        // Placeholder: Implement actual prediction logic
        // console.log(`Predicting agent count for ${timestamp.toISOString()}`);
        return 5; // Example value
    }

    // --- Input Processing and Error Handling ---
    public async processResult(result: ProcessResult): Promise<ProcessResult> {
        // Basic pass-through or add more logic
        const { status, message, data } = result;
        return { status, message, data };
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
