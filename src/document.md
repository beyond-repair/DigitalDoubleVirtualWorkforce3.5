# Autonomous Project Development Protocol

## Core Directive
Continue building one fully-functional module at a time with full documentation and test coverage. Do not pause development until every component is complete. Follow modular naming, progressive CI/CD integrity, and consistent documentation updates.

## Methodology
- **Modular Builds:** Complete one module fully—including tests and documentation—before moving on.
- **Auto-Linked Updates:** Each section reflects the current state of its respective source file via inline doc anchors.
- **Dynamic Task Chain:** Inject new tasks inline using:
  > Build [describe functionality] with [key requirements]. Ensure it is modular, scalable, and optimized for real-world constraints.

## Architecture Overview

### Core Logic (src/core/)
- **MLService**: Handles ML operations, inference, data processing.
- **ModelTracker**: Tracks training, deployment, performance.
- **AnalyticsService**: Aggregates and analyzes metrics.
- **ResourceGovernor**: Manages resource allocation.
- **PolicyManager**: Manages policies, access, compliance.

### API Layer (src/api/)
- Express server, REST endpoints, real-time communication.

### UI Layer (ui-react/)
- React frontend, visualization, controls.

### Interfaces & Types
- Shared TypeScript interfaces and types.

### Modules (src/modules/)
- Additional features and integrations.

### Tests (tests/)
- Jest and PyTest for unit and integration tests.

## CI/CD Integration
- Enforce doc updates in pull requests.
- Automate testing workflows.
- Link roadmap checkboxes to issue tracker.

---

This document is the **live brain** of the project, continuously updated with real-time progress and upcoming tasks.
