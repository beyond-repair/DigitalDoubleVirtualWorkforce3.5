import request from 'supertest';
import express from 'express';
import { AgentController } from '../../api/controllers/AgentController';
import { AgentService } from '../../core/AgentService';

describe('AgentController', () => {
    let app: express.Application;
    let agentService: AgentService;

    beforeEach(() => {
        app = express();
        agentService = new AgentService();
        const controller = new AgentController(agentService);
        app.use('/api/agents', controller.getRouter());
    });

    it('should register new agent', async () => {
        const response = await request(app)
            .post('/api/agents/register')
            .set('X-API-Key', process.env.API_KEY || 'test-key');

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
    });
});
