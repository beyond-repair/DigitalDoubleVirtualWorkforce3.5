# Digital Double Virtual Workforce 3.5 - API Reference (Stub)

---

## System Control Endpoints

- `POST /control/type` - Simulate keyboard input
- `POST /control/mouse` - Simulate mouse actions
- `POST /control/launch` - Launch an application
- `POST /control/close` - Close an application
- `POST /control/script` - Execute OS-level script
- `POST /control/screenshot` - Capture screenshot

---

## Agent Orchestration Endpoints

- `POST /agents/start` - Start agent workflow
- `POST /agents/stop` - Stop agent workflow
- `GET /agents/status` - Get agent status
- `POST /agents/message` - Send message to agent

---

## Model Management Endpoints

- `POST /models/register` - Register new model version
- `GET /models/status` - Get model status
- `POST /models/predict` - Submit prediction request

---

## TODO

- Add request/response schemas
- Add authentication details
- Add error codes and examples
- Add plugin adapter endpoints