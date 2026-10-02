from typing import Optional
from pathlib import Path
import asyncio
from datetime import datetime, timedelta
from .storage import StorageManager

class BackupScheduler:
    def __init__(self, storage: StorageManager, backup_dir: Path):
        self.storage = storage
        self.backup_dir = backup_dir
        self.backup_dir.mkdir(exist_ok=True)
        self._last_backup: Optional[datetime] = None
        
    async def start(self, interval_hours: int = 24):
        while True:
            await self._perform_backup()
            await asyncio.sleep(interval_hours * 3600)
            
    async def _perform_backup(self) -> Path:
        backup_path = await self.storage.create_backup()
        self._last_backup = datetime.utcnow()
        return backup_path
