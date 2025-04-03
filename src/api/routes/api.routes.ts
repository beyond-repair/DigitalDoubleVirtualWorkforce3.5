import { Router } from 'express';
import { AgentController } from '../controllers/agent.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

export function createApiRoutes(agentController: AgentController): Router {
  const router = Router();

  router.use(AuthMiddleware.authenticate);

  router.get('/agents', (req, res) => agentController.getAgents(req, res));

  return router;
}
