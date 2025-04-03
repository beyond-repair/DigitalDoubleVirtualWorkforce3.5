import { ITask } from '../interfaces/agent.interface';
import { AgentService } from './agent.service';

export class TaskSchedulerService {
  constructor(private agents: Map<string, AgentService>) {}

  async scheduleTask(task: ITask): Promise<string> {
    const availableAgents = Array.from(this.agents.values())
      .filter(agent => agent.status === 'IDLE');

    if (availableAgents.length === 0) {
      throw new Error('No available agents');
    }

    // Select agent based on capabilities and load
    const selectedAgent = await this.selectBestAgent(availableAgents, task);
    await selectedAgent.execute(task);
    
    return selectedAgent.id;
  }

  private async selectBestAgent(agents: AgentService[], task: ITask): Promise<AgentService> {
    const agentMetrics = await Promise.all(
      agents.map(async agent => ({
        agent,
        metrics: await agent.monitor.getCurrentMetrics()
      }))
    );

    return agentMetrics.sort((a, b) => 
      (a.metrics.cpuUsage + a.metrics.memoryUsage) -
      (b.metrics.cpuUsage + b.metrics.memoryUsage)
    )[0].agent;
  }
}
