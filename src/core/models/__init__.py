from typing import Dict

MODEL_CONFIGS: Dict[str, Dict] = {
    "mixtral": {
        "default_quantization": 8,
        "supported_devices": ["cpu", "cuda"],
        "min_memory": "16GB"
    },
    "llama3": {
        "default_quantization": 4,
        "supported_devices": ["cpu", "cuda"],
        "min_memory": "8GB"
    },
    "ocr": {
        "default_quantization": 8,
        "supported_devices": ["cpu"],
        "min_memory": "4GB"
    },
    "asr": {
        "default_quantization": 8,
        "supported_devices": ["cpu"],
        "min_memory": "4GB"
    }
}

MODEL_VERSIONS: Dict[str, Dict] = {
    "mixtral": {
        "current": "1.0.0",
        "min_supported": "0.9.0",
        "checksum": "sha256:..."
    },
    "llama3": {
        "current": "2.0.0",
        "min_supported": "1.5.0",
        "checksum": "sha256:..."
    }
}

CALIBRATION_CONFIGS: Dict[str, Dict] = {
    "mixtral": {
        "num_samples": 10,
        "batch_size": 1,
        "calibration_method": "percentile",
    },
    "llama3": {
        "num_samples": 8,
        "batch_size": 2,
        "calibration_method": "mse",
    }
}

class SecurityError(Exception):
    """Custom exception for security-related errors"""
    pass
