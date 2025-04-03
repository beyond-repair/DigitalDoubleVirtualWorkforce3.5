import { TaskQueueService } from '../services/queue.service';
import { ITask } from '../interfaces/agent.interface';

describe('TaskQueueService', () => {
  let queue: TaskQueueService;

  beforeEach(() => {
    queue = new TaskQueueService();
  });

  test('should enqueue tasks with priority order', async () => {
    const task1: ITask = { id: '1', type: 'test', payload: {}, priority: 1 };
    const task2: ITask = { id: '2', type: 'test', payload: {}, priority: 2 };
    
    await queue.enqueue(task1);
    await queue.enqueue(task2);
    
    const nextTask = await queue.peek();
    expect(nextTask?.id).toBe('2');
  });

  test('should maintain correct metrics', async () => {
    const task: ITask = { id: '1', type: 'test', payload: {}, priority: 1 };
    await queue.enqueue(task);
    
    const metrics = queue.getMetrics();
    expect(metrics.totalTasks).toBe(1);
    expect(metrics.tasksByPriority[1]).toBe(1);
  });
});
