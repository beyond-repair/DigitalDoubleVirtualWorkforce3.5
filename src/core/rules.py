from __future__ import annotations

from typing import Any, Callable, Dict, List

from pydantic import BaseModel


class ValidationRule(BaseModel):
    name: str
    description: str
    severity: str = "warning"
    enabled: bool = True


class RuleManager:
    """Register and evaluate simple validation rules over task dicts."""

    def __init__(self) -> None:
        self.rules: Dict[str, ValidationRule] = {}
        self.rule_funcs: Dict[str, Callable[[Dict[str, Any]], bool]] = {}

    def register_rule(
        self, rule: ValidationRule, rule_func: Callable[[Dict[str, Any]], bool]
    ) -> None:
        self.rules[rule.name] = rule
        self.rule_funcs[rule.name] = rule_func

    def evaluate_rules(self, data: Dict[str, Any]) -> List[str]:
        triggered: List[str] = []
        for name, rule in self.rules.items():
            if rule.enabled and self.rule_funcs[name](data):
                triggered.append(name)
        return triggered
