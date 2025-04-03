import { ITask } from './agent.interface';

export interface ITaskQueue {
  enqueue(task: ITask): Promise<void>;
  dequeue(): Promise<ITask | undefined>;
  peek(): Promise<ITask | undefined>;
  size(): Promise<number>;
  isEmpty(): Promise<boolean>;
}

export interface IQueueMetrics {
  totalTasks: number;
  processingTasks: number;
  averageWaitTime: number;
  tasksByPriority: Record<number, number>;
}
