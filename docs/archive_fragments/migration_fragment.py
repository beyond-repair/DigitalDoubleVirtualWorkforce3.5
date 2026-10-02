from typing import List, Dict, Any
from pathlib import Path
import json
import logging
from datetime import datetime

class MigrationManager:
    def __init__(self, migrations_path: Path):
        self.migrations_path = migrations_path
        self.migrations_path.mkdir(exist_ok=True)
        self._init_migrations_table()
    
    def create_migration(self, name: str, sql: str) -> str:
        timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
        migration_id = f"{timestamp}_{name}"
        
        migration_file = self.migrations_path / f"{migration_id}.sql"
        migration_file.write_text(sql)
        
        return migration_id
    
    async def run_migrations(self) -> List[str]:
        completed = []
        for migration in sorted(self.migrations_path.glob("*.sql")):
            if await self._apply_migration(migration):
                completed.append(migration.stem)
        return completed
