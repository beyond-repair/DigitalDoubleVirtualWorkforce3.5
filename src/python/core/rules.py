from typing import Dict, Any, Callable, List
from pydantic import BaseModel

class ValidationRule(BaseModel):
    name: str
    description: str
    severity: str = "warning"
    enabled: bool = True

class RuleManager:
    def __init__(self):
        self.rules: Dict[str, ValidationRule] = {}
        self.rule_funcs: Dict[str, Callable] = {}
    
    def register_rule(self, rule: ValidationRule, rule_func: Callable) -> None:
        self.rules[rule.name] = rule
        self.rule_funcs[rule.name] = rule_func
    
    def evaluate_rules(self, data: Dict[str, Any]) -> List[str]:
        triggered = []
        for name, rule in self.rules.items():
            if rule.enabled and self.rule_funcs[name](data):
                triggered.append(name)
        return triggered
