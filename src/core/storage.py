from __future__ import annotations

import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional


class StorageManager:
    """SQLite-backed offline task queue (Claim-0; no cloud DB)."""

    def __init__(self, db_path: Path | str):
        self.db_path = Path(db_path) if str(db_path) != ":memory:" else Path(":memory:")
        self._mem_conn: Optional[sqlite3.Connection] = None
        if str(self.db_path) == ":memory:":
            self._mem_conn = sqlite3.connect(":memory:", check_same_thread=False)
        else:
            self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_db()

    def _connect(self) -> sqlite3.Connection:
        if self._mem_conn is not None:
            return self._mem_conn
        return sqlite3.connect(str(self.db_path))

    def _init_db(self) -> None:
        conn = self._connect()
        try:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS tasks (
                    id TEXT PRIMARY KEY,
                    status TEXT NOT NULL,
                    data TEXT NOT NULL,
                    created_at TEXT NOT NULL
                )
                """
            )
            conn.commit()
        finally:
            if self._mem_conn is None:
                conn.close()

    def store_task(self, task_id: str, data: Dict[str, Any], status: str = "pending") -> None:
        created = datetime.now(timezone.utc).isoformat()
        conn = self._connect()
        try:
            conn.execute(
                "INSERT OR REPLACE INTO tasks (id, status, data, created_at) VALUES (?, ?, ?, ?)",
                (task_id, status, json.dumps(data), created),
            )
            conn.commit()
        finally:
            if self._mem_conn is None:
                conn.close()

    def get_task(self, task_id: str) -> Optional[Dict[str, Any]]:
        conn = self._connect()
        try:
            row = conn.execute(
                "SELECT id, status, data, created_at FROM tasks WHERE id = ?",
                (task_id,),
            ).fetchone()
        finally:
            if self._mem_conn is None:
                conn.close()
        if row is None:
            return None
        return {
            "id": row[0],
            "status": row[1],
            "data": json.loads(row[2]),
            "created_at": row[3],
        }

    def list_tasks(self) -> List[Dict[str, Any]]:
        conn = self._connect()
        try:
            rows = conn.execute(
                "SELECT id, status, data, created_at FROM tasks ORDER BY created_at"
            ).fetchall()
        finally:
            if self._mem_conn is None:
                conn.close()
        return [
            {
                "id": r[0],
                "status": r[1],
                "data": json.loads(r[2]),
                "created_at": r[3],
            }
            for r in rows
        ]

    def update_status(self, task_id: str, status: str) -> bool:
        conn = self._connect()
        try:
            cur = conn.execute(
                "UPDATE tasks SET status = ? WHERE id = ?", (status, task_id)
            )
            conn.commit()
            return cur.rowcount > 0
        finally:
            if self._mem_conn is None:
                conn.close()

    def create_backup(self, backup_dir: Optional[Path] = None) -> Path:
        if str(self.db_path) == ":memory:":
            raise ValueError("Cannot backup in-memory database to a file path")
        dest_dir = Path(backup_dir) if backup_dir else self.db_path.parent
        dest_dir.mkdir(parents=True, exist_ok=True)
        stamp = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
        backup_path = dest_dir / f"backup_{stamp}.db"
        source = sqlite3.connect(str(self.db_path))
        try:
            dest = sqlite3.connect(str(backup_path))
            try:
                source.backup(dest)
            finally:
                dest.close()
        finally:
            source.close()
        return backup_path
