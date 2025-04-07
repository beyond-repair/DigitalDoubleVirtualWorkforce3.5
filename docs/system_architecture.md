# Digital Double Virtual Workforce 3.5 - System Architecture

---

## High-Level Architecture Diagram

```mermaid
flowchart TD
    subgraph Frontend
        A1[Pixel-Art React UI]
        A2[Chat Interface]
        A3[Workflow Editor (Planned)]
    end

    subgraph API_Server
        B1[REST API]
        B2[WebSockets]
    end

    subgraph MultiAgent_TS
        C1[Agent Orchestrator]
        C2[Role Agents]
        C3[PluginAdapters_TS]
        C4[SelfHealingManager]
        C5[MLService]
        C6[ModelTracker]
    end

    subgraph Python_Backend
        D1[Local AI Model API]
        D2[MultiAgentOrchestrator_Py]
        D3[SystemControlAdapter]
        D4[PluginAdapters_Py]
    end

    subgraph Redis
        E1[Pub/Sub Channels]
    end

    %% Frontend to API
    A1 --> B1
    A2 --> B1
    A3 --> B1

    %% API to TS backend
    B1 --> C1
    B2 --> C1

    %% TS backend internal
    C1 --> C2
    C1 --> C3
    C1 --> C4
    C4 --> C5
    C5 --> C6

    %% Redis communication
    C1 --> E1
    C3 --> E1
    E1 --> D2
    E1 --> D3
    E1 --> D4
    D2 --> E1
    D3 --> E1
    D4 --> E1

    %% Python backend
    D1 --> D2
    D2 --> D3
    D2 --> D4
```

---

## Components

### Frontend
- **Pixel-Art React UI:** Visualizes agents, workflows, and chat.
- **Chat Interface:** User commands and feedback.
- **Workflow Editor:** Planned drag-and-drop workflow builder.

### API Server
- **REST API:** Command and data interface.
- **WebSockets:** Real-time updates and event streaming.

### TypeScript Backend
- **Agent Orchestrator:** Coordinates multi-agent workflows.
- **Role Agents:** Planner, researcher, coder, messenger, execution, creative, file.
- **PluginAdapters_TS:** Docker, Git, CI/CD, APIs, System Control.
- **SelfHealingManager:** Detects and corrects faults.
- **MLService:** Predicts faults, optimizes workflows.
- **ModelTracker:** Tracks model versions and performance.

### Python Backend
- **Local AI Model API:** Llama.cpp-based inference.
- **MultiAgentOrchestrator_Py:** Additional orchestration logic.
- **SystemControlAdapter:** OS-level automation.
- **PluginAdapters_Py:** Python-based integrations.

### Redis
- **Pub/Sub Channels:** Event-driven communication between components.

---

## Data Flow Summary

- User interacts via chat or UI.
- API server routes commands to orchestrator.
- Orchestrator coordinates role agents and plugins.
- Plugins interact with external tools and APIs.
- Self-healing and ML modules monitor and optimize.
- Redis enables real-time, event-driven communication.
- Python backend handles AI inference and system control.
- Frontend updates in real-time via WebSockets.

---

## Notes

- Designed for modularity, extensibility, and resilience.
- Supports offline operation with local inference.
- Enables adaptive, autonomous workflows with minimal human input.
- Future plans include multi-modal input, visual workflow editing, and federated learning.

---