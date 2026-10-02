import pytest

from src.core.config import AgentConfig


def test_defaults_offline():
    cfg = AgentConfig()
    assert cfg["offline_mode"] is True
    assert cfg["max_memory_mb"] == 512


def test_custom_and_get():
    cfg = AgentConfig({"max_memory_mb": 128, "quorum_size": 3})
    assert cfg.get("max_memory_mb") == 128
    assert cfg["quorum_size"] == 3


def test_invalid_memory():
    with pytest.raises(ValueError):
        AgentConfig({"max_memory_mb": 0})


def test_log_level():
    cfg = AgentConfig({"log_level": "debug"})
    import logging

    assert cfg.get_log_level() == logging.DEBUG
