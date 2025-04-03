import { ModelTracker } from '../ModelTracker';
import { AnalyticsService } from '../AnalyticsService';
import { ITimeSeriesData } from '../../interfaces/IAnalytics';

describe('ModelTracker UADF Integration', () => {
  let tracker: ModelTracker;
  const mockAnalytics = {
    getMetrics: jest.fn(),
    recordMetric: jest.fn()
  };

  beforeEach(() => {
    tracker = new ModelTracker(mockAnalytics as unknown as AnalyticsService);
    jest.clearAllMocks();
  });

  describe('Prediction Accuracy Tracking', () => {
    it('should record predictions with correct parameters', () => {
      tracker.recordPrediction('model1', '1.0', 100, 95, 0.9);
      expect(mockAnalytics.recordMetric).toHaveBeenCalledWith(
        'model.model1.accuracy',
        5
      );
    });
  });

  describe('Accuracy Calculation', () => {
    it('should handle edge cases in weighted calculation', () => {
      // Test with exactly 5 data points
      mockAnalytics.getMetrics.mockReturnValue([
        {timestamp: new Date(Date.now() - 86400000), value: 0.1},
        {timestamp: new Date(Date.now() - 172800000), value: 0.2},
        {timestamp: new Date(Date.now() - 259200000), value: 0.3},
        {timestamp: new Date(Date.now() - 345600000), value: 0.4},
        {timestamp: new Date(Date.now() - 432000000), value: 0.5}
      ]);
      const accuracy = tracker.getRecentAccuracy('model1', '1.0');
      expect(accuracy).toBeGreaterThan(0.5);
      expect(accuracy).toBeLessThan(1);

      // Test with very recent data
      mockAnalytics.getMetrics.mockReturnValue([
        {timestamp: new Date(), value: 0},
        {timestamp: new Date(), value: 0},
        {timestamp: new Date(), value: 0},
        {timestamp: new Date(), value: 0},
        {timestamp: new Date(), value: 0}
      ]);
      expect(tracker.getRecentAccuracy('model1', '1.0')).toBeCloseTo(1);
    });
    it('should handle maximum age data correctly', () => {
      const veryOldData: ITimeSeriesData[] = [
        { timestamp: new Date(Date.now() - 30 * 86400000), value: 0.3 } // 30 days old
      ];
      mockAnalytics.getMetrics.mockReturnValue(veryOldData);
      
      const accuracy = tracker.getRecentAccuracy('model1', '1.0');
      expect(accuracy).toBeGreaterThan(0.5);
      expect(accuracy).toBeLessThan(1);
    });

    it('should handle empty data array', () => {
      mockAnalytics.getMetrics.mockReturnValue([]);
      expect(tracker.getRecentAccuracy('model1', '1.0')).toBe(0.7);
    });
    it('should calculate weighted accuracy from recent data', () => {
      const testData: ITimeSeriesData[] = [
        { timestamp: new Date(Date.now() - 86400000), value: 0.05 }, // 1 day old
        { timestamp: new Date(Date.now() - 172800000), value: 0.1 } // 2 days old
      ];
      mockAnalytics.getMetrics.mockReturnValue(testData);

      const accuracy = tracker.getRecentAccuracy('model1', '1.0');
      expect(accuracy).toBeGreaterThanOrEqual(0.7);
      expect(accuracy).toBeLessThan(1);
    });

    it('should return default accuracy for insufficient data', () => {
      mockAnalytics.getMetrics.mockReturnValue([]);
      expect(tracker.getRecentAccuracy('model1', '1.0')).toBe(0.7);
    });
  });

  describe('Error Handling', () => {
    it('should handle null analytics data', () => {
      mockAnalytics.getMetrics.mockReturnValue(null);
      expect(tracker.getRecentAccuracy('model1', '1.0')).toBe(0.7);
    });
    it('should handle invalid days parameter', () => {
      expect(tracker.getRecentAccuracy('model1', '1.0', -1)).toBe(0.7);
      expect(tracker.getRecentAccuracy('model1', '1.0', 0)).toBe(0.7);
    });

    it('should handle analytics service returning invalid data', () => {
      mockAnalytics.getMetrics.mockReturnValue([
        { timestamp: new Date(), value: -1 }, // Invalid error value
        { timestamp: new Date(), value: 2 }   // Invalid error value
      ]);
      expect(tracker.getRecentAccuracy('model1', '1.0')).toBe(0.7);
    });
    it('should handle analytics service errors gracefully', () => {
      mockAnalytics.getMetrics.mockImplementation(() => {
        throw new Error('Analytics service error');
      });
      expect(tracker.getRecentAccuracy('model1', '1.0')).toBe(0.7);
    });

    it('should handle invalid model versions', () => {
      expect(tracker.getRecentAccuracy('invalid-model', '1.0')).toBe(0.7);
    });
  });

  describe('Model Validation', () => {
    it('should validate model versions before registration', () => {
      expect(() => tracker.registerModel('', '1.0', {
        accuracy: 0.9,
        precision: 0.85,
        recall: 0.8,
        f1Score: 0.82,
        trainingDuration: 100
      })).toThrow('Invalid model ID');
    });

    it('should validate training metrics', () => {
      expect(() => tracker.registerModel('model1', '1.0', {
        accuracy: -1,
        precision: 0.85,
        recall: 0.8,
        f1Score: 0.82,
        trainingDuration: 100
      })).toThrow('Invalid training metrics');
    });
  });

  describe('Model Version Management', () => {
    it('should register new model versions', () => {
      const model = tracker.registerModel('model1', '1.0', {
        accuracy: 0.9,
        precision: 0.85,
        recall: 0.8,
        f1Score: 0.82,
        trainingDuration: 100
      });
      expect(model.deploymentStatus).toBe('staged');
    });

    it('should promote models to active status', () => {
      tracker.registerModel('model1', '1.0', {
        accuracy: 0.9,
        precision: 0.85,
        recall: 0.8,
        f1Score: 0.82,
        trainingDuration: 100
      });
      tracker.promoteModel('model1');
      const model = tracker.getActiveModels().get('model1');
      expect(model?.deploymentStatus).toBe('active');
    });
  });
});