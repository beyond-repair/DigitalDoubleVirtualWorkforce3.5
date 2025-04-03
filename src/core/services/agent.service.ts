import { IAgent, AgentStatus, ITask, ITaskResult } from '../interfaces/agent.interface';
import { IAgentMetrics } from '../../interfaces/IAgent';
import { TaskQueueService } from './queue.service';
import { ResourceMonitorService } from './monitor.service';
import { CommunicationService } from './communication.service';
import { MessageType } from '../interfaces/communication.interface';

export class AgentService implements IAgent {
  public id: string;
  public status: AgentStatus;
  public capabilities: string[];
  private taskQueue: TaskQueueService;
  private monitor: ResourceMonitorService;
  private communication: CommunicationService;

  constructor(id: string, capabilities: string[] = []) {
    this.id = id;
    this.status = AgentStatus.OFFLINE;
    this.capabilities = capabilities;
    this.taskQueue = new TaskQueueService();
    this.monitor = new ResourceMonitorService();
    this.communication = new CommunicationService(id);
    this.setupMessageHandlers();
  }

  async initialize(): Promise<void> {
    this.status = AgentStatus.IDLE;
    await this.monitor.startMonitoring();
  }

  async execute(task: ITask): Promise<ITaskResult> {
    await this.taskQueue.enqueue(task);
    return this.processNextTask();
  }

  private async processNextTask(): Promise<ITaskResult> {
    const task = await this.taskQueue.dequeue();
    if (!task) {
      return { taskId: '', success: false, error: 'No task available' };
    }

    try {
      this.status = AgentStatus.BUSY;
      // Task execution logic here
      return { taskId: task.id, success: true };
    } catch (error) {
      this.status = AgentStatus.ERROR;
      return {
        taskId: task.id,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      this.status = AgentStatus.IDLE;
    }
  }

  public async getCurrentMetrics(): Promise<IAgentMetrics> {
    const metrics = await this.monitor.getCurrentMetrics();
    return {
      cpuUsage: metrics.cpuUsage,
      memoryUsage: metrics.memoryUsage,
      activeThreads: metrics.activeThreads,
      taskCount: await this.getTaskCount()
    };
  }

  public async getTaskCount(): Promise<number> {
    return this.taskQueue.size();
  }

  private setupMessageHandlers(): void {
    this.communication.subscribe(MessageType.TASK_ASSIGNMENT, async (message) => {
      const task = message.payload as ITask;
      await this.execute(task);
    });
  }

  async shutdown(): Promise<void> {
    await this.monitor.stopMonitoring();
    this.communication.shutdown();
    this.status = AgentStatus.OFFLINE;
  }
}
