import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createApiRoutes } from './routes/api.routes';
import { AgentController } from './controllers/agent.controller';
import { IApiConfig } from './interfaces/api.interface';
import { AgentService } from '../core/services/agent.service';

export class ApiServer {
  private app = express();
  private agents = new Map<string, AgentService>();
  private server: ReturnType<express.Application['listen']> | null = null;

  constructor(private config: IApiConfig) {
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(helmet());
    this.app.use(cors({ origin: this.config.corsOrigins }));
    this.app.use(express.json());
  }

  private setupRoutes(): void {
    const agentController = new AgentController(this.agents);
    this.app.use('/api/v1', createApiRoutes(agentController));
  }

  start(): void {
    this.server = this.app.listen(this.config.port, (err?: Error) => {
      if (err) {
        // Log error using a proper logger instead of console.log
        // logger.error(err);
        return;
      }
      // logger.info(`API server running on port ${this.config.port}`);
    });
  }

  shutdown(): void {
    if (this.server) {
      this.server.close((err: Error) => {
        if (err) {
          // Log error using a proper logger instead of console.error
          // logger.error('Error closing server:', err);
        }
      });
    }
  }

  get appInstance(): express.Application {
    return this.app;
  }

  registerAgent(agentId: string, agentService: AgentService): void {
    this.agents.set(agentId, agentService);
  }
}
