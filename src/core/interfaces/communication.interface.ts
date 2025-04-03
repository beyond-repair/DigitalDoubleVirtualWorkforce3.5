export interface IMessage {
  id: string;
  type: MessageType;
  sender: string;
  recipient: string;
  payload: unknown;
  timestamp: number;
}

export enum MessageType {
  TASK_ASSIGNMENT = 'TASK_ASSIGNMENT',
  STATUS_UPDATE = 'STATUS_UPDATE',
  RESOURCE_REPORT = 'RESOURCE_REPORT',
  HEARTBEAT = 'HEARTBEAT'
}

export interface ICommunicationHandler {
  onMessage(message: IMessage): Promise<void>;
  sendMessage(message: IMessage): Promise<void>;
  subscribe(type: MessageType, handler: (message: IMessage) => Promise<void>): void;
  unsubscribe(type: MessageType): void;
}
