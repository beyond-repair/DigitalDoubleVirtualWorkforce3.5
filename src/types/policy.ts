export interface Policy {
    id: string;
    name: string;
    priority: number;
    rules: PolicyRule[];
    enabled: boolean;
}

export interface PolicyRule {
    type: 'resource' | 'security' | 'compliance';
    condition: string;
    action: 'allow' | 'deny' | 'throttle';
    parameters?: Record<string, unknown>;
}

export interface PolicyValidationResult {
    allowed: boolean;
    reason?: string;
    appliedRules: PolicyRule[];
}
