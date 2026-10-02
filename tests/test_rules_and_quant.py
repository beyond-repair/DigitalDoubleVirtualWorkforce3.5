from src.core.rules import RuleManager, ValidationRule
from src.models.model_quantizer import ModelQuantizer, QuantizationConfig, QuantizationMode


def test_rules():
    rm = RuleManager()
    rm.register_rule(
        ValidationRule(name="high", description="priority high"),
        lambda d: d.get("priority") == "high",
    )
    assert rm.evaluate_rules({"priority": "high"}) == ["high"]
    assert rm.evaluate_rules({"priority": "low"}) == []


def test_quantizer_advice(mock_model):
    q = ModelQuantizer(QuantizationConfig(min_ram_mb=512, mode=QuantizationMode.DYNAMIC))
    low = q.recommend(64)
    high = q.recommend(2048)
    assert low["mode"] == "DYNAMIC"
    assert low["torch_applied"] is False
    assert high["mode"] == "FULL"
    assert q.quantize(mock_model, 64) is mock_model
