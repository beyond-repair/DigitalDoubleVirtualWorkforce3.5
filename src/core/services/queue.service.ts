import { ITask } from '../interfaces/agent.interface';
import { ITaskQueue, IQueueMetrics } from '../interfaces/queue.interface';

export class TaskQueueService implements ITaskQueue {
  private queue: ITask[] = [];
  private metrics: IQueueMetrics = {
    totalTasks: 0,
    processingTasks: 0,
    averageWaitTime: 0,
    tasksByPriority: {}
  };

  async enqueue(task: ITask): Promise<void> {
    const insertIndex = this.queue.findIndex(t => t.priority < task.priority);
    if (insertIndex === -1) {
      this.queue.push(task);
    } else {
      this.queue.splice(insertIndex, 0, task);
    }
    
    this.updateMetrics(task);
  }

  async dequeue(): Promise<ITask | undefined> {
    const task = this.queue.shift();
    if (task) {
      this.metrics.processingTasks++;
      this.metrics.totalTasks--;
    }
    return task;
  }

  async peek(): Promise<ITask | undefined> {
    return this.queue[0];
  }

  async size(): Promise<number> {
    return this.queue.length;
  }

  async isEmpty(): Promise<boolean> {
    return this.queue.length === 0;
  }

  private updateMetrics(task: ITask): void {
    this.metrics.totalTasks++;
    this.metrics.tasksByPriority[task.priority] = 
      (this.metrics.tasksByPriority[task.priority] || 0) + 1;
  }

  getMetrics(): IQueueMetrics {
    return { ...this.metrics };
  }
}
