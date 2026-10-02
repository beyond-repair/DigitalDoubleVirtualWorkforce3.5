#!/usr/bin/env python3
"""Digital Double Virtual Workforce 3.5 — Claim-0 SUPERSEDED offline demo."""
from __future__ import annotations

import argparse
import logging
import sys
from pathlib import Path as PathLib

# Allow `python main.py` without install
ROOT = PathLib(__file__).resolve().parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from src.core.agent import DigitalDoubleAgent
from src.core.cap import CapCluster, ConsistencyManager, PartitionManager
from src.core.config import AgentConfig
from src.core.monitor import DistributedMonitor
from src.core.storage import StorageManager
from src.models.model_quantizer import ModelQuantizer, QuantizationConfig, QuantizationMode


def run_demo() -> int:
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s: %(message)s")
    config = AgentConfig(
        {
            "offline_mode": True,
            "max_memory_mb": 256,
            "max_tasks": 50,
            "quorum_size": 2,
        }
    )
    storage = StorageManager(":memory:")
    agent = DigitalDoubleAgent("edge-worker-1", config, storage=storage)

    t1 = agent.submit_task("summarize local backlog", est_memory_mb=32)
    t2 = agent.submit_task("compress telemetry batch", est_memory_mb=64)
    try:
        agent.submit_task("", est_memory_mb=1)
    except ValueError:
        pass
    rejected = agent.submit_task("huge model finetune", est_memory_mb=999)

    ran = agent.run_pending()

    cluster = CapCluster(["n1", "n2", "n3"], min_nodes=2)
    consistency = ConsistencyManager(cluster, quorum_size=int(config["quorum_size"]))
    partition = PartitionManager(cluster)
    monitor = DistributedMonitor(cluster, consistency, partition)

    write_ok = consistency.ensure_consistency({"op": "enqueue", "task": t1["id"]})
    cluster.set_active("n3", False)
    cluster.set_active("n2", False)
    partition.detect_partition()
    write_fail = consistency.ensure_consistency({"op": "enqueue", "task": "blocked"})
    health = monitor.monitor_cluster_health()

    quant = ModelQuantizer(
        QuantizationConfig(mode=QuantizationMode.DYNAMIC, bits=8, min_ram_mb=512)
    )
    advice_low = quant.recommend(128)
    advice_high = quant.recommend(2048)

    print("--- Digital Double Virtual Workforce 3.5 Claim-0 demo ---")
    print("lifecycle: SUPERSEDED → Digital_Double_virtual_workforce")
    print(f"agent: {agent.status()}")
    print(f"submitted: {[t1['id'][:8], t2['id'][:8]]} rejected={rejected['status']}")
    print(f"ran: {[(r['id'][:8], r['status']) for r in ran]}")
    print(f"quorum_write: {bool(write_ok)} blocked_after_partition: {write_fail is None}")
    print(f"partition_status: {partition.network_status.value}")
    print(f"health: active={health['active_nodes']} quorum_ok={health['quorum_ok']}")
    print(f"quant_low_ram: {advice_low}")
    print(f"quant_high_ram: {advice_high}")
    print("NOTE: Claim-0 offline sketch — not fault-tolerance proof / not CAP product.")
    return 0


def main() -> None:
    parser = argparse.ArgumentParser(
        description="DDVW 3.5 Claim-0 SUPERSEDED offline demo"
    )
    parser.add_argument(
        "--demo",
        action="store_true",
        default=True,
        help="Run offline demo (default)",
    )
    parser.parse_args()
    raise SystemExit(run_demo())


if __name__ == "__main__":
    main()
