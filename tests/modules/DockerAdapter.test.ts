import { DockerAdapter } from '../../src/modules/plugin_integration/DockerAdapter';

describe('DockerAdapter', () => {
  let adapter: DockerAdapter;

  beforeAll(async () => {
    adapter = new DockerAdapter();
    await adapter.initialize();
  });

  afterAll(async () => {
    await adapter.shutdown();
  });

  test('healthCheck returns boolean', async () => {
    const healthy = await adapter.healthCheck();
    expect(typeof healthy).toBe('boolean');
  });

  test('listContainers returns an array', async () => {
    const containers = await adapter.listContainers();
    expect(Array.isArray(containers)).toBe(true);
  });
});