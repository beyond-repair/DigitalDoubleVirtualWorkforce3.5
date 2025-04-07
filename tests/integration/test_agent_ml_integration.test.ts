import { TaskManager } from '../../src/modules/exampleModule';
import { MLService } from '../../src/core/ml/MLService';
import { AnalyticsService } from '../../src/core/AnalyticsService';

describe('Agent-MLService Integration', () => {
  let taskManager: TaskManager;
  let mlService: MLService;
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    taskManager = new TaskManager();
    analyticsService = new AnalyticsService();
    mlService = new MLService(analyticsService);
  });

  it('should create tasks based on ML workload prediction', async () => {
    const predictions = await mlService.predictWorkload(3);
    predictions.forEach(pred => {
      for (let i = 0; i < pred.expectedTasks; i++) {
        taskManager.createTask({ source: 'ml', timestamp: pred.timestamp });
      }
    });
    expect(taskManager.getTasks().length).toBeGreaterThan(0);
  });

  it('should update ML model with actual task execution data', async () => {
    const timestamp = new Date();
    taskManager.createTask({ foo: 'bar' });
    const success = await mlService.recordActualValues(timestamp, 10, 2);
    expect(success).toBe(true);
  });
});