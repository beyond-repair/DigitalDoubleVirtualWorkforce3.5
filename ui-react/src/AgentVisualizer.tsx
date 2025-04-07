import React, { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import AgentVisualState from '../../src/ui/building/AgentVisualState';
import { BuildingView } from '../../src/ui/building/BuildingView';

const AgentVisualizer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const containerId = 'agent-visualizer-container';
    containerRef.current.id = containerId;

    const bridge = new (class {
      private view: BuildingView;

      constructor(containerId: string) {
        this.view = new BuildingView(containerId);
      }

      public initialize(): void {
        console.debug('[AgentVisualizerBridge] Initializing visualization bridge');

        const socket = io('http://localhost:3000'); // Adjust URL as needed

        socket.on('agentCreated', ({ agentId, metadata }) => {
          AgentVisualState.setMetadata(agentId, metadata);
          this.view.render();
        });

        socket.on('statusChanged', ({ agentId, status }) => {
          const meta = AgentVisualState.getMetadata(agentId) || {};
          AgentVisualState.setMetadata(agentId, { ...meta, status });
          this.view.render();
        });

        socket.on('taskAssigned', ({ agentId, taskId }) => {
          console.debug(`[Socket] Task assigned: ${taskId} to ${agentId}`);
          this.view.render();
        });

        socket.on('taskCompleted', ({ agentId, taskId }) => {
          console.debug(`[Socket] Task completed: ${taskId} by ${agentId}`);
          this.view.render();
        });
      }
    })(containerId);

    bridge.initialize();
  }, []);

  return <div ref={containerRef} style={{ width: 400, height: 400, border: '1px solid #ccc' }} />;
};

export default AgentVisualizer;