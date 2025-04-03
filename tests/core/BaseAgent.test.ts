import { BaseAgent } from '../../src/core/BaseAgent';
import { AgentConfig } from '../../src/types/agent';
import { Toolkit, ToolkitConfig } from '../../src/types/toolkit';

class MockToolkit implements Toolkit {
    config: ToolkitConfig = {
        name: 'core',
        version: '1.0.0',
        timeout: 5000,
        retryAttempts: 3
    };

    async initialize(): Promise<void> {}
    
    async execute<T>(action: string, params: unknown): Promise<ToolkitResponse<T>> {
        return {
            success: true,
            data: { result: 'mock' } as T,
            metrics: { duration: 100, retries: 0 }
        };
    }

    async healthCheck(): Promise<boolean> {
        return true;
    }
}

describe('BaseAgent', () => {
    const mockConfig: AgentConfig = {
        id: 'test-agent',
        name: 'Test Agent',
        maxMemory: 512,
        offlineCapable: true,
        allowedToolkits: ['core']
    };

    it('should initialize with valid config', async () => {
        const agent = new BaseAgent(mockConfig);
        await expect(agent.initialize()).resolves.not.toThrow();
        expect(agent.getState().status).toBe('idle');
    });

    it('should reject invalid config', async () => {
        const invalidConfig = { ...mockConfig, id: '' };
        const agent = new BaseAgent(invalidConfig);
        await expect(agent.initialize()).rejects.toThrow();
        expect(agent.getState().status).toBe('error');
    });

    it('should track task state', async () => {
        const agent = new BaseAgent(mockConfig);
        await agent.initialize();

        const task = {
            id: 'task-1',
            type: 'test',
            priority: 1,
            data: {},
            created: new Date()
        };

        await expect(agent.executeTask(task)).rejects.toThrow('Not implemented');
        expect(agent.getState().status).toBe('error');
    });

    describe('Toolkit Integration', () => {
        it('should register allowed toolkit', async () => {
            const agent = new BaseAgent(mockConfig);
            const toolkit = new MockToolkit();
            await expect(agent.registerToolkit(toolkit)).resolves.not.toThrow();
        });

        it('should reject unauthorized toolkit', async () => {
            const agent = new BaseAgent({ ...mockConfig, allowedToolkits: [] });
            const toolkit = new MockToolkit();
            await expect(agent.registerToolkit(toolkit)).rejects.toThrow();
        });
    });

    describe('Metrics Tracking', () => {
        it('should track resource metrics', async () => {
            const agent = new BaseAgent(mockConfig);
            const metrics = agent.getMetrics();
            
            expect(metrics.memory.total).toBe(mockConfig.maxMemory);
            expect(metrics.timestamp).toBeLessThanOrEqual(Date.now());
            expect(metrics.tasks.completed).toBe(0);
        });

        it('should update toolkit performance metrics', async () => {
            const agent = new BaseAgent(mockConfig);
            const toolkit = new MockToolkit();
            await agent.registerToolkit(toolkit);

            try {
                await agent.executeToolkitAction('core', 'test', {});
            } catch {}

            const stats = agent.getPerformanceStats();
            expect(stats.toolkitLatencies.has('core')).toBe(true);
        });
    });
});
