from __future__ import annotations

from typing import Any, Dict, Optional
import logging

try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:  # pragma: no cover - optional dependency
    pass


class AgentConfig:
    """Configuration handler for Digital Double agents."""

    DEFAULT_CONFIG: Dict[str, Any] = {
        "max_memory_mb": 512,
        "max_tasks": 100,
        "offline_mode": True,
        "model_cache_dir": "model_cache",
        "task_queue_db": "tasks.db",
        "log_level": "INFO",
        "quorum_size": 2,
    }

    def __init__(self, custom_config: Optional[Dict[str, Any]] = None):
        self.config = self.DEFAULT_CONFIG.copy()
        if custom_config:
            self.config.update(custom_config)
        self._validate_config()

    def _validate_config(self) -> None:
        if not isinstance(self.config["max_memory_mb"], int) or self.config["max_memory_mb"] <= 0:
            raise ValueError("max_memory_mb must be a positive integer")
        if not isinstance(self.config["max_tasks"], int) or self.config["max_tasks"] <= 0:
            raise ValueError("max_tasks must be a positive integer")
        if not isinstance(self.config["quorum_size"], int) or self.config["quorum_size"] < 1:
            raise ValueError("quorum_size must be a positive integer")

    def get_log_level(self) -> int:
        log_level = str(self.config.get("log_level", "INFO")).upper()
        return getattr(logging, log_level, logging.INFO)

    def __getitem__(self, key: str) -> Any:
        return self.config[key]

    def __setitem__(self, key: str, value: Any) -> None:
        self.config[key] = value
        self._validate_config()

    def get(self, key: str, default: Any = None) -> Any:
        return self.config.get(key, default)
