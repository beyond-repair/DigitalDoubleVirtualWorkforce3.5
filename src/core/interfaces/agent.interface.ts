export interface IAgent {
  id: string;
  status: AgentStatus;
  capabilities: string[];
  initialize(): Promise<void>;
  execute(task: ITask): Promise<ITaskResult>;
  shutdown(): Promise<void>;
}

export enum AgentStatus {
  IDLE = 'IDLE',
  BUSY = 'BUSY',
  ERROR = 'ERROR',
  OFFLINE = 'OFFLINE'
}

export interface ITask {
  id: string;
  type: string;
  payload: unknown;
  priority: number;
}

export interface ITaskResult {
  taskId: string;
  success: boolean;
  result?: unknown;
  error?: string;
}
