export interface IAgentVisualMetadata {
  agentId: string;
  avatarUrl?: string;
  roomId?: string;
  position?: { x: number; y: number };
  isSelected?: boolean;
  isSpeaking?: boolean;
}