from unittest.mock import MagicMock
from src.core.agent import DigitalDoubleAgent  # noqa: F401


class TestDigitalDoubleAgent:
    def test_agent_initialization(self, sample_agent):
        assert sample_agent.agent_id == "test_agent"
        assert sample_agent.config['max_memory_mb'] == 512
        assert sample_agent.config['offline_mode'] is True

    def test_execute_task_success(self, sample_agent):
        sample_agent._process_task = MagicMock(return_value="success")
        result = sample_agent.execute_task({"task": "test"})
        assert result == "success"

    def test_execute_task_failure(self, sample_agent):
        sample_agent._process_task = MagicMock(side_effect=Exception("error"))
        sample_agent._handle_failure = MagicMock(return_value="recovered")
        result = sample_agent.execute_task({"task": "test"})
        assert result == "recovered"


class TestTaskQueue:
    def test_add_task(self):
        from src.core.agent import TaskQueue
        queue = TaskQueue(":memory:")
        test_task = {"action": "test"}
        queue.add_task(test_task)
        
        cursor = queue.conn.cursor()
        cursor.execute("SELECT task_data FROM tasks")
        tasks = cursor.fetchall()
        assert str(test_task) in [t[0] for t in tasks]