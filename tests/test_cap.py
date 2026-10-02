from src.core.cap import (
    CapCluster,
    ConsistencyManager,
    PartitionManager,
    PartitionStatus,
)
from src.core.monitor import DistributedMonitor


def test_quorum_and_partition():
    cluster = CapCluster(["a", "b", "c"], min_nodes=2)
    cons = ConsistencyManager(cluster, quorum_size=2)
    part = PartitionManager(cluster)
    assert cons.check_quorum()
    assert cons.ensure_consistency({"op": "w"}) is not None
    assert part.detect_partition() is False
    assert part.network_status == PartitionStatus.HEALTHY

    cluster.set_active("c", False)
    cluster.set_active("b", False)
    assert cons.check_quorum() is False
    assert cons.ensure_consistency({"op": "w2"}) is None
    assert part.detect_partition() is False  # one node left → degraded, not empty
    assert part.network_status == PartitionStatus.DEGRADED

    cluster.set_active("a", False)
    assert part.detect_partition() is True
    assert part.network_status == PartitionStatus.PARTITIONED


def test_monitor():
    cluster = CapCluster(["n1", "n2"])
    cons = ConsistencyManager(cluster, quorum_size=2)
    part = PartitionManager(cluster)
    mon = DistributedMonitor(cluster, cons, part)
    mon.register_check("always", lambda: True)
    health = mon.monitor_cluster_health()
    assert health["quorum_ok"] is True
    assert health["custom_checks"]["always"] is True
    assert "n1" in health["active_nodes"]
