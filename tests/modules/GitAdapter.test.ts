import { GitAdapter } from '../../src/modules/plugin_integration/GitAdapter';

describe('GitAdapter', () => {
  let adapter: GitAdapter;

  beforeAll(async () => {
    adapter = new GitAdapter();
    await adapter.initialize();
  });

  afterAll(async () => {
    await adapter.shutdown();
  });

  test('healthCheck returns boolean', async () => {
    const healthy = await adapter.healthCheck();
    expect(typeof healthy).toBe('boolean');
  });

  test('getStatus returns a string', async () => {
    const status = await adapter.getStatus();
    expect(typeof status).toBe('string');
  });
});