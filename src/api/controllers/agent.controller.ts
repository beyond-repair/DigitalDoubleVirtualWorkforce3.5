import { Request, Response } from 'express';
import { AgentService } from '../../core/services/agent.service';
import { IApiResponse } from '../interfaces/api.interface';
import { AgentStatus, IAgentMetrics } from '../../interfaces/IAgent';

interface IAgentStatus {
  id: string;
  status: AgentStatus;
  metrics: IAgentMetrics;
  taskCount: number;
}

export class AgentController {
  constructor(private agents: Map<string, AgentService>) {}

  async getAgents(req: Request, res: Response): Promise<void> {
    try {
      const statuses: IAgentStatus[] = await Promise.all(
        Array.from(this.agents.values()).map(async (agent) => ({
          id: agent.id,
          status: agent.status,
          metrics: await agent.getCurrentMetrics(),
          taskCount: await agent.getTaskCount()
        }))
      );

      res.json({
        success: true,
        data: statuses,
        timestamp: Date.now()
      } as IApiResponse<IAgentStatus[]>);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      });
    }
  }
}
