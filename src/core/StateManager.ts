import { EventEmitter } from 'events';

export interface Snapshot {
  timestamp: number;
  state: Map<string, unknown>;
  metadata: Record<string, unknown>;
}

export class StateManager extends EventEmitter {
  private state: Map<string, unknown>;
  private history: Snapshot[] = [];
  
  constructor() {
    super();
    this.state = new Map();
  }

  async snapshot(): Promise<Snapshot> {
    return {
      timestamp: Date.now(),
      state: new Map(this.state),
      metadata: { version: '1.0' }
    };
  }

  async restore(snapshot: Snapshot): Promise<void> {
    this.state = new Map(snapshot.state);
    this.emit('state-restored', snapshot.timestamp);
  }

  async isolate(taskId: string): Promise<void> {
    const isolatedState = new Map();
    this.state.forEach((value, key) => {
      if (key.startsWith(`${taskId}:`)) {
        isolatedState.set(key, value);
      }
    });
    this.state = isolatedState;
  }
}
