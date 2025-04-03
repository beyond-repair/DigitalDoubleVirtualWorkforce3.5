import { Request, Response } from 'express';
import { AgentService } from '../../core/services/agent.service';
import { IApiResponse } from '../interfaces/api.interface';
import { AgentStatus, IAgentMetrics } from '../../interfaces/IAgent';
import axios from 'axios';

interface IAgentStatus {
  id: string;
  status: AgentStatus;
  metrics: IAgentMetrics;
  taskCount: number;
}

interface IOpenRouterResponse {
  id: string;
  generation_id: string;
  provider_name: string;
  model: string;
  app_id: number;
  streamed: boolean;
  cancelled: boolean;
  generation_time: number;
  latency: number;
  created_at: string;
}

export class AgentController {
  constructor(private agents: Map<string, AgentService>) {}

  public async getAgents(req: Request, res: Response): Promise<void> {
    try {
      const statuses: IAgentStatus[] = [];
      for (const agent of this.agents.values()) {
        statuses.push({
          id: agent.id,
          status: agent.status,
          metrics: await agent.getCurrentMetrics(),
          taskCount: await agent.getTaskCount()
        });
      }

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

  public async updateMetrics(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update agent metrics' });
    }
  }

  public async registerAgent(req: Request, res: Response): Promise<void> {
    try {
      const response = await axios.post<IOpenRouterResponse>('https://openrouter.ai/api/v1/chat/completions', {
        model: "google/gemini-2.5-pro-exp-03-25:free",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Generate a unique agent ID."
              }
            ]
          }
        ]
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
        }
      });

      const agentId = response.data.id;
      res.status(201).json({ success: true, agentId });
    } catch (error) {
      res.status(500).json({ error: 'Failed to register agent' });
    }
  }
}
