export enum AgentStatus {
    IDLE = 'IDLE',
    BUSY = 'BUSY',
    OFFLINE = 'OFFLINE',
    ERROR = 'ERROR'
}

export interface IAgentMetrics {
    cpuUsage: number;
    memoryUsage: number;
    activeThreads: number;
    taskCount: number;
}

export interface IAgent {
    id: string;
    status: AgentStatus;
    metrics: IAgentMetrics;
    lastHeartbeat: Date;
    currentTask?: string;
}
