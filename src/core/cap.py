from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional, Set


class PartitionStatus(Enum):
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    PARTITIONED = "partitioned"


@dataclass
class CapNode:
    node_id: str
    active: bool = True
    last_seen: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )


class CapCluster:
    """In-memory node registry for Claim-0 CAP / quorum demos (no network)."""

    def __init__(self, node_ids: Optional[List[str]] = None, min_nodes: int = 2):
        ids = node_ids or ["n1", "n2", "n3"]
        self.nodes: Dict[str, CapNode] = {i: CapNode(i) for i in ids}
        self.min_nodes = min_nodes
        self.log: List[Dict[str, Any]] = []

    def get_active_nodes(self) -> List[str]:
        return [n.node_id for n in self.nodes.values() if n.active]

    def set_active(self, node_id: str, active: bool) -> None:
        if node_id not in self.nodes:
            raise KeyError(node_id)
        self.nodes[node_id].active = active
        self.nodes[node_id].last_seen = datetime.now(timezone.utc).isoformat()
        self.log.append(
            {
                "event": "node_state",
                "node_id": node_id,
                "active": active,
                "at": self.nodes[node_id].last_seen,
            }
        )

    def replicate(self, operation: Dict[str, Any]) -> Dict[str, Any]:
        targets = self.get_active_nodes()
        record = {
            "operation": operation,
            "replicas": list(targets),
            "at": datetime.now(timezone.utc).isoformat(),
        }
        self.log.append({"event": "replicate", **record})
        return record


class ConsistencyManager:
    """Quorum gate before accepting a write (Claim-0 CAP Consistency toy)."""

    def __init__(self, cluster: CapCluster, quorum_size: int = 2):
        self.cluster = cluster
        self.quorum_size = quorum_size

    def check_quorum(self) -> bool:
        return len(self.cluster.get_active_nodes()) >= self.quorum_size

    def ensure_consistency(self, operation: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if not self.check_quorum():
            return None
        return self.cluster.replicate(operation)


class PartitionManager:
    """Detect degraded / partitioned cluster states from active-node count."""

    def __init__(self, cluster: CapCluster):
        self.cluster = cluster
        self.network_status = PartitionStatus.HEALTHY
        self.partition_history: List[Dict[str, Any]] = []

    def detect_partition(self) -> bool:
        active = self.cluster.get_active_nodes()
        if len(active) == 0:
            self.network_status = PartitionStatus.PARTITIONED
            self._log_event(active)
            return True
        if len(active) < self.cluster.min_nodes:
            self.network_status = PartitionStatus.DEGRADED
            self._log_event(active)
            return False
        self.network_status = PartitionStatus.HEALTHY
        return False

    def _log_event(self, active: List[str]) -> None:
        self.partition_history.append(
            {
                "status": self.network_status.value,
                "active": list(active),
                "at": datetime.now(timezone.utc).isoformat(),
            }
        )
