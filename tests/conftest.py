import pytest
from src.core.agent import DigitalDoubleAgent
from src.core.config import AgentConfig

@pytest.fixture
def sample_config():
    return AgentConfig({
        'max_memory_mb': 512,
        'offline_mode': True
    })

@pytest.fixture
def sample_agent(sample_config):
    return DigitalDoubleAgent("test_agent", sample_config)

@pytest.fixture
def mock_model():
    class MockModel:
        def __call__(self, *args, **kwargs):
            return "mock_output"
    return MockModel()