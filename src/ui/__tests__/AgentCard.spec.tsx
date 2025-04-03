import { render, screen } from '@testing-library/react';
import { AgentCard } from '../components/AgentCard';
import { IAgentStatus } from '../../api/interfaces/api.interface';

describe('AgentCard', () => {
  const mockAgent: IAgentStatus = {
    id: 'test-agent',
    status: 'IDLE',
    metrics: {
      cpuUsage: 25,
      memoryUsage: 512,
      activeThreads: 2,
      timestamp: Date.now()
    },
    taskCount: 5
  };

  it('should display agent information', () => {
    render(<AgentCard agent={mockAgent} />);
    expect(screen.getByText('test-agent')).toBeInTheDocument();
    expect(screen.getByText('Tasks: 5')).toBeInTheDocument();
  });
});
