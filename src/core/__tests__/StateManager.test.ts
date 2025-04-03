import { StateManager, Snapshot } from '../StateManager';

describe('StateManager', () => {
  let manager: StateManager;

  beforeEach(() => {
    manager = new StateManager();
  });

  test('should create and restore snapshots', async () => {
    const snapshot = await manager.snapshot();
    expect(snapshot.timestamp).toBeDefined();
    await manager.restore(snapshot);
  });

  test('should isolate task state', async () => {
    const taskId = 'task-123';
    await manager.isolate(taskId);
    const snapshot = await manager.snapshot();
    expect(snapshot.state.size).toBe(0);
  });
});
