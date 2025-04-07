import { CICDAdapter } from '../../src/modules/plugin_integration/CICDAdapter';

describe('CICDAdapter', () => {
  let adapter: CICDAdapter;

  beforeAll(async () => {
    adapter = new CICDAdapter();
    await adapter.initialize();
  });

  afterAll(async () => {
    await adapter.shutdown();
  });

  test('healthCheck returns boolean', async () => {
    const healthy = await adapter.healthCheck();
    expect(typeof healthy).toBe('boolean');
  });

  test('triggerBuild returns boolean', async () => {
    const result = await adapter.triggerBuild('test-pipeline');
    expect(typeof result).toBe('boolean');
  });
});