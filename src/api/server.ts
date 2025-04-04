import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createApiRoutes } from './routes/api.routes';
import { AgentController } from './controllers/agent.controller';
import { AgentService } from '../core/services/agent.service';

interface Logger {
  error(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
}

export interface IApiConfig {
  port: number;
  corsOrigins: string | string[];
  logger: Logger;
}

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
    
    // Global error handler
    this.app.use((error: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
      this.config.logger.error('Server error:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
  }

  private setupRoutes(): void {
    const agentController = new AgentController(this.agents);
    this.app.use('/api/v1', createApiRoutes(agentController));
  }

  start(): void {
    this.server = this.app.listen(this.config.port, () => {
      // logger.info(`API server running on port ${this.config.port}`);
    });

    // Attach error handler to the server instance
    if (this.server) {
      this.server.on('error', (err: Error) => { // Correct signature for http.Server error
        // logger.error('Server error:', err);
      });
    }
  }

  shutdown(): void {
    if (this.server) {
      this.server.close((err?: Error) => {
        if (err) {
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
