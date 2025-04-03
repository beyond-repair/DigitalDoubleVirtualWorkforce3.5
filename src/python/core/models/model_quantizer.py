import torch
import logging
from dataclasses import dataclass
from enum import Enum, auto


class QuantizationMode(Enum):
    """Supported quantization modes"""
    DYNAMIC = auto()
    STATIC = auto()
    FLOAT16 = auto()

@dataclass
class QuantizationConfig:
    """Configuration for model quantization"""
    mode: QuantizationMode = QuantizationMode.DYNAMIC
    bits: int = 8
    min_ram_mb: int = 512  # Minimum RAM required for full precision

class ModelQuantizer:
    """Handles dynamic model quantization based on system constraints"""
    
    def __init__(self, config: QuantizationConfig = None):
        self.config = config or QuantizationConfig()
        self.logger = logging.getLogger(__name__)
        
    def quantize(self, model: torch.nn.Module,
                 available_ram_mb: int) -> torch.nn.Module:
        """Apply quantization based on available resources"""
        if available_ram_mb < self.config.min_ram_mb:
            return self._apply_quantization(model)
        return model
        
    def _apply_quantization(self, model: torch.nn.Module) -> torch.nn.Module:
        """Apply the configured quantization to the model"""
        try:
            if self.config.mode == QuantizationMode.DYNAMIC:
                return torch.quantization.quantize_dynamic(
                    model, {torch.nn.Linear}, dtype=torch.qint8
                )
            elif self.config.mode == QuantizationMode.STATIC:
                # Static quantization requires calibration
                model.eval()
                model.qconfig = torch.quantization.get_default_qconfig(
                    'fbgemm'
                )
                return torch.quantization.prepare(model, inplace=False)
            elif self.config.mode == QuantizationMode.FLOAT16:
                return model.half()
        except Exception as e:
            self.logger.error(f"Quantization failed: {str(e)}")
            return model