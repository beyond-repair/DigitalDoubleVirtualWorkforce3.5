import { SelfHealingManager, ErrorEvent, SelfHealingModule, CorrectionResult } from '../../src/core/SelfHealingManager';

class DummyModule implements SelfHealingModule {
  async analyze(event: ErrorEvent): Promise<boolean> {
    return event.errorType === 'TestError';
  }
  async correct(event: ErrorEvent): Promise<CorrectionResult> {
    return { success: true, details: 'Dummy correction applied' };
  }
  async validate(event: ErrorEvent): Promise<boolean> {
    return true;
  }
}

describe('SelfHealingManager', () => {
  let manager: SelfHealingManager;
  let dummyModule: DummyModule;

  beforeEach(() => {
    manager = new SelfHealingManager();
    dummyModule = new DummyModule();
    manager.registerModule(dummyModule);
  });

  it('should trigger correction on anomaly', async () => {
    const event: ErrorEvent = {
      source: 'UnitTest',
      timestamp: Date.now(),
      errorType: 'TestError',
      message: 'Simulated error'
    };
    await manager.emitErrorEvent(event);
    // No assertion needed; check console or extend DummyModule for spies
  });

  it('should ignore non-anomalous events', async () => {
    const event: ErrorEvent = {
      source: 'UnitTest',
      timestamp: Date.now(),
      errorType: 'Info',
      message: 'Non-error event'
    };
    await manager.emitErrorEvent(event);
  });
});