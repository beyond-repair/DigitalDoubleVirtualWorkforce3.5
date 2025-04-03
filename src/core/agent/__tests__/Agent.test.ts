import { Agent } from '../Agent';

describe('Agent', () => {
  let agent: Agent;

  beforeEach(() => {
    agent = new Agent({
      name: 'test-agent',
      capabilities: ['test']
    });
  });

  test('should initialize with config', async () => {
    await agent.initialize();
    expect(agent).toBeDefined();
  });

  test('should execute tasks', async () => {
    const task = { type: 'test', data: {} };
    const result = await agent.execute(task);
    expect(result).toBeDefined();
  });
});
