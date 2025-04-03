import { IAgent, AgentStatus, IAgentMetrics } from '../interfaces/IAgent';
import { ITask, TaskStatus } from '../interfaces/ITask';

export class AgentService {
    private agents: Map<string, IAgent> = new Map();
    private readonly HEARTBEAT_TIMEOUT = 30000; // 30 seconds
    private agentCache: Map<AgentStatus, IAgent[]> = new Map();
    private lastCleanup: number = Date.now();
    private readonly CLEANUP_INTERVAL = 300000; // 5 minutes

    public registerAgent(id: string): IAgent {
        const agent: IAgent = {
            id,
            status: AgentStatus.IDLE,
            metrics: {
                cpuUsage: 0,
                memoryUsage: 0,
                activeThreads: 0,
                taskCount: 0
            },
            lastHeartbeat: new Date()
        };
        this.agents.set(id, agent);
        return agent;
    }

    public updateAgentMetrics(id: string, metrics: IAgentMetrics): void {
        const agent = this.agents.get(id);
        if (agent) {
            agent.metrics = metrics;
            agent.lastHeartbeat = new Date();
        }
    }

    public getAvailableAgents(): IAgent[] {
        const cached = this.agentCache.get(AgentStatus.IDLE);
        if (cached) return cached;

        const agents = Array.from(this.agents.values())
            .filter(agent => agent.status === AgentStatus.IDLE);
        this.agentCache.set(AgentStatus.IDLE, agents);
        return agents;
    }

    public assignTask(agentId: string, task: ITask): boolean {
        const agent = this.agents.get(agentId);
        if (agent && agent.status === AgentStatus.IDLE) {
            agent.status = AgentStatus.BUSY;
            agent.currentTask = task.id;
            agent.metrics.taskCount++;
            return true;
        }
        return false;
    }

    public completeTask(agentId: string): void {
        const agent = this.agents.get(agentId);
        if (agent) {
            agent.status = AgentStatus.IDLE;
            agent.currentTask = undefined;
        }
    }

    private cleanupStaleAgents(): void {
        if (Date.now() - this.lastCleanup < this.CLEANUP_INTERVAL) return;

        const staleThreshold = Date.now() - this.HEARTBEAT_TIMEOUT;
        for (const [id, agent] of this.agents) {
            if (agent.lastHeartbeat.getTime() < staleThreshold) {
                this.agents.delete(id);
                this.agentCache.clear();
            }
        }
        this.lastCleanup = Date.now();
    }
}
