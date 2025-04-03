import { ResourceGovernor, ResourceLimits } from '../ResourceGovernor';

describe('ResourceGovernor', () => {
  const defaultLimits: ResourceLimits = {
    maxMemoryMB: 512,
    maxCPUPercent: 80,
    maxDiskIOPS: 1000
  };

  test('should initialize with valid limits', () => {
    const governor = new ResourceGovernor(defaultLimits);
    expect(governor).toBeDefined();
  });

  test('should throw on invalid limits', () => {
    expect(() => new ResourceGovernor({
      ...defaultLimits,
      maxMemoryMB: 64  // Too low
    })).toThrow();
  });

  test('should emit event on resource excess', (done) => {
    const governor = new ResourceGovernor(defaultLimits);
    governor.on('resource-exceeded', (data) => {
      expect(data.resourceId).toBeDefined();
      done();
    });
    governor.monitor('test-resource');
  });
});
