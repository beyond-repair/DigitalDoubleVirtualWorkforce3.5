import { IAgentVisualMetadata } from '../../interfaces/IAgentVisualMetadata';

class AgentVisualState {
  private static instance: AgentVisualState;
  private metadataMap: Map<string, IAgentVisualMetadata> = new Map();


  public static getInstance(): AgentVisualState {
    if (!AgentVisualState.instance) {
      AgentVisualState.instance = new AgentVisualState();
    }
    return AgentVisualState.instance;
  }

  public setMetadata(agentId: string, metadata: Partial<IAgentVisualMetadata>): void {
    const existing = this.metadataMap.get(agentId) || { agentId };
    const updated = { ...existing, ...metadata, agentId };
    this.metadataMap.set(agentId, updated);
    console.debug(`[AgentVisualState] Updated metadata for ${agentId}:`, updated);
  }

  public getMetadata(agentId: string): IAgentVisualMetadata | undefined {
    return this.metadataMap.get(agentId);
  }

  public getAllMetadata(): IAgentVisualMetadata[] {
    return Array.from(this.metadataMap.values());
  }

  public removeMetadata(agentId: string): void {
    this.metadataMap.delete(agentId);
    console.debug(`[AgentVisualState] Removed metadata for ${agentId}`);
  }
}

export default AgentVisualState.getInstance();