import fs from 'fs';
import path from 'path';

/**
 * Loads and parses the dual knowledge bases for agents and self-healing modules.
 */
export class KnowledgeBase {
  private agentContent: string;
  private selfhealContent: string;

  constructor() {
    const projectRoot = path.resolve(__dirname, '../..');
    const agentPath = path.join(projectRoot, 'plain_agents.md');
    const selfhealPath = path.join(projectRoot, 'plain_selfheal.md');

    this.agentContent = fs.existsSync(agentPath) ? fs.readFileSync(agentPath, 'utf-8') : '';
    this.selfhealContent = fs.existsSync(selfhealPath) ? fs.readFileSync(selfhealPath, 'utf-8') : '';
  }

  /**
   * Get full agent knowledge base content
   */
  getAgentKnowledge(): string {
    return this.agentContent;
  }

  /**
   * Get full self-healing knowledge base content
   */
  getSelfHealingKnowledge(): string {
    return this.selfhealContent;
  }

  /**
   * Search agent knowledge base for a keyword
   */
  searchAgentKnowledge(keyword: string): string[] {
    return this.agentContent
      .split('\n')
      .filter(line => line.toLowerCase().includes(keyword.toLowerCase()));
  }

  /**
   * Search self-healing knowledge base for a keyword
   */
  searchSelfHealingKnowledge(keyword: string): string[] {
    return this.selfhealContent
      .split('\n')
      .filter(line => line.toLowerCase().includes(keyword.toLowerCase()));
  }
}