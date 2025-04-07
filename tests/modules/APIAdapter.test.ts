import { APIAdapter } from '../../src/modules/plugin_integration/APIAdapter';

describe('APIAdapter', () => {
  let adapter: APIAdapter;

  beforeAll(async () => {
    adapter = new APIAdapter();
    await adapter.initialize();
  });

  afterAll(async () => {
    await adapter.shutdown();
  });

  test('healthCheck returns boolean', async () => {
    const healthy = await adapter.healthCheck();
    expect(typeof healthy).toBe('boolean');
  });

  test('fetchData returns object or null', async () => {
    const data = await adapter.fetchData('https://httpbin.org/get');
    expect(typeof data === 'object' || data === null).toBe(true);
  });
});