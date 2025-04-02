from typing import Dict, Any, Optional
from pathlib import Path
import sqlite3
import json
from datetime import datetime

class StorageManager:
    def __init__(self, db_path: Path):
        self.db_path = db_path
        self._init_db()
    
    def _init_db(self) -> None:
        with sqlite3.connect(str(self.db_path)) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS tasks (
                    id TEXT PRIMARY KEY,
                    status TEXT,
                    data JSON,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
    async def store_task(self, task_id: str, data: Dict[str, Any]) -> None:
        if not await self.validator.validate_data('task', data):
            raise ValueError('Invalid task data')
        
        with sqlite3.connect(str(self.db_path)) as conn:
            conn.execute(
                "INSERT INTO tasks (id, status, data) VALUES (?, ?, ?)",
                (task_id, "pending", json.dumps(data))
            )

    async def create_backup(self) -> Path:
        backup_path = self.db_path.parent / f"backup_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}.db"
        with sqlite3.connect(str(self.db_path)) as source:
            backup = sqlite3.connect(str(backup_path))
            source.backup(backup)
            backup.close()
        return backup_path
    
    async def restore_backup(self, backup_path: Path) -> bool:
        if not backup_path.exists():
            return False
        with sqlite3.connect(str(backup_path)) as source:
            backup = sqlite3.connect(str(self.db_path))
            source.backup(backup)
            backup.close()
        return True
