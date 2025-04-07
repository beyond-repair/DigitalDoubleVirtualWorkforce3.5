import sys
import pytest
from src.python.core.agent import DigitalDoubleAgent
from src.python.core.config import AgentConfig
from unittest.mock import patch


class DummyRedis:
    def __init__(self, *args, **kwargs):
        pass

    def publish(self, *args, **kwargs):
        return None


sys.modules['redis'] = type('redis', (), {'Redis': DummyRedis})


@pytest.fixture(autouse=True)
def mock_redis_client():
    with patch('redis.Redis') as mock_redis:
        mock_redis.return_value.publish.return_value = None
        yield


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