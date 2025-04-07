# Multi-Agent Orchestrator Documentation

## Overview
This system implements a multi-agent orchestration framework with autonomous agents collaborating via a message broker (Redis pub/sub). It supports agent registration, subtask optimization, fallback handling, and standardized message routing.

---

## Architecture

### Components

- **MultiAgentOrchestrator**: Core orchestrator coordinating all components, managing Redis pub/sub, startup, and shutdown.
- **AgentRegistry**: Maintains a mapping of agent names to callable functions.
- **MessageRouter**: Handles message dispatching, error handling, and fallback routing.
- **PluginAdapterManager**: Provides unified access to plugin adapters (Docker, Git, CI/CD, API, System Control).
- **TaskOptimizer**: Placeholder for adaptive subtask decomposition and workflow optimization.
- **ErrorManager**: Centralized error handling, escalation, and retry management.
- **Agents**:
  - **Planner**: Decomposes goals into subtasks.
  - **Coder**: Generates code based on task descriptions.
  - **Tester**: Simulates testing of generated code.
  - **Integrator**: Integrates or rejects code based on test results.
- **Redis Pub/Sub**: Message broker for asynchronous communication.

---

## Message Schema

All messages are JSON objects with the following fields:

```json
{
  "sender": "agent_name",
  "recipient": "agent_name",
  "task": "task_type",
  "payload": { "key": "value" },
  "status": "pending|success|failed"
}
```

---

## Orchestrator Details

- **Agent Registration**: Agents are registered with `orchestrator.registry.register(name, function)`.
- **Message Routing**: Incoming messages are dispatched to the recipient agent.
- **Fallback Handling**: If an agent fails or is missing, fallback logic marks the message as failed.
- **Subtask Optimization**: Placeholder for future task decomposition improvements.
- **Startup**: The orchestrator listens on a Redis channel and dispatches an initial goal message.

---

## Agent Implementations

- **Planner Agent**
  - Receives a goal.
  - Generates subtasks (e.g., "Write code", "Test code").
  - Sends subtasks to the coder agent.

- **Coder Agent**
  - Receives a task description.
  - Generates code snippet.
  - Sends code to the tester agent.

- **Tester Agent**
  - Receives code.
  - Simulates test result.
  - Sends result to the integrator agent.

- **Integrator Agent**
  - Receives code and test result.
  - Integrates code if tests pass.
  - Logs failure otherwise.

---

## Setup Instructions

### Prerequisites
- Python 3.7+
- Redis server running locally on port 6379
- Python packages:
  ```
  pip install redis
  ```

### Running Redis
- **Windows**: Use Redis for Windows or Docker container.
- **Linux/macOS**: `redis-server` command.

### Running the Orchestrator
From the project root:

```
python agents/core/multi_agent_orchestrator.py
```

The orchestrator will:
- Start listening for messages.
- Send an initial goal to the planner.
- Trigger a multi-agent workflow.

---

## Extending the System

- **Add new agents**: Implement a function and register it.
- **Improve fallback**: Extend `ErrorManager` with retries, escalation, or alternative routing.
- **Enhance optimization**: Implement smarter subtask decomposition in `TaskOptimizer`.
- **Integrate persistent memory**: Connect to databases or vector stores.
- **Leverage plugin adapters**: Use `PluginAdapterManager` to invoke Docker, Git, CI/CD, API, or system control plugins dynamically.
- **Visualize workflows**: Extend the frontend UI components.

---

## Troubleshooting

- **Redis connection error**: Ensure Redis server is running on `localhost:6379`.
- **ModuleNotFoundError**: Install missing Python packages.
- **Agent errors**: Check agent function implementations and message formats.

---

## License
This orchestrator is part of the Digital Double Virtual Workforce project.