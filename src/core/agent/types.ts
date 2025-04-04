export interface AgentConfig {
  name: string;
  version: string;
  capabilities: string[];
  initialState?: Record<string, unknown>;
  maxConcurrentTasks?: number;
  timeout?: number;
}