import { TaskExecutionAgent } from '../../src/core/TaskExecutionAgent';
import { MockToolkit } from './BaseAgent.test';

describe('TaskExecutionAgent', () => {
    const mockConfig = {
        id: 'task-agent',
        name: 'Task Agent',
        maxMemory: 512,
        offlineCapable: true,
        allowedToolkits: ['workflow']
    };

    it('should execute task and store result', async () => {
        const agent = new TaskExecutionAgent(mockConfig);
        const toolkit = new MockToolkit();
        await agent.registerToolkit(toolkit);

        const task = {
            id: 'workflow-1',
            type: 'process',
            priority: 1,
            data: { input: 'test' },
            created: new Date()
        };

        await agent.executeTask(task);
        const result = agent.getTaskResult(task.id);

        expect(result).toBeDefined();
        expect(result?.success).toBe(true);
        expect(result?.output).toBeDefined();
    });

    it('should handle task failures', async () => {
        const agent = new TaskExecutionAgent(mockConfig);
        const failingToolkit = new MockToolkit();
        failingToolkit.execute = async (): Promise<never> => { throw new Error('Task failed'); };
        
        await agent.registerToolkit(failingToolkit);

        const task = {
            id: 'failed-1',
            type: 'process',
            priority: 1,
            data: {},
            created: new Date()
        };

        await expect(agent.executeTask(task)).rejects.toThrow('Task failed');
        const result = agent.getTaskResult(task.id);
        console.log('Retrieved result after failure:', result);

        expect(result?.success).toBe(false);
        expect(result?.error).toBeDefined();
    });
});
