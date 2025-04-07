import torch
import logging
import psutil
from dataclasses import dataclass
from enum import Enum, auto
from typing import Dict, Optional

# Define model configurations
MODEL_CONFIGS = {
    "mixtral": {
        "default_quantization": 8,
        "min_ram_mb": 16000,
        "supported_precisions": ["int8", "float16"]
    },
    "llama3": {
        "default_quantization": 8,
        "min_ram_mb": 8000,
        "supported_precisions": ["int8", "float16"]
    },
    "ocr": {
        "default_quantization": 8,
        "min_ram_mb": 2000,
        "supported_precisions": ["int8", "float16"]
    },
    "asr": {
        "default_quantization": 8,
        "min_ram_mb": 4000,
        "supported_precisions": ["int8", "float16"]
    }
}

# Define model versions
MODEL_VERSIONS = {
    "mixtral": ["8x7b", "8x22b"],
    "llama3": ["8b", "70b"],
    "ocr": ["small", "base", "large"],
    "asr": ["tiny", "base", "large"]
}

# Define calibration configurations
CALIBRATION_CONFIGS = {
    "mixtral": {
        "calibration_dataset": "wikitext",
        "num_samples": 128
    },
    "llama3": {
        "calibration_dataset": "wikitext",
        "num_samples": 128
    },
    "ocr": {
        "calibration_dataset": "coco",
        "num_samples": 64
    },
    "asr": {
        "calibration_dataset": "librispeech",
        "num_samples": 32
    }
}


class QuantizationMode(Enum):
    """Supported quantization modes"""
    DYNAMIC = auto()  # Dynamic quantization (post-training)
    STATIC = auto()   # Static quantization (requires calibration)
    FLOAT16 = auto()  # Half-precision floating point
    INT8 = auto()     # 8-bit integer quantization



@dataclass
class QuantizationConfig:
    """Configuration for model quantization"""
    mode: QuantizationMode = QuantizationMode.DYNAMIC
    bits: int = 8
    min_ram_mb: int = 512  # Minimum RAM required for full precision
    model_name: Optional[str] = None
    device: str = "cpu"    # Target device: "cpu", "gpu", "auto"
    fallback_enabled: bool = True  # Enable automatic fallback to lower precision

    def __post_init__(self):
        if self.model_name and self.model_name in MODEL_CONFIGS:
            self.bits = MODEL_CONFIGS[self.model_name]["default_quantization"]
            self.min_ram_mb = MODEL_CONFIGS[self.model_name]["min_ram_mb"]



