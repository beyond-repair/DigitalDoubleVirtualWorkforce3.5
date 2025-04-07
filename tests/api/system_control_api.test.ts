import request from 'supertest';
import { ApiServer, IApiConfig } from '../../src/api/server';
import Redis from 'ioredis';

jest.mock('ioredis');

const mockPublish = jest.fn();
const mockSubscribe = jest.fn((channel, cb) => cb(null, 1));
const mockOn = jest.fn();
const mockDisconnect = jest.fn();

Redis.prototype.publish = mockPublish;
Redis.prototype.subscribe = mockSubscribe;
Redis.prototype.on = mockOn;
Redis.prototype.disconnect = mockDisconnect;

describe('System Control API', () => {
  let server: ApiServer;

  beforeAll(() => {
    const config: IApiConfig = {
      port: 0,
      corsOrigins: '*',
      logger: console,
    };
    server = new ApiServer(config);
  });

  it('should POST /control/type', async () => {
    mockPublish.mockClear();
    const res = await request(server['app']).post('/control/type').send({ text: 'hello' });
    expect(res.status).toBe(500); // Since Redis is mocked, expect timeout/error
    expect(mockPublish).toHaveBeenCalled();
  });

  it('should POST /control/mouse', async () => {
    mockPublish.mockClear();
    const res = await request(server['app']).post('/control/mouse').send({ x: 10, y: 20 });
    expect(res.status).toBe(500);
    expect(mockPublish).toHaveBeenCalled();
  });

  it('should POST /control/launch', async () => {
    mockPublish.mockClear();
    const res = await request(server['app']).post('/control/launch').send({ app_path: 'notepad.exe' });
    expect(res.status).toBe(500);
    expect(mockPublish).toHaveBeenCalled();
  });

  it('should POST /control/close', async () => {
    mockPublish.mockClear();
    const res = await request(server['app']).post('/control/close').send({ process_name: 'notepad.exe' });
    expect(res.status).toBe(500);
    expect(mockPublish).toHaveBeenCalled();
  });

  it('should POST /control/script', async () => {
    mockPublish.mockClear();
    const res = await request(server['app']).post('/control/script').send({ script: 'echo hi' });
    expect(res.status).toBe(500);
    expect(mockPublish).toHaveBeenCalled();
  });

  it('should POST /control/screenshot', async () => {
    mockPublish.mockClear();
    const res = await request(server['app']).post('/control/screenshot').send({});
    expect(res.status).toBe(500);
    expect(mockPublish).toHaveBeenCalled();
  });
});