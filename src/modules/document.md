# Directory: src/modules

This folder contains the core modules for the Digital Double Virtual Workforce project. Each module encapsulates specific functionalities.

## Directory Structure

```
modules/
├── exampleModule.ts
├── README.md             (Existing README, content incorporated below)
├── document.md           (This file)
├── lead_ai/
│   ├── ml_service.py
│   └── document.md       (Detailed documentation for lead_ai module)
└── payment/
    ├── paypalService.d.ts
    ├── paypalService.js
    └── document.md       (Detailed documentation for payment module)
```

## Guidelines (from README.md)

-   Each module should be self-contained and well-documented.
-   Follow the project's coding and documentation standards.

## Top-Level Files

### File: `exampleModule.ts`

#### Purpose

Implements the `TaskManager` class, a core module for managing the lifecycle of complex task objects within the virtual workforce system.

#### Class: `TaskManager`

- **Purpose:** Create, retrieve, assign, update, and remove structured task objects.
- **Exported:** Yes

##### Attributes

- **`tasks: ITask[]`** (Private): Array of task objects conforming to `ITask` interface, initialized empty.

##### Methods

- **`constructor()`**
  - Initializes an empty task list.
- **`createTask(data: unknown, priority: TaskPriority = TaskPriority.MEDIUM): ITask`**
  - Creates a new task with unique ID, timestamps, priority, and payload.
- **`getTasks(): ITask[]`**
  - Retrieves all tasks.
- **`getTaskById(id: string): ITask | undefined`**
  - Fetches a task by its unique ID.
- **`getTasksByStatus(status: TaskStatus): ITask[]`**
  - Filters tasks by their status.
- **`updateTaskStatus(id: string, status: TaskStatus): boolean`**
  - Updates the status of a task, returns success flag.
- **`assignTask(id: string, agentId: string): boolean`**
  - Assigns a task to an agent, updates status to `ASSIGNED`.
- **`removeTask(id: string): boolean`**
  - Removes a task by ID.
- **`clearTasks(): void`**
  - Clears all tasks.
- **`generateUniqueId(): string`** (private)
  - Generates a unique identifier string.

##### Data Model

- **`ITask` interface** (see `src/interfaces/ITask.ts`)
  - `id: string`
  - `priority: TaskPriority`
  - `status: TaskStatus`
  - `data: unknown`
  - `assignedAgent?: string`
  - `createdAt: Date`
  - `updatedAt: Date`

##### Enums

- **`TaskPriority`**: LOW, MEDIUM, HIGH, CRITICAL
- **`TaskStatus`**: PENDING, ASSIGNED, RUNNING, COMPLETED, FAILED

##### Testing

- Fully covered by `tests/modules/TaskManager.test.ts` with >90% coverage.
- Tests include creation, retrieval, status updates, assignment, removal, and clearing.

##### Integration Notes

- Designed to be integrated with agent lifecycle and scheduling components.
- Extendable by modifying `ITask` interface.
- Emits no side effects; pure in-memory management.

### File: `README.md`

-   **Purpose**: Provides a brief overview and guidelines for the modules directory. Its content has been incorporated into this `document.md` file.

## Sub-Modules

### Module: `lead_ai`

-   **Purpose**: Focuses on machine learning capabilities related to lead generation or management.
-   **Documentation**: See [./lead_ai/document.md](./lead_ai/document.md)

### Module: `payment`

-   **Purpose**: Handles payment processing, specifically integrating with PayPal.
-   **Documentation**: See [./payment/document.md](./payment/document.md)