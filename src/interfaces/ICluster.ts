export enum NodeRole {
    PRIMARY = 'PRIMARY',
    SECONDARY = 'SECONDARY',
    ARBITER = 'ARBITER'
}

export enum NodeStatus {
    HEALTHY = 'HEALTHY',
    DEGRADED = 'DEGRADED',
    FAILING = 'FAILING',
    OFFLINE = 'OFFLINE'
}

export interface IClusterNode {
    id: string;
    role: NodeRole;
    status: NodeStatus;
    lastHeartbeat: Date;
    metrics: {
        load: number;
        latency: number;
        uptime: number;
    };
}
