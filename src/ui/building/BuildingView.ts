import AgentVisualState from './AgentVisualState';
import { IAgentVisualMetadata } from '../../interfaces/IAgentVisualMetadata';

export class BuildingView {
  private containerId: string;

  constructor(containerId: string) {
    this.containerId = containerId;
  }

  public render(): void {
    const metadataList: IAgentVisualMetadata[] = AgentVisualState.getAllMetadata();
    console.debug('[BuildingView] Rendering agents:', metadataList);

    // Placeholder: replace with Canvas or DOM rendering logic
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.warn(`[BuildingView] Container element #${this.containerId} not found`);
      return;
    }

    container.innerHTML = ''; // Clear previous content

    metadataList.forEach((meta) => {
      const agentDiv = document.createElement('div');
      agentDiv.style.width = '20px';
      agentDiv.style.height = '20px';
      agentDiv.style.position = 'absolute';
      agentDiv.style.left = meta.position ? `${meta.position.x}px` : '0px';
      agentDiv.style.top = meta.position ? `${meta.position.y}px` : '0px';
      agentDiv.style.backgroundColor = '#ff0'; // bright yellow for visibility
      agentDiv.style.border = '2px solid red'; // high contrast border
      agentDiv.style.zIndex = '10';
      agentDiv.style.boxSizing = 'border-box';
      agentDiv.title = meta.agentId;
      container.appendChild(agentDiv);
    });
  }
}