# Digital Double Virtual Workforce 3.5

## Project Overview

Edge-ready AI agent framework optimized for industrial deployment.
- Version: 3.5.0
- Status: Active Development
- Repository: github.com/digital-double/virtual-workforce

## Development Guidelines

### File Structure
```
src/
  ├── core/           # Core system components
  │   ├── agent/     # Agent implementation
  │   ├── ml/        # Machine learning modules
  │   └── utils/     # Shared utilities
  ├── modules/       # Feature modules
  └── interfaces/    # Type definitions
```

### Version Control
- Branch Format: `<type>/<module>/<description>`
  - feature/ml/quantization
  - bugfix/agent/memory-leak
- Commit Format: `<type>(<scope>): <subject>`
  - feat(ml): implement dynamic quantization
  - fix(agent): resolve memory leak
- Release Tags: `v[X.Y.Z]`

### Development Workflow
1. Document changes in document.md
2. Create feature branch
3. Implement tests (90% coverage)
4. Write code following standards
5. Update documentation
6. Submit PR with changelog

### Current Module Status
## Module: TaskManager

### Purpose
Manages lifecycle of tasks within the virtual workforce, including creation, assignment, status updates, retrieval, and removal.

### Location
- Implementation: `src/modules/exampleModule.ts`
- Interface: `src/interfaces/ITask.ts`
- Tests: `tests/modules/TaskManager.test.ts`

### Key Features
- Create tasks with unique IDs, priority, and payload
- Assign tasks to agents
- Update task status (Pending, Assigned, Running, Completed, Failed)
- Retrieve tasks (all, by ID, by status)
- Remove tasks
- Clear all tasks

### API Overview
```typescript
const manager = new TaskManager();

// Create a task
const task = manager.createTask({ foo: 'bar' }, TaskPriority.HIGH);

// Assign task
manager.assignTask(task.id, 'agent-123');

// Update status
manager.updateTaskStatus(task.id, TaskStatus.RUNNING);

// Get tasks
const allTasks = manager.getTasks();
const runningTasks = manager.getTasksByStatus(TaskStatus.RUNNING);

// Remove task
manager.removeTask(task.id);

// Clear all
manager.clearTasks();
```

### Design Notes
- Uses enums `TaskPriority` and `TaskStatus` for clarity and type safety.
- Stores timestamps (`createdAt`, `updatedAt`) for auditability.
- Generates unique IDs internally.

### Contributor Guidance
- Extend `ITask` interface if new metadata is required.
- Maintain atomic commits tied to specific feature additions or fixes.
- Update this documentation with any API changes.
- Ensure tests cover new features with >90% coverage.

---

- [x] Project Structure: Reorganized
- [ ] ML Services: Implementing quantization
- [ ] Testing: Setting up framework
- [ ] CI/CD: Configuration pending

### Immediate Tasks
1. Implement model quantization system
   - Hardware-aware scaling
   - Automatic fallback mechanisms
   - Performance monitoring
2. Set up testing framework
   - Unit tests for ML services
   - Integration tests for agent system
   - Performance benchmarks
3. Configure CI/CD pipeline
   - Automated testing
   - Code quality checks
   - Documentation updates

## Development Standards

### Current Module Status
- [ ] Core Agent: In Progress
- [ ] ML Services: Consolidation
- [ ] Documentation: Updating
- [ ] Testing: Setup

## Next Task
"Build dynamic model quantization system with hardware-aware scaling and failover mechanisms. Ensure it is modular, scalable, and optimized for edge deployment."

## Weekly Sync Checklist
- [ ] Module integration status
- [ ] Test coverage report
- [ ] Documentation updates
- [ ] Performance metrics
- [ ] Compliance verification
## Pixelated Building UI Module

### Overview
A modular visualization system to display agents as pixelated avatars within a building metaphor, supporting room layouts and dynamic updates.

### Components
- **`src/interfaces/IAgentVisualMetadata.ts`**: Defines visualization metadata (avatar, position, room, UI state).
- **`src/ui/building/AgentVisualState.ts`**: Singleton state manager for agent visualization metadata with debug logging.
- **`src/ui/building/BuildingView.ts`**: Renderer that visualizes agents as pixelated divs positioned within a container.
- **`src/ui/building/RoomLayout.ts`**: Manages room definitions, agent-room assignments, and spatial layout.

### Design Principles
- Fully modular, each component isolated for maintainability.
- Extensible to support animations, interactivity, and real-time updates.
- Decoupled from core agent logic, integrates via metadata/state.

### Next Steps
- Enhance `BuildingView` with Canvas/WebGL rendering.
- Add interactivity (hover tooltips, selection, drag-and-drop).
- Integrate with live agent lifecycle events.
- Expand documentation and contributor guidelines.


## AgentVisualizerBridge Module

### Purpose
A dedicated integration layer that connects the core agent framework with the pixelated building UI, enabling real-time visualization of live agent activity.

### Location
`src/ui/building/AgentVisualizerBridge.ts`

### Responsibilities
- Subscribe to agent lifecycle events (creation, task assignment, completion, status change).
- Update visualization metadata (`AgentVisualState`) dynamically.
- Trigger UI re-renders to reflect live agent behavior.
- Remain decoupled from both core logic and UI rendering for modularity.

### Design Principles
- Modular and isolated for maintainability.
- Extensible to support more event types and richer visualization.
- Prepared for integration with real agent event emitters.

### Next Steps
- Connect to `AgentService` and `TaskExecutionAgent` event emitters.
- Replace mock/simulated updates with real-time data.
- Animate agent movements based on task execution.
- Document integration protocols and update contributor guide.

