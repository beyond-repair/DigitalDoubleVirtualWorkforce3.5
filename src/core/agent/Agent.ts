import { AgentConfig } from './types';

// Define interfaces for better type safety
interface Task {
  id?: string;
  type: string;
  data: Record<string, unknown>;
}

interface ExecutionResult {
  success: boolean;
  taskId: string;
}

/**
 * Represents an agent responsible for managing tasks and state.
 * @class Agent
 */
export class Agent {
  private readonly id: string;
  private readonly config: AgentConfig;
  private state: Map<string, unknown>; // Use unknown instead of any
  private taskQueue: Task[] = [];
  private isProcessing: boolean = false;

  constructor(config: AgentConfig) {
    this.id = crypto.randomUUID();
    this.config = config;
    this.state = new Map();
  }

  /**
   * Initializes the agent by loading its initial state and setting it ready.
   * @returns {Promise<void>}
   */
  async initialize(): Promise<void> {
    try {
      await this.loadInitialState();
      this.state.set('status', 'ready');
    } catch (error) {
      this.state.set('status', 'error');
      throw new Error(`Agent initialization failed: ${error}`);
    }
  }

  private async loadInitialState(): Promise<void> {
    // Load configuration-based initial state
    Object.entries(this.config.initialState || {}).forEach(([key, value]) => {
      this.state.set(key, value);
    });
  }

  /**
   * Executes a task by adding it to the task queue and processing it.
   * @param {Task} task - The task to be executed.
   * @returns {Promise<ExecutionResult>} The result of the task execution.
   */
  async execute(task: Task): Promise<ExecutionResult> {
    try {
      this.taskQueue.push(task);
      if (!this.isProcessing) {
        await this.processTaskQueue();
      }
      return { success: true, taskId: task?.id || 'unknown' };
    } catch (error) {
      return { success: false, taskId: task?.id || 'unknown' };
    }
  }

  /**
   * Processes the task queue sequentially.
   * @private
   * @returns {Promise<void>}
   */
  private async processTaskQueue(): Promise<void> {
    this.isProcessing = true;
    while (this.taskQueue.length > 0) {
      const task = this.taskQueue.shift();
      if (task) {
        await this.processTask(task);
      }
    }
    this.isProcessing = false;
  }

  /**
   * Processes an individual task.
   * @private
   * @param {Task} task - The task to process.
   * @returns {Promise<void>}
   */
  private async processTask(task: Task): Promise<void> {
    this.state.set('currentTask', task);
    try {
      // Task processing logic here
      await this.handleTaskByType(task);
    } catch (error) {
      this.state.set('lastError', error);
    } finally {
      this.state.delete('currentTask');
    }
  }

  /**
   * Handles a task based on its type.
   * @private
   * @param {Task} task - The task to handle.
   * @returns {Promise<void>}
   * @throws {Error} If the task type is unsupported.
   */
  private async handleTaskByType(task: Task): Promise<void> {
    switch (task.type) {
      case 'learning':
        // Handle learning tasks
        break;
      case 'inference':
        // Handle inference tasks
        break;
      default:
        throw new Error(`Unsupported task type: ${task.type}`);
    }
  }
}
