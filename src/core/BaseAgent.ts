import { AgentConfig, AgentState, Task } from '../types/agent';
import { Toolkit, ToolkitResponse } from '../types/toolkit';
import { ResourceMetrics, PerformanceMetrics } from '../types/metrics';
import { PolicyManager } from './PolicyManager';

export class BaseAgent {
    private readonly config: AgentConfig;
    private state: AgentState;
    private readonly toolkits: Map<string, Toolkit> = new Map();
    private metrics: ResourceMetrics;
    private performanceStats: PerformanceMetrics;
    private readonly policyManager: PolicyManager;

    constructor(config: AgentConfig) {
        this.config = config;
        this.state = {
            status: 'idle',
            memory: {
                current: 0,
                peak: 0,
                limit: config.maxMemory
            },
            lastSync: new Date()
        };
        this.metrics = {
            timestamp: Date.now(),
            cpu: { usage: 0 },
            memory: { used: 0, total: config.maxMemory, peak: 0 },
            tasks: { completed: 0, failed: 0, pending: 0 }
        };
        this.performanceStats = {
            taskLatency: 0,
            toolkitLatencies: new Map(),
            errorRates: new Map(),
            throughput: 0
        };
        this.policyManager = new PolicyManager();
    }

    async initialize(): Promise<void> {
        try {
            await this.validateConfig();
            this.state.status = 'idle';
        } catch (error) {
            this.state.status = 'error';
            throw error;
        }
    }

    async executeTask(task: Task): Promise<void> {
        if (this.state.status === 'error') {
            throw new Error('Agent in error state');
        }

        const policyValidation = await this.policyManager.validateTask(task);
        if (!policyValidation.allowed) {
            throw new Error(policyValidation.reason);
        }

        this.state.status = 'running';
        this.state.currentTask = task;

        try {
            await this.processTask(task);
            this.state.status = 'idle';
        } catch (error) {
            this.state.status = 'error';
            throw error;
        }
    }

    async registerToolkit(toolkit: Toolkit): Promise<void> {
        if (!this.config.allowedToolkits.includes(toolkit.config.name)) {
            throw new Error(`Toolkit ${toolkit.config.name} not allowed`);
        }

        await toolkit.initialize();
        this.toolkits.set(toolkit.config.name, toolkit);
    }

    protected async executeToolkitAction<T>(
        toolkitName: string,
        action: string,
        params: unknown
    ): Promise<ToolkitResponse<T>> {
        const startTime = Date.now();
        try {
            const result = await this.toolkits.get(toolkitName)?.execute<T>(action, params);
            this.updateToolkitMetrics(toolkitName, Date.now() - startTime, true);
            return result!;
        } catch (error) {
            this.updateToolkitMetrics(toolkitName, Date.now() - startTime, false);
            throw error;
        }
    }

    private async validateConfig(): Promise<void> {
        if (!this.config.id || !this.config.name) {
            throw new Error('Invalid agent configuration');
        }
    }

    private async processTask(task: Task): Promise<void> {
        // Template method to be implemented by specific agent types
        throw new Error('Not implemented');
    }

    public getState(): AgentState {
        return { ...this.state };
    }

    protected async updateMetrics(): Promise<void> {
        this.metrics.timestamp = Date.now();
        this.metrics.memory.used = process.memoryUsage().heapUsed;
        this.metrics.memory.peak = Math.max(
            this.metrics.memory.peak,
            this.metrics.memory.used
        );
    }

    public getMetrics(): ResourceMetrics {
        return { ...this.metrics };
    }

    public getPerformanceStats(): PerformanceMetrics {
        return {
            ...this.performanceStats,
            toolkitLatencies: new Map(this.performanceStats.toolkitLatencies),
            errorRates: new Map(this.performanceStats.errorRates)
        };
    }

    private updateToolkitMetrics(toolkit: string, duration: number, success: boolean): void {
        const currentErrors = this.performanceStats.errorRates.get(toolkit) || 0;
        this.performanceStats.toolkitLatencies.set(
            toolkit,
            (this.performanceStats.toolkitLatencies.get(toolkit) || 0) + duration
        );
        if (!success) {
            this.performanceStats.errorRates.set(toolkit, currentErrors + 1);
        }
    }

    public addPolicy(policy: Policy): void {
        this.policyManager.addPolicy(policy);
    }
}
