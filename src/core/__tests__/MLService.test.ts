import { MLService } from '../MLService';
import { AnalyticsService } from '../AnalyticsService';
import { NotificationService } from '../NotificationService';
import { ModelTracker } from '../ModelTracker';

// --- Mock Setup ---
// Create a reusable mock instance for ModelTracker
const mockModelTrackerInstance = {
    registerModel: jest.fn(),
    recordPrediction: jest.fn(),
    getRecentAccuracy: jest.fn().mockReturnValue(0.9), // Default mock accuracy
    // Add mocks for any other ModelTracker methods used by MLService if needed
};

// Mock the ModelTracker module to return our mock instance
jest.mock('../ModelTracker', () => {
    return {
        ModelTracker: jest.fn().mockImplementation(() => {
            return mockModelTrackerInstance;
        })
    };
});

// Mock other dependencies
jest.mock('../AnalyticsService');
jest.mock('../NotificationService');
// --- End Mock Setup ---


describe('MLService', () => {
    let mlService: MLService;
    let mockAnalyticsService: jest.Mocked<AnalyticsService>;
    let mockNotificationService: jest.Mocked<NotificationService>;

    // Constants for tests
    const ACCURACY_THRESHOLD = 0.7; // Match the threshold in MLService
    const ADMIN_USER_ID = 'admin_system'; // Match the admin ID in MLService
    const MODEL_ID = 'workload-predictor';
    const MODEL_VERSION = '1.0.0'; // Match the initial version in MLService

    beforeEach(() => {
        // Clear all mocks before each test to ensure isolation
        jest.clearAllMocks();
        // Explicitly clear specific mock methods if needed (redundant with clearAllMocks but safe)
        mockModelTrackerInstance.getRecentAccuracy.mockClear();
        mockModelTrackerInstance.recordPrediction.mockClear();
        mockModelTrackerInstance.registerModel.mockClear();

        // Create fresh instances of directly passed mocks
        mockAnalyticsService = new AnalyticsService() as jest.Mocked<AnalyticsService>;
        mockNotificationService = new NotificationService() as jest.Mocked<NotificationService>;

        // Instantiate MLService. ModelTracker is automatically mocked due to jest.mock above.
        mlService = new MLService(mockAnalyticsService, mockNotificationService);
    });

    test('should initialize correctly and register model', () => {
        expect(mlService).toBeDefined();
        // Verify ModelTracker constructor was called once
        expect(ModelTracker).toHaveBeenCalledTimes(1);
        // Verify registerModel was called on the mock instance with correct args
        expect(mockModelTrackerInstance.registerModel).toHaveBeenCalledTimes(1);
        expect(mockModelTrackerInstance.registerModel).toHaveBeenCalledWith(
            MODEL_ID,
            MODEL_VERSION,
            expect.any(Object) // Check if some metrics object is passed
        );
    });

    test('should NOT send notification if accuracy is above threshold', async () => {
        // Arrange: Set mock accuracy above threshold
        mockModelTrackerInstance.getRecentAccuracy.mockReturnValue(0.8);

        // Act
        await mlService.recordActualValues(new Date(), 100, 5);

        // Assert: Verify notificationService.createNotification was NOT called
        expect(mockNotificationService.createNotification).not.toHaveBeenCalled();
        // Verify accuracy was checked
        expect(mockModelTrackerInstance.getRecentAccuracy).toHaveBeenCalledWith(MODEL_ID, MODEL_VERSION);
    });

    test('should send notification if accuracy is below threshold', async () => {
        // Arrange: Set mock accuracy below threshold
        const lowAccuracy = 0.6;
        mockModelTrackerInstance.getRecentAccuracy.mockReturnValue(lowAccuracy);

        // Act
        await mlService.recordActualValues(new Date(), 100, 5);

        // Assert: Verify notificationService.createNotification WAS called
        expect(mockNotificationService.createNotification).toHaveBeenCalledTimes(1);
        expect(mockNotificationService.createNotification).toHaveBeenCalledWith(
            expect.stringContaining(`accuracy dropped to ${lowAccuracy.toFixed(2)}`), // Check message
            ADMIN_USER_ID, // Check user ID
            'ml_alert' // Check notification type
        );
         // Verify accuracy was checked
        expect(mockModelTrackerInstance.getRecentAccuracy).toHaveBeenCalledWith(MODEL_ID, MODEL_VERSION);
    });

     test('should send notification on error during recordActualValues', async () => {
        // Arrange: Force an error specifically on the first call to recordPrediction in this test
        const errorMessage = 'Database connection failed';
        mockModelTrackerInstance.recordPrediction.mockImplementationOnce(() => { // Use mockImplementationOnce
            throw new Error(errorMessage);
        });

        // Act
        await mlService.recordActualValues(new Date(), 100, 5);

        // Assert: Verify notificationService.createNotification WAS called for the error
        expect(mockNotificationService.createNotification).toHaveBeenCalledTimes(1);
        expect(mockNotificationService.createNotification).toHaveBeenCalledWith(
            expect.stringContaining(errorMessage), // Check message includes error
            ADMIN_USER_ID, // Check user ID
            'system_error' // Check notification type
        );
        // Ensure accuracy check wasn't reached due to the error
        // getRecentAccuracy IS called once by calculateConfidence before the error
        expect(mockModelTrackerInstance.getRecentAccuracy).toHaveBeenCalledTimes(1);
    });

    // Example test for predictWorkload (add more as needed)
    test('predictWorkload should return predictions', async () => {
        const horizon = 3;
        const predictions = await mlService.predictWorkload(horizon);
        expect(predictions).toHaveLength(horizon);
        predictions.forEach(p => {
            expect(p).toHaveProperty('timestamp');
            expect(p).toHaveProperty('expectedTasks');
            expect(p).toHaveProperty('requiredAgents');
            expect(p).toHaveProperty('confidence');
            expect(p.confidence).toBeGreaterThanOrEqual(0.5); // Based on calculateConfidence logic
        });
    });

});