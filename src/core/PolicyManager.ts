import { Policy, PolicyRule, PolicyValidationResult } from '../types/policy';
import { Task } from '../types/agent';

export class PolicyManager {
    private policies: Policy[] = [];

    addPolicy(policy: Policy): void {
        this.policies.push(policy);
        this.policies.sort((a, b) => b.priority - a.priority);
    }

    async validateTask(task: Task): Promise<PolicyValidationResult> {
        const appliedRules: PolicyRule[] = [];

        for (const policy of this.policies) {
            if (!policy.enabled) continue;

            for (const rule of policy.rules) {
                if (await this.evaluateRule(rule, task)) {
                    appliedRules.push(rule);
                    if (rule.action === 'deny') {
                        return {
                            allowed: false,
                            reason: `Policy ${policy.name} denied task execution`,
                            appliedRules
                        };
                    }
                }
            }
        }

        return { allowed: true, appliedRules };
    }

    private async evaluateRule(rule: PolicyRule, task: Task): Promise<boolean> {
        // Simple condition evaluation for demonstration
        const condition = new Function('task', `return ${rule.condition}`);
        return condition(task);
    }
}
