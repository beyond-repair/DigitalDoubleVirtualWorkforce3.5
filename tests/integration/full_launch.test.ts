import { SelfHealingManager, ErrorEvent, SelfHealingModule, CorrectionResult } from '../../src/core/SelfHealingManager';
import { MLService } from '../../src/core/MLService';
import { AnalyticsService } from '../../src/core/AnalyticsService';
import { NotificationService } from '../../src/core/NotificationService';

class DummyModule implements SelfHealingModule {
  async analyze(event: ErrorEvent): Promise<boolean> {
    return true;
  }
  async correct(event: ErrorEvent): Promise<CorrectionResult> {
    return { success: true, details: 'Dummy fix' };
  }
  async validate(event: ErrorEvent): Promise<boolean> {
    return true;
  }
}

describe('Full System Launch Integration', () => {
  let manager: SelfHealingManager;
  let mlService: MLService;

  beforeEach(() => {
    manager = new SelfHealingManager();
    manager.registerModule(new DummyModule());

    const analyticsService = {
      getMetrics: jest.fn().mockReturnValue([{ value: 10 }])
    } as unknown as AnalyticsService;

    const notificationService = {
      createNotification: jest.fn()
    } as unknown as NotificationService;

    mlService = new MLService(analyticsService, notificationService);
  });

  it('should handle predictive faults and trigger self-healing', async () => {
    const predictedFaults = await mlService.predictFaults();
    for (const fault of predictedFaults) {
      const event: ErrorEvent = {
        source: 'PredictiveModule',
        timestamp: fault.timestamp.getTime(),
        errorType: fault.faultType,
        message: fault.details || ''
      };
      manager.emitErrorEvent(event);
    }
  });

  it('should handle runtime error events and trigger self-healing', async () => {
    const event: ErrorEvent = {
      source: 'RuntimeAgent',
      timestamp: Date.now(),
      errorType: 'RuntimeError',
      message: 'Simulated runtime failure'
    };
    manager.emitErrorEvent(event);
  });
});