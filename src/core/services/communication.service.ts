import { ICommunicationHandler, IMessage, MessageType } from '../interfaces/communication.interface';

export class CommunicationService implements ICommunicationHandler {
  private handlers: Map<MessageType, ((message: IMessage) => Promise<void>)[]> = new Map();
  private readonly HEARTBEAT_INTERVAL = 30000;
  private heartbeatTimer?: NodeJS.Timeout;

  constructor(private agentId: string) {
    this.startHeartbeat();
  }

  async onMessage(message: IMessage): Promise<void> {
    const handlers = this.handlers.get(message.type) || [];
    await Promise.all(handlers.map(handler => handler(message)));
  }

  async sendMessage(message: IMessage): Promise<void> {
    message.sender = this.agentId;
    message.timestamp = Date.now();
    // Implementation for actual message sending will go here
    await this.onMessage(message);
  }

  subscribe(type: MessageType, handler: (message: IMessage) => Promise<void>): void {
    const handlers = this.handlers.get(type) || [];
    handlers.push(handler);
    this.handlers.set(type, handlers);
  }

  unsubscribe(type: MessageType): void {
    this.handlers.delete(type);
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      this.sendMessage({
        id: `heartbeat-${Date.now()}`,
        type: MessageType.HEARTBEAT,
        sender: this.agentId,
        recipient: 'broadcast',
        payload: { status: 'alive' },
        timestamp: Date.now()
      });
    }, this.HEARTBEAT_INTERVAL);
  }

  shutdown(): void {
    if (this.heartbeatTimer) {
      clearTimeout(this.heartbeatTimer as NodeJS.Timeout);
    }
  }
}
