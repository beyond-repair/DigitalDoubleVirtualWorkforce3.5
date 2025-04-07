# Plugin Adapter Development Guide

---

## Overview

Plugin adapters extend the Digital Double Virtual Workforce 3.5 by integrating external tools, services, and APIs into autonomous workflows. They enable agents to automate complex tasks across diverse environments.

---

## Supported & Planned Adapters

- **DockerAdapter:** Manage containers, images, networks.
- **GitAdapter:** Clone, commit, push, pull repositories.
- **CICDAdapter:** Trigger builds, deployments, monitor pipelines.
- **APIAdapter:** Connect to arbitrary REST APIs.
- **SystemControlAdapter:** OS-level automation (keyboard, mouse, apps, scripts, screenshots).
- **ZapierAdapter (Planned):** Connect to third-party apps via Zapier.
- **Custom Plugins:** Easily extendable for new tools.

---

## Design Principles

- **Event-Driven:** Communicate via Redis pub/sub channels for decoupled, scalable workflows.
- **Async APIs:** All plugin methods are asynchronous.
- **Security-First:** Enforce RBAC, audit logging, allowlists.
- **Extensible:** Add new adapters with minimal changes.
- **Language Interoperability:** Implemented in both TypeScript and Python layers.

---

## Example Method Signatures

```typescript
interface DockerAdapter {
  startContainer(containerId: string): Promise<void>;
  stopContainer(containerId: string): Promise<void>;
  listContainers(): Promise<ContainerInfo[]>;
}

interface GitAdapter {
  cloneRepo(url: string, dest: string): Promise<void>;
  commitChanges(message: string): Promise<void>;
  pushChanges(): Promise<void>;
}

interface CICDAdapter {
  triggerBuild(pipelineId: string): Promise<BuildResult>;
  getBuildStatus(buildId: string): Promise<BuildStatus>;
}

interface APIAdapter {
  callEndpoint(url: string, method: string, data?: any): Promise<any>;
}

interface SystemControlAdapter {
  simulateInput(type: 'keyboard' | 'mouse', data: any): Promise<void>;
  launchApp(appName: string): Promise<void>;
  closeApp(appName: string): Promise<void>;
  runScript(scriptPath: string): Promise<void>;
  captureScreenshot(): Promise<Buffer>;
}
```

---

## Event-Driven Workflow

- **Command Dispatch:** Agents publish plugin commands to Redis channels.
- **Plugin Listener:** Adapters subscribe, execute commands, and publish results.
- **Result Handling:** Agents consume results and continue workflows.
- **Audit Logging:** All commands and results are logged for traceability.

---

## Security Considerations

- **Role-Based Access Control (RBAC):** Restrict plugin capabilities by agent role.
- **Audit Logs:** Record all plugin interactions.
- **Allowlist:** Limit accessible apps, scripts, endpoints.
- **User Confirmations:** Optional manual approval for sensitive actions.
- **Sandboxing:** Isolate plugin execution environments.

---

## Implementation Roadmap

- Implement core adapters (Docker, Git, CI/CD, API, System Control).
- Add Redis event handling and message schemas.
- Develop unit and integration tests.
- Document security policies and usage examples.
- Extend with Zapier and custom plugins.
- Harden security and audit features.

---

## Usage Example

1. **Agent publishes command:**

```json
{
  "plugin": "GitAdapter",
  "action": "cloneRepo",
  "params": {
    "url": "https://github.com/example/repo.git",
    "dest": "/workspace/repo"
  }
}
```

2. **Adapter executes and publishes result:**

```json
{
  "status": "success",
  "details": "Repository cloned successfully."
}
```

---

## Summary

Plugin adapters enable seamless, secure, and extensible integration of external tools into autonomous agent workflows, supporting complex, event-driven automation across diverse environments.

---