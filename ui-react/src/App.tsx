import React from 'react';
import logo from './logo.svg';
import { ChatBuilding } from './ChatBuilding';
import './App.css';

function App() {
  return (
    <div className="App">
      <ChatBuilding />
    </div>
  );
  return (
    <>
      <div className="App">
        <header className="App-header">
          <h1>Agent Dashboard</h1>
          <AgentDashboard apiKey="YOUR_API_KEY" apiUrl="http://localhost:3000/api" />
          <h2>Task Manager</h2>
          <TaskManager onSubmit={() => {}} />
          <h2>Metrics</h2>
          <MetricsChart metrics={[]} />
        </header>
      </div>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </>
  );
}

export default App;
