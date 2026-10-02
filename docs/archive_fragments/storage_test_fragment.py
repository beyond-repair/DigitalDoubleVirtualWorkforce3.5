import pytest
from pathlib import Path
from ddvw.storage import StorageManager

@pytest.fixture
def storage_manager():
    return StorageManager(Path(":memory:"))

async def test_store_task(storage_manager):
    task_data = {"type": "compute", "data": "test"}
    await storage_manager.store_task("task-1", task_data)
    result = await storage_manager.get_task("task-1")
    assert result["data"] == task_data
