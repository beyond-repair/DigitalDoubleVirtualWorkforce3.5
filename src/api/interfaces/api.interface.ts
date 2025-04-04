import { IResourceMetrics } from '../../core/interfaces/monitor.interface';

// Define Logger interface
interface Logger {
  error(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
}

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
  apiKey: string;
  logger: Logger;
}
