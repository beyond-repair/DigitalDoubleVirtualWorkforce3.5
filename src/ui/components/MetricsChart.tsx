import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { IResourceMetrics } from '../../core/interfaces/monitor.interface';

interface MetricsChartProps {
  metrics: IResourceMetrics;
}

export const MetricsChart: React.FC<MetricsChartProps> = ({ metrics }) => {
  return (
    <Box my={2}>
      <Typography variant="body2">CPU Usage</Typography>
      <LinearProgress 
        variant="determinate" 
        value={metrics.cpuUsage} 
        sx={{ mb: 1 }}
      />
      
      <Typography variant="body2">Memory Usage</Typography>
      <LinearProgress 
        variant="determinate" 
        value={(metrics.memoryUsage / 1024) * 100} 
        sx={{ mb: 1 }}
      />
      
      <Typography variant="body2">
        Active Threads: {metrics.activeThreads}
      </Typography>
    </Box>
  );
};
