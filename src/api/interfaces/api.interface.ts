import { ITask, ITaskResult } from '../../core/interfaces/agent.interface';
import { IResourceMetrics } from '../../core/interfaces/monitor.interface';

export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

export interface IAgentStatus {
  id: string;
  status: string;
  metrics: IResourceMetrics;
  taskCount: number;
}

export interface IApiConfig {
  port: number;
  corsOrigins: string[];
  rateLimitRequests: number;
  rateLimitWindow: number;
}
