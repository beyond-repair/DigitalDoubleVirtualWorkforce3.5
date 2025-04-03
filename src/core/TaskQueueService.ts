import { ITask, TaskPriority, TaskStatus } from '../interfaces/ITask';
import { IBillingTier } from '../interfaces/IBilling';

export class TaskQueueService {
    private tasks: Map<string, ITask> = new Map();
    private priorityQueues: Map<TaskPriority, ITask[]> = new Map();
    private readonly MAX_QUEUE_SIZE = 10000;
    private readonly QUEUE_CLEANUP_THRESHOLD = 8000;
    private billingTier?: IBillingTier;

    constructor() {
        Object.values(TaskPriority)
            .filter(p => typeof p === 'number')
            .forEach(p => this.priorityQueues.set(p as TaskPriority, []));
    }

    public enqueueTask(task: Omit<ITask, 'id' | 'status' | 'createdAt' | 'updatedAt'>): ITask {
        if (this.billingTier) {
            const currentUsage = this.tasks.size;
            const included = this.billingTier.includedUsage?.taskCount || 0;
            if (currentUsage >= included) {
                throw new Error('Task quota exceeded for current billing tier');
            }
        }
        this.checkQueueSize();
        const newTask: ITask = {
            ...task,
            id: crypto.randomUUID(),
            status: TaskStatus.PENDING,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        this.tasks.set(newTask.id, newTask);
        this.priorityQueues.get(newTask.priority)?.push(newTask);
        return newTask;
    }

    private checkQueueSize(): void {
        if (this.tasks.size > this.MAX_QUEUE_SIZE) {
            const oldTasks = Array.from(this.tasks.values())
                .filter(task => task.status === TaskStatus.COMPLETED || task.status === TaskStatus.FAILED)
                .slice(0, this.tasks.size - this.QUEUE_CLEANUP_THRESHOLD);
            
            for (const task of oldTasks) {
                this.tasks.delete(task.id);
            }
        }
    }

    public getNextTask(): ITask | undefined {
        for (let priority = TaskPriority.CRITICAL; priority >= TaskPriority.LOW; priority--) {
            const queue = this.priorityQueues.get(priority);
            if (queue?.length) {
                return queue.shift();
            }
        }
        return undefined;
    }
}
