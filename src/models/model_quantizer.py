from __future__ import annotations

import logging
from dataclasses import dataclass
from enum import Enum, auto
from typing import Any, Dict


class QuantizationMode(Enum):
    """Supported quantization *advice* modes (no real torch ops in Claim-0)."""

    DYNAMIC = auto()
    STATIC = auto()
    FLOAT16 = auto()
    FULL = auto()


@dataclass
class QuantizationConfig:
    mode: QuantizationMode = QuantizationMode.DYNAMIC
    bits: int = 8
    min_ram_mb: int = 512


class ModelQuantizer:
    """Advise precision based on available RAM — Claim-0 stub (no torch)."""

    def __init__(self, config: QuantizationConfig | None = None):
        self.config = config or QuantizationConfig()
        self.logger = logging.getLogger(__name__)

    def recommend(self, available_ram_mb: int) -> Dict[str, Any]:
        if available_ram_mb < self.config.min_ram_mb:
            mode = self.config.mode
            bits = self.config.bits
        else:
            mode = QuantizationMode.FULL
            bits = 32
        advice = {
            "mode": mode.name,
            "bits": bits,
            "available_ram_mb": available_ram_mb,
            "min_ram_mb": self.config.min_ram_mb,
            "torch_applied": False,
        }
        self.logger.info("quantization advice: %s", advice)
        return advice

    def quantize(self, model: Any, available_ram_mb: int) -> Any:
        """Identity pass-through; returns model unchanged (Claim-0)."""
        self.recommend(available_ram_mb)
        return model
