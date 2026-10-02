import pytest

from src.core.agent import DigitalDoubleAgent
from src.core.config import AgentConfig
from src.core.storage import StorageManager


@pytest.fixture
def sample_config():
    return AgentConfig(
        {
            "max_memory_mb": 512,
            "offline_mode": True,
            "quorum_size": 2,
        }
    )


@pytest.fixture
def sample_storage():
    return StorageManager(":memory:")


@pytest.fixture
def sample_agent(sample_config, sample_storage):
    return DigitalDoubleAgent("test_agent", sample_config, storage=sample_storage)


@pytest.fixture
def mock_model():
    class MockModel:
        def __call__(self, *args, **kwargs):
            return "mock_output"

    return MockModel()
