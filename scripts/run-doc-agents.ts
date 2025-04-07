import { KnowledgeBase } from '../src/core/KnowledgeBase';
import { SelfHealingDocAgent, AgentLogicDocAgent } from '../src/core/RefactorDocAgents';

const kb = new KnowledgeBase();

const selfHealAgent = new SelfHealingDocAgent(kb);
const agentLogicAgent = new AgentLogicDocAgent(kb);

console.log('Running Self-Healing Documentation Agent...');
selfHealAgent.analyzeAndImprove();

console.log('Running Agent Logic Documentation Agent...');
agentLogicAgent.analyzeAndImprove();

console.log('Documentation agents completed.');