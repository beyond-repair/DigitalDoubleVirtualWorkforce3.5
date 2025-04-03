import { IClusterNode, NodeRole, NodeStatus } from '../interfaces/ICluster';
import { NotificationService } from './NotificationService';

export class ClusterService {
    private nodes: Map<string, IClusterNode> = new Map();
    private readonly HEARTBEAT_INTERVAL = 5000;
    private readonly FAILOVER_THRESHOLD = 15000;

    constructor(private notificationService: NotificationService) {
        this.startHealthCheck();
    }

    private startHealthCheck(): void {
        setInterval(() => this.checkClusterHealth(), this.HEARTBEAT_INTERVAL);
    }

    public async initiateFailover(failedNodeId: string): Promise<void> {
        const failedNode = this.nodes.get(failedNodeId);
        if (!failedNode || failedNode.role !== NodeRole.PRIMARY) return;

        const newPrimary = this.selectNewPrimary();
        if (newPrimary) {
            await this.promoteNode(newPrimary.id);
        }
    }

    private selectNewPrimary(): IClusterNode | undefined {
        return Array.from(this.nodes.values())
            .find(node => 
                node.role === NodeRole.SECONDARY && 
                node.status === NodeStatus.HEALTHY
            );
    }
}