class ModelQuantizer:
    """Handles dynamic model quantization based on system constraints"""
    
    def __init__(self, config: QuantizationConfig = None):
        self.config = config or QuantizationConfig()
        self.logger = logging.getLogger(__name__)
        self.performance_metrics = {
            "original_size_mb": 0,
            "quantized_size_mb": 0,
            "inference_speedup": 0,
            "memory_reduction_percent": 0,
            "accuracy_loss_percent": 0
        }
        
    def quantize(self, model: torch.nn.Module,
                available_ram_mb: Optional[int] = None) -> torch.nn.Module:
        """Apply quantization based on available resources"""
        if available_ram_mb is None:
            available_ram_mb = self._get_available_ram()
            
        self.logger.info(
            f"Available RAM: {available_ram_mb}MB, "
            f"Required: {self.config.min_ram_mb}MB"
        )
        
        # Store original model size for metrics
        self.performance_metrics["original_size_mb"] = self._estimate_model_size_mb(model)
        
        # Determine if quantization is needed
        if available_ram_mb < self.config.min_ram_mb:
            quantized_model = self._apply_quantization(model)
            
            # Update performance metrics
            self.performance_metrics["quantized_size_mb"] = self._estimate_model_size_mb(
                quantized_model
            )
            orig_size = self.performance_metrics["original_size_mb"]
            quant_size = self.performance_metrics["quantized_size_mb"]
            
            if orig_size > 0:
                self.performance_metrics["memory_reduction_percent"] = (
                    (orig_size - quant_size) / orig_size * 100
                )
            
            return quantized_model
        
        return model
    
    def _get_available_ram(self) -> int:
        """Get available system RAM in MB"""
        try:
            memory_info = psutil.virtual_memory()
            return memory_info.available // (1024 * 1024)  # Convert bytes to MB
        except Exception as e:
            self.logger.warning(
                f"Failed to get system memory: {str(e)}. Using default value."
            )
            return 4096  # Default to 4GB if we can't determine
    
    def _estimate_model_size_mb(self, model: torch.nn.Module) -> float:
        """Estimate the model size in MB"""
        try:
            param_size = 0
            for param in model.parameters():
                param_size += param.nelement() * param.element_size()
            buffer_size = 0
            for buffer in model.buffers():
                buffer_size += buffer.nelement() * buffer.element_size()
                
            size_mb = (param_size + buffer_size) / (1024 * 1024)
            return size_mb
        except Exception as e:
            self.logger.warning(f"Failed to estimate model size: {str(e)}")
            return 0
        
    def _apply_quantization(self, model: torch.nn.Module) -> torch.nn.Module:
        """Apply the configured quantization to the model"""
        try:
            self.logger.info(
                f"Applying {self.config.mode} quantization with {self.config.bits} bits"
            )
            
            if self.config.mode == QuantizationMode.DYNAMIC:
                return torch.quantization.quantize_dynamic(
                    model, {torch.nn.Linear, torch.nn.Conv2d}, dtype=torch.qint8
                )
            elif self.config.mode == QuantizationMode.STATIC:
                # Static quantization requires calibration
                model.eval()
                
                # Get calibration config if available
                calibration_config = {}
                if self.config.model_name in CALIBRATION_CONFIGS:
                    calibration_config = CALIBRATION_CONFIGS[self.config.model_name]
                    self.logger.info(f"Using calibration config: {calibration_config}")
                
                model.qconfig = torch.quantization.get_default_qconfig('fbgemm')
                model_prepared = torch.quantization.prepare(model)
                
                # Here we would run calibration data through the model
                # This is a placeholder for actual calibration
                self.logger.info("Calibration would be performed here with real data")
                
                return torch.quantization.convert(model_prepared)
                
            elif self.config.mode == QuantizationMode.FLOAT16:
                return model.half()
                
            elif self.config.mode == QuantizationMode.INT8:
                # For newer PyTorch versions with better int8 support
                if hasattr(torch.quantization, 'quantize_static'):
                    model.eval()
                    model.qconfig = torch.quantization.get_default_qconfig('fbgemm')
                    model_prepared = torch.quantization.prepare(model)
                    return torch.quantization.convert(model_prepared)
                else:
                    self.logger.warning(
                        "INT8 quantization not fully supported in this PyTorch version"
                    )
                    return self._fallback_quantization(model)
                    
        except Exception as e:
            self.logger.error(f"Quantization failed: {str(e)}")
            if self.config.fallback_enabled:
                return self._fallback_quantization(model)
            return model
            
    def _fallback_quantization(self, model: torch.nn.Module) -> torch.nn.Module:
        """Fallback to simpler quantization method if the primary method fails"""
        self.logger.info("Attempting fallback quantization")
        try:
            # Try the simplest approach - half precision
            return model.half()
        except Exception as e:
            self.logger.error(f"Fallback quantization also failed: {str(e)}")
            return model  # Return original model if all quantization attempts fail
            
    def get_performance_metrics(self) -> Dict[str, float]:
        """Return performance metrics for the quantization"""
        return self.performance_metrics
        
    def benchmark_inference(
        self, model: torch.nn.Module, 
        input_tensor: torch.Tensor, 
        num_runs: int = 10
    ) -> Dict[str, float]:
        """Benchmark inference performance and update metrics"""
        try:
            import time
            
            model.eval()
            
            # Warmup
            with torch.no_grad():
                for _ in range(3):
                    model(input_tensor)
            
            # Benchmark
            start_time = time.time()
            with torch.no_grad():
                for _ in range(num_runs):
                    model(input_tensor)
            end_time = time.time()
            
            avg_time = (end_time - start_time) / num_runs
            return {"avg_inference_time": avg_time}
            
        except Exception as e:
            self.logger.error(f"Benchmarking failed: {str(e)}")
            return {"avg_inference_time": 0}
