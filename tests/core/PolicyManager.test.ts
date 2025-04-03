import { PolicyManager } from '../../src/core/PolicyManager';
import { Policy, PolicyRule } from '../../src/types/policy';
import { Task } from '../../src/types/agent';

describe('PolicyManager', () => {
    let policyManager: PolicyManager;

    beforeEach(() => {
        policyManager = new PolicyManager();
    });

    it('should allow task when no policies exist', async () => {
        const task: Task = {
            id: 'test',
            type: 'process',
            priority: 1,
            data: {},
            created: new Date()
        };

        const result = await policyManager.validateTask(task);
        expect(result.allowed).toBe(true);
    });

    it('should deny task based on policy rule', async () => {
        const policy: Policy = {
            id: 'security-policy',
            name: 'Security Policy',
            priority: 1,
            enabled: true,
            rules: [{
                type: 'security',
                condition: 'task.priority > 5',
                action: 'deny'
            }]
        };

        policyManager.addPolicy(policy);

        const task: Task = {
            id: 'high-priority',
            type: 'process',
            priority: 10,
            data: {},
            created: new Date()
        };

        const result = await policyManager.validateTask(task);
        expect(result.allowed).toBe(false);
    });
});
