import request from 'supertest';
import { ApiServer } from '../server';
import { IApiConfig } from '../interfaces/api.interface';

describe('API Integration Tests', () => {
  let server: ApiServer;

  beforeAll(() => {
    const config: IApiConfig = {
      port: 3000,
      corsOrigins: ['http://localhost:3000'],
      rateLimitRequests: 100,
      rateLimitWindow: 60
    };
    server = new ApiServer(config);
    server.start();
  });

  it('should require authentication', async () => {
    const response = await request(server['app'])
      .get('/api/v1/agents');
    expect(response.status).toBe(401);
  });

  it('should list agents when authenticated', async () => {
    const response = await request(server['app'])
      .get('/api/v1/agents')
      .set('x-api-key', process.env.API_KEY || 'test-key');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
