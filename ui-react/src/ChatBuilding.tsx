import React from 'react';
import './App.css';

export function ChatBuilding() {
  return (
    <div className="chat-building">
      <div className="main-model-avatar">
        <p>Main Model</p>
      </div>
      <div className="chat-window">
        <p>Chat will appear here...</p>
      </div>
      <div className="agent-area">
        <div className="agent-group">
          <h3>Design Agents</h3>
          <div className="agent-avatar">🎨</div>
          <div className="agent-avatar">🎨</div>
        </div>
        <div className="agent-group">
          <h3>Code Agents</h3>
          <div className="agent-avatar">💻</div>
          <div className="agent-avatar">💻</div>
        </div>
        <div className="agent-group">
          <h3>Test Agents</h3>
          <div className="agent-avatar">🧪</div>
          <div className="agent-avatar">🧪</div>
        </div>
      </div>
    </div>
  );
}