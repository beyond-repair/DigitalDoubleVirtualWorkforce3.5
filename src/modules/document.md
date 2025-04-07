# Modules - Digital Double Virtual Workforce 3.5

---

## Overview

The `src/modules/` directory contains modular components that extend the core capabilities of the Digital Double Virtual Workforce 3.5. These modules enable integration with external tools, services, and APIs, as well as specialized functionalities like ML and payment processing.

---

## Directory Structure

```
modules/
├── exampleModule.ts            # Task management example
├── lead_ai/
│   ├── ml_service.py           # ML service (legacy)
│   └── document.md             # ML module documentation
├── payment/
│   ├── paypalService.d.ts
│   ├── paypalService.js
│   └── document.md             # Payment module documentation
├── plugin_integration/
│   ├── DockerAdapter.ts
│   ├── GitAdapter.ts
│   ├── CICDAdapter.ts
│   ├── APIAdapter.ts
```

---

## Module Summaries

### Task Management Module (`exampleModule.ts`)
- Implements `TaskManager` class.
- Manages lifecycle of complex task objects.
- Fully covered by tests.
- Integrates with agent orchestration.

### Lead AI Module (`lead_ai/`)
- Provides ML services for workload prediction and analytics.
- Legacy Python implementation; migrating to TypeScript core.
- Integrates with `ModelTracker` and `MLService`.

### Payment Module (`payment/`)
- Integrates with PayPal REST API.
- Handles payment creation and management.
- Provides type definitions and async API.
- Extensible for other payment providers.

### Plugin Integration Modules (`plugin_integration/`)
- **DockerAdapter:** Manage containers, images, networks.
- **GitAdapter:** Clone, commit, push, pull repositories.
- **CICDAdapter:** Trigger builds, deployments, monitor pipelines.
- **APIAdapter:** Connect to arbitrary REST APIs.
- Event-driven, async, and secure.
- Extensible for new plugins (Zapier, custom APIs).

---

## Design Principles

- **Modularity:** Each module is self-contained and well-documented.
- **Extensibility:** Easily add new modules or extend existing ones.
- **Security:** Enforce RBAC, audit logs, and allowlists.
- **Event-Driven:** Use Redis pub/sub for decoupled workflows.
- **Async APIs:** Support non-blocking operations.

---

## Cross-References

- **Core Architecture:** See [../document.md](../../document.md)
- **Plugin Adapters:** See [../../docs/plugin_adapters.md](../../docs/plugin_adapters.md)
- **System Architecture:** See [../../docs/system_architecture.md](../../docs/system_architecture.md)

---

## Guidelines

- Follow project coding and documentation standards.
- Update module docs alongside code changes.
- Write unit and integration tests for all modules.
- Use async patterns and error handling best practices.

---

## Summary

Modules extend the Digital Double Virtual Workforce 3.5 with specialized, secure, and extensible capabilities, enabling seamless integration with external tools, ML services, and payment systems within autonomous workflows.

---