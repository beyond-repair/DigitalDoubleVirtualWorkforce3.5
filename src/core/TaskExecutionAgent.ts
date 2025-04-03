import { BaseAgent } from './BaseAgent';
import { Task, AgentConfig } from '../types/agent';

interface TaskResult {
    success: boolean;
    output: unknown;
    error?: Error;
    duration: number;
}

export class TaskExecutionAgent extends BaseAgent {
    private taskHistory: Map<string, TaskResult> = new Map();

    constructor(config: AgentConfig) {
        super({ ...config, allowedToolkits: [...config.allowedToolkits, 'workflow'] });
    }

    protected async processTask(task: Task): Promise<void> {
        const startTime = Date.now();
        
        try {
            const result = await this.executeToolkitAction(
                'workflow',
                task.type,
                task.data
            );

            this.taskHistory.set(task.id, {
                success: result.success,
                output: result.data,
                duration: Date.now() - startTime
            });
        } catch (error) {
            this.taskHistory.set(task.id, {
                success: false,
                output: null,
                error: error as Error,
                duration: Date.now() - startTime
            });
            throw error;
        }
    }

    public getTaskResult(taskId: string): TaskResult | undefined {
        return this.taskHistory.get(taskId);
    }

    public clearTaskHistory(): void {
        this.taskHistory.clear();
    }
}
