import { MLService } from '../../src/core/MLService';
import { AnalyticsService } from '../../src/core/AnalyticsService';
import { NotificationService } from '../../src/core/NotificationService';

describe('MLService', () => {
  let mlService: MLService;

  beforeEach(() => {
    const analyticsService = {
      getMetrics: jest.fn().mockReturnValue([{ value: 10 }])
    } as unknown as AnalyticsService;

    const notificationService = {
      createNotification: jest.fn()
    } as unknown as NotificationService;

    mlService = new MLService(analyticsService, notificationService);
  });

  it('should return dummy predicted faults', async () => {
    const faults = await mlService.predictFaults();
    expect(faults.length).toBeGreaterThan(0);
    expect(faults[0]).toHaveProperty('faultType');
    expect(faults[0]).toHaveProperty('confidence');
  });
});