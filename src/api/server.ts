import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import http from 'http'; // Import http
import { Server as SocketIOServer } from 'socket.io'; // Import socket.io Server
import { createApiRoutes } from './routes/api.routes';
import agentOrchestrationRouter from './controllers/AgentOrchestrationController';
import { AgentController } from './controllers/agent.controller';
import { AgentService } from '../core/services/agent.service';
import Redis from 'ioredis';

// Define Logger interface (using unknown[] for better type safety than any[])
interface Logger {
  error(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
}

// Define IApiConfig interface
export interface IApiConfig {
  port: number;
  corsOrigins: string | string[];
  logger: Logger;
  // Note: rateLimitRequests, rateLimitWindow, apiKey were removed from the test temporarily,
  // ensure they are added back here if needed by the application logic later.
}

export class ApiServer {
  private app = express();
  private agents = new Map<string, AgentService>();
  private server: http.Server | null = null; // Type changed to http.Server
  private io: SocketIOServer | null = null; // Added io property for Socket.IO server

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
      this.config.logger.error('Express error handler:', error);
      // Avoid sending detailed errors in production
      res.status(500).json({ error: 'Internal server error' });
    });
  }

  private setupRoutes(): void {
    const agentController = new AgentController(this.agents);
    this.app.use('/api/v1', createApiRoutes(agentController));
    // Add a simple health check route
    this.app.get('/health', (req, res) => res.status(200).send('OK'));

    // Mount AI orchestration API
    this.app.use('/api/agents', agentOrchestrationRouter);


const redis = new Redis();
const CONTROL_CHANNEL = 'system_control_channel';
const RESPONSE_CHANNEL = 'system_control_channel_response';

async function publishAndWait(command: string, args: Record<string, unknown>, timeoutMs = 5000): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const id = Math.random().toString(36).substring(2);
    const message = { command, args, id };
    const sub = new Redis();
    let timer: NodeJS.Timeout;

    sub.subscribe(RESPONSE_CHANNEL, (err?: Error | null | undefined, result?: unknown) => {
      if (err) return reject(err);
      redis.publish(CONTROL_CHANNEL, JSON.stringify(message));
      timer = setTimeout(() => {
        sub.disconnect();
        reject(new Error('Timeout waiting for response'));
      }, timeoutMs);
    });

    sub.on('message', (_channel: string, msg: string) => {
      try {
        const data = JSON.parse(msg);
        if (data.id === id) {
          clearTimeout(timer);
          sub.disconnect();
          resolve(data);
        }
      } catch {
        // Ignore JSON parse errors
      }
    });
  });
}

// System Control Endpoints
this.app.post('/control/type', async (req, res) => {
  try {
    const { text } = req.body;
    const result = await publishAndWait('type_text', { text });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

this.app.post('/control/mouse', async (req, res) => {
  try {
    const { x, y } = req.body;
    const result = await publishAndWait('move_mouse', { x, y });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

this.app.post('/control/launch', async (req, res) => {
  try {
    const { app_path } = req.body;
    const result = await publishAndWait('launch_app', { app_path });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

this.app.post('/control/close', async (req, res) => {
  try {
    const { process_name } = req.body;
    const result = await publishAndWait('close_app', { process_name });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

this.app.post('/control/script', async (req, res) => {
  try {
    const { script } = req.body;
    const result = await publishAndWait('run_script', { script });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

this.app.post('/control/screenshot', async (_req, res) => {
  try {
    const result = await publishAndWait('screenshot', {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

  }

  start(): void {
    if (this.server) {
      this.config.logger.info('Server already started.');
      return;
    }

    // Create HTTP server explicitly using the Express app
    this.server = http.createServer(this.app);

    // Initialize Socket.IO server and attach it to the HTTP server
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: this.config.corsOrigins, // Use origins from config
        methods: ["GET", "POST"]
      }
    });

    // Handle Socket.IO connections
    this.io.on('connection', (socket) => {
      this.config.logger.info(`Socket connected: ${socket.id}`);
      socket.on('disconnect', (reason) => {
        this.config.logger.info(`Socket disconnected: ${socket.id}, Reason: ${reason}`);
      });
      // Example: Listen for a custom event
      socket.on('agent_message', (data) => {
        this.config.logger.info(`Message from agent ${socket.id}:`, data);
        // Broadcast message or handle specific logic
      });
    });

    // Start listening on the HTTP server
    this.server.listen(this.config.port, () => {
      this.config.logger.info(`API server with Socket.IO running on port ${this.config.port}`);
    });

    // Attach error handler specifically for the HTTP server startup/runtime errors
    this.server.on('error', (err: NodeJS.ErrnoException) => { // Use NodeJS.ErrnoException for server errors
      this.config.logger.error('HTTP Server error:', err);
      // Handle specific listen errors like EACCES or EADDRINUSE
      if (err.code === 'EADDRINUSE') {
        this.config.logger.error(`Port ${this.config.port} is already in use.`);
        process.exit(1); // Exit if port is busy
      }
    });
  }

  shutdown(): void {
    this.config.logger.info('Attempting graceful shutdown...');
    // 1. Close Socket.IO server first to stop new connections
    if (this.io) {
      this.io.close((ioErr?: Error) => { // Socket.IO close callback
        if (ioErr) {
          this.config.logger.error('Error closing Socket.IO server:', ioErr);
        } else {
          this.config.logger.info('Socket.IO server closed.');
        }
        // 2. Proceed to close HTTP server after Socket.IO is closed
        this.closeHttpServer();
      });
    } else {
      // If no Socket.IO server, just close HTTP server
      this.closeHttpServer();
    }
  }

  // Helper to close HTTP server
  private closeHttpServer(): void {
    if (this.server) {
      this.server.close((httpErr?: Error) => {
        if (httpErr) {
          this.config.logger.error('Error closing HTTP server:', httpErr);
        } else {
          this.config.logger.info('HTTP server closed.');
        }
        this.server = null; // Clear server reference after closing
        this.io = null; // Clear io reference
      });
    } else {
       this.config.logger.info('HTTP server already closed or never started.');
    }
  }

  // Getter for the Express app instance (useful for testing)
  get appInstance(): express.Application {
    return this.app;
  }

  // Getter for the Socket.IO server instance
  get ioInstance(): SocketIOServer | null {
    return this.io;
  }

  // Method to register agents remains the same
  registerAgent(agentId: string, agentService: AgentService): void {
    this.agents.set(agentId, agentService);
    this.config.logger.info(`Agent registered: ${agentId}`);
  }
}
