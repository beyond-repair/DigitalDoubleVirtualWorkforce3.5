import React, { useState, useEffect } from 'react';
import { IAgentStatus } from '../../api/interfaces/api.interface';

interface DashboardProps {
  apiKey: string;
  apiUrl: string;
}

export const AgentDashboard: React.FC<DashboardProps> = ({ apiKey, apiUrl }) => {
  const [agents, setAgents] = useState<IAgentStatus[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchAgents = async (): Promise<void> => {
      try {
        const response = await fetch(`${apiUrl}/agents`, {
          headers: { 'x-api-key': apiKey }
        });
        const data = await response.json();
        if (data.success) {
          setAgents(data.data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch agents');
      }
    };

    const interval = setInterval(fetchAgents, 5000);
    return () => clearInterval(interval);
  }, [apiKey, apiUrl]);

  return (
    <div className="dashboard">
      {error && <div className="error">{error}</div>}
      <div className="agents-grid">
        {agents.map(agent => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
};
