export interface AgentConfig {
    id: string;
    name: string;
    maxMemory: number;
    offlineCapable: boolean;
    allowedToolkits: string[];
}

export interface AgentState {
    status: 'idle' | 'running' | 'paused' | 'error';
    currentTask?: Task;
    memory: MemoryUsage;
    lastSync: Date;
}

export interface Task {
    id: string;
    type: string;
    priority: number;
    data: unknown;
    created: Date;
}

export interface MemoryUsage {
    current: number;
    peak: number;
    limit: number;
}
