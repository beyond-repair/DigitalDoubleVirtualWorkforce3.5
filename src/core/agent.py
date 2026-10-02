from __future__ import annotations

import logging
import uuid
from typing import Any, Dict, List, Optional

from .config import AgentConfig
from .rules import RuleManager, ValidationRule
from .storage import StorageManager


class DigitalDoubleAgent:
    """Offline Claim-0 agent: enqueue/validate/run local tasks only."""

    def __init__(
        self,
        name: str,
        config: Optional[AgentConfig] = None,
        storage: Optional[StorageManager] = None,
        rules: Optional[RuleManager] = None,
    ):
        self.name = name
        self.config = config or AgentConfig({"offline_mode": True})
        self.logger = logging.getLogger(f"ddvw.agent.{name}")
        db = self.config.get("task_queue_db", ":memory:")
        if storage is not None:
            self.storage = storage
        else:
            # Prefer in-memory for demos unless an explicit path is set
            path = ":memory:" if db in (None, "", "tasks.db") and self.config.get("offline_mode") else db
            if self.config.get("offline_mode") and db == "tasks.db":
                path = ":memory:"
            self.storage = StorageManager(path)
        self.rules = rules or RuleManager()
        self._ensure_default_rules()
        self.completed: List[str] = []
        self.memory_usage_mb = 0

    def _ensure_default_rules(self) -> None:
        if "empty_description" in self.rules.rules:
            return
        self.rules.register_rule(
            ValidationRule(
                name="empty_description",
                description="Task description must be non-empty",
                severity="error",
            ),
            lambda data: not str(data.get("description", "")).strip(),
        )
        self.rules.register_rule(
            ValidationRule(
                name="memory_budget",
                description="Estimated memory exceeds agent budget",
                severity="warning",
            ),
            lambda data: int(data.get("est_memory_mb", 0))
            > int(self.config.get("max_memory_mb", 512)),
        )

    def submit_task(self, description: str, **extra: Any) -> Dict[str, Any]:
        tasks = self.storage.list_tasks()
        if len(tasks) >= int(self.config.get("max_tasks", 100)):
            raise RuntimeError("max_tasks reached")
        payload = {"description": description, "agent": self.name, **extra}
        triggered = self.rules.evaluate_rules(payload)
        if "empty_description" in triggered:
            raise ValueError("task description required")
        task_id = str(uuid.uuid4())
        status = "rejected" if "memory_budget" in triggered else "pending"
        self.storage.store_task(task_id, payload, status=status)
        self.logger.info("submitted task %s status=%s triggered=%s", task_id, status, triggered)
        return {"id": task_id, "status": status, "triggered_rules": triggered, "data": payload}

    def run_pending(self) -> List[Dict[str, Any]]:
        """Execute pending tasks locally (echo result; no LLM/cloud)."""
        results: List[Dict[str, Any]] = []
        for task in self.storage.list_tasks():
            if task["status"] != "pending":
                continue
            est = int(task["data"].get("est_memory_mb", 32))
            budget = int(self.config.get("max_memory_mb", 512))
            if self.memory_usage_mb + est > budget:
                self.storage.update_status(task["id"], "deferred")
                results.append({**task, "status": "deferred", "result": None})
                continue
            result = {
                "echo": task["data"].get("description"),
                "agent": self.name,
                "offline": bool(self.config.get("offline_mode")),
            }
            self.storage.update_status(task["id"], "done")
            self.memory_usage_mb += est
            self.completed.append(task["id"])
            results.append({**task, "status": "done", "result": result})
        return results

    def status(self) -> Dict[str, Any]:
        tasks = self.storage.list_tasks()
        by_status: Dict[str, int] = {}
        for t in tasks:
            by_status[t["status"]] = by_status.get(t["status"], 0) + 1
        return {
            "name": self.name,
            "offline_mode": bool(self.config.get("offline_mode")),
            "memory_usage_mb": self.memory_usage_mb,
            "max_memory_mb": self.config.get("max_memory_mb"),
            "task_counts": by_status,
            "completed": list(self.completed),
        }
