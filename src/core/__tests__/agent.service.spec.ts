import { AgentService } from '../services/agent.service';
import { AgentStatus } from '../interfaces/agent.interface';

describe('AgentService', () => {
  let agent: AgentService;

  beforeEach(() => {
    agent = new AgentService('test-agent', ['task1', 'task2']);
  });

  test('should initialize with correct status', async () => {
    expect(agent.status).toBe(AgentStatus.OFFLINE);
    await agent.initialize();
    expect(agent.status).toBe(AgentStatus.IDLE);
  });

  test('should execute task and return result', async () => {
    await agent.initialize();
    const result = await agent.execute({
      id: '1',
      type: 'test',
      payload: {},
      priority: 1
    });
    
    expect(result.success).toBe(true);
    expect(result.taskId).toBe('1');
  });

  test('should shutdown correctly', async () => {
    await agent.shutdown();
    expect(agent.status).toBe(AgentStatus.OFFLINE);
  });
});
