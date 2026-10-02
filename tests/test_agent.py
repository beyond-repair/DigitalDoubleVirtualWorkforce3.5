import pytest

from src.core.agent import DigitalDoubleAgent


def test_submit_and_run(sample_agent):
    t = sample_agent.submit_task("hello world", est_memory_mb=16)
    assert t["status"] == "pending"
    results = sample_agent.run_pending()
    assert len(results) == 1
    assert results[0]["status"] == "done"
    assert results[0]["result"]["echo"] == "hello world"
    status = sample_agent.status()
    assert status["task_counts"].get("done") == 1


def test_empty_description_rejected(sample_agent):
    with pytest.raises(ValueError):
        sample_agent.submit_task("   ")


def test_memory_budget_reject(sample_agent):
    t = sample_agent.submit_task("too big", est_memory_mb=10_000)
    assert t["status"] == "rejected"
    assert "memory_budget" in t["triggered_rules"]
