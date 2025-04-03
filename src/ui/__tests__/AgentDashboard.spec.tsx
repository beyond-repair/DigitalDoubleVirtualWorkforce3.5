import { render, screen, waitFor } from '@testing-library/react';
import { AgentDashboard } from '../components/AgentDashboard';

describe('AgentDashboard', () => {
  const mockProps = {
    apiKey: 'test-key',
    apiUrl: 'http://localhost:3000/api/v1'
  };

  it('should display agents when loaded successfully', async () => {
    const mockAgents = [
      { id: 'agent1', status: 'IDLE', metrics: { cpuUsage: 0, memoryUsage: 0 } }
    ];

    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: mockAgents })
    });

    render(<AgentDashboard {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('agent1')).toBeInTheDocument();
    });
  });
});
