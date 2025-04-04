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

This file provides an example module structure and functionality, specifically demonstrating a simple `TaskManager` class for managing a list of tasks.

#### Class: `TaskManager`

-   **Purpose**: Manages a list of tasks (strings).
-   **Exported**: Yes

##### Attributes

-   **`tasks: string[]`** (Private, Line 7): An array to store the task strings. Initialized as an empty array in the constructor.

##### Methods

-   **`constructor()`** (Lines 12-14)
    -   **Purpose**: Initializes a new instance of the `TaskManager`.
    -   **Logic**: Sets the private `tasks` attribute to an empty array.
-   **`addTask(task: string): void`** (Lines 20-22)
    -   **Purpose**: Adds a new task string to the internal list.
    -   **Parameters**:
        -   `task: string`: The task description to add.
    -   **Returns**: `void`.
    -   **Logic**: Uses the `push` method to add the `task` to the `this.tasks` array.
-   **`getTasks(): string[]`** (Lines 28-30)
    -   **Purpose**: Retrieves the current list of all tasks.
    -   **Parameters**: None.
    -   **Returns**: `string[]`: A copy of the internal `tasks` array.
    -   **Logic**: Returns the `this.tasks` array.
-   **`clearTasks(): void`** (Lines 35-37)
    -   **Purpose**: Removes all tasks from the list.
    -   **Parameters**: None.
    -   **Returns**: `void`.
    -   **Logic**: Resets the `this.tasks` array to an empty array.

### File: `README.md`

-   **Purpose**: Provides a brief overview and guidelines for the modules directory. Its content has been incorporated into this `document.md` file.

## Sub-Modules

### Module: `lead_ai`

-   **Purpose**: Focuses on machine learning capabilities related to lead generation or management.
-   **Documentation**: See [./lead_ai/document.md](./lead_ai/document.md)

### Module: `payment`

-   **Purpose**: Handles payment processing, specifically integrating with PayPal.
-   **Documentation**: See [./payment/document.md](./payment/document.md)