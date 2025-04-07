import pytest
from src.python.core.execution_engine import ExecutionEngine
from src.python.core.task_planner import TaskPlanner
from src.python.core.memory_manager import MemoryManager


def test_execution_engine():
    engine = ExecutionEngine()
    assert engine.status == "initialized"


def test_task_planner():
    planner = TaskPlanner()
    assert planner.get_next_task() is not None


def test_memory_manager():
    manager = MemoryManager()
    assert manager.load_documentation() is not None


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
