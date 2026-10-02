from pathlib import Path

from src.core.storage import StorageManager


def test_store_get_list(tmp_path):
    db = tmp_path / "t.db"
    s = StorageManager(db)
    s.store_task("a", {"description": "one"})
    s.store_task("b", {"description": "two"}, status="done")
    assert s.get_task("a")["data"]["description"] == "one"
    assert s.get_task("missing") is None
    assert len(s.list_tasks()) == 2
    assert s.update_status("a", "done")
    assert s.get_task("a")["status"] == "done"


def test_memory_db():
    s = StorageManager(":memory:")
    s.store_task("x", {"k": 1})
    assert s.get_task("x")["data"]["k"] == 1


def test_backup(tmp_path):
    db = tmp_path / "src.db"
    s = StorageManager(db)
    s.store_task("z", {"v": True})
    backup = s.create_backup(tmp_path / "backups")
    assert backup.exists()
    restored = StorageManager(backup)
    assert restored.get_task("z")["data"]["v"] is True
