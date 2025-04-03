import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { IAgentStatus } from '../../api/interfaces/api.interface';
import { MetricsChart } from './MetricsChart';

interface AgentCardProps {
  agent: IAgentStatus;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const getStatusColor = (status: string): string => {
    const colors = {
      IDLE: '#4caf50',
      BUSY: '#2196f3',
      ERROR: '#f44336',
      OFFLINE: '#9e9e9e'
    };
    return colors[status as keyof typeof colors] || colors.OFFLINE;
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{agent.id}</Typography>
          <Box 
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: getStatusColor(agent.status)
            }}
          />
        </Box>
        <MetricsChart metrics={agent.metrics} />
        <Typography>Tasks: {agent.taskCount}</Typography>
      </CardContent>
    </Card>
  );
};
