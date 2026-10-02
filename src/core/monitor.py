from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Callable, Dict

from .cap import CapCluster, ConsistencyManager, PartitionManager


class DistributedMonitor:
    """Aggregate Claim-0 cluster health from CAP toys."""

    def __init__(
        self,
        cluster: CapCluster,
        consistency: ConsistencyManager,
        partition: PartitionManager,
    ):
        self.cluster = cluster
        self.consistency = consistency
        self.partition = partition
        self.health_checks: Dict[str, Callable[[], bool]] = {}

    def register_check(self, name: str, fn: Callable[[], bool]) -> None:
        self.health_checks[name] = fn

    def monitor_cluster_health(self) -> Dict[str, Any]:
        self.partition.detect_partition()
        custom = {name: bool(fn()) for name, fn in self.health_checks.items()}
        return {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "active_nodes": self.cluster.get_active_nodes(),
            "quorum_ok": self.consistency.check_quorum(),
            "partition_status": self.partition.network_status.value,
            "custom_checks": custom,
        }
