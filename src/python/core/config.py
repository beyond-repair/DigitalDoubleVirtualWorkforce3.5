from typing import Dict, Any
from dotenv import load_dotenv
import logging


# Load environment variables from .env file if present
load_dotenv()


class AgentConfig:
    """Configuration handler for Digital Double agents."""
    
    DEFAULT_CONFIG = {
        'max_memory_mb': 512,
        'max_tasks': 100,
        'offline_mode': False,
        'model_cache_dir': 'model_cache',
        'task_queue_db': 'tasks.db',
        'log_level': 'INFO'
    }

    def __init__(self, custom_config: Dict[str, Any] = None):
        """Initialize configuration with defaults and custom values."""
        self.config = self.DEFAULT_CONFIG.copy()
        if custom_config:
            self.config.update(custom_config)
        self._validate_config()
        
    def _validate_config(self):
        """Validate configuration values."""
        if (not isinstance(self.config['max_memory_mb'], int) or
                self.config['max_memory_mb'] <= 0):
            raise ValueError("max_memory_mb must be a positive integer")
            
        if (not isinstance(self.config['max_tasks'], int) or
                self.config['max_tasks'] <= 0):
            raise ValueError("max_tasks must be a positive integer")
            
    def get_log_level(self) -> int:
        """Convert log level string to logging constant."""
        log_level = self.config.get('log_level', 'INFO').upper()
        return getattr(logging, log_level, logging.INFO)

    def __getitem__(self, key: str) -> Any:
        """Allow dictionary-style access to config values."""
        return self.config[key]

    def __setitem__(self, key: str, value: Any):
        """Allow dictionary-style setting of config values."""
        self.config[key] = value
        self._validate_config()

    def get(self, key: str, default: Any = None) -> Any:
        """Get config value with optional default."""
        return self.config.get(key, default)