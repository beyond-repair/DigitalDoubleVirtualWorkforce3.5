export enum TaskPriority {
    LOW = 0,
    MEDIUM = 1,
    HIGH = 2,
    CRITICAL = 3
}

export enum TaskStatus {
    PENDING = 'PENDING',
    ASSIGNED = 'ASSIGNED',
    RUNNING = 'RUNNING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}

export interface ITask {
    id: string;
    priority: TaskPriority;
    status: TaskStatus;
    data: unknown;
    assignedAgent?: string;
    createdAt: Date;
    updatedAt: Date;
}
