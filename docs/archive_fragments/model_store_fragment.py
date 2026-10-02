from pathlib import Path
from datetime import datetime
from typing import Any, Dict, List

class ModelStore:
    def __init__(self, store_path: Path):
        self.store_path = store_path
        self.evaluator = ModelEvaluator(store_path / "evaluations")
        
    async def save_model(self, name: str, model: Any, 
                        metadata: Dict[str, Any],
                        evaluation: Dict[str, float] = None) -> str:
        version = self._get_next_version(name)
        metadata["evaluation"] = evaluation
        metadata["saved_at"] = datetime.utcnow().isoformat()
        
        model_path = self.store_path / name / version
        model_path.mkdir(parents=True, exist_ok=True)
        
        # Save model and metadata
        self._save_model_to_path(model, model_path)
        self._save_metadata_to_path(metadata, model_path)
        
        return str(model_path)
    
    async def save_forecast_model(self, 
                                name: str,
                                model: Any,
                                forecast_metadata: Dict[str, Any]) -> str:
        """Save time series forecasting model with metadata."""
        version = self._get_next_version(f"forecast_{name}")
        forecast_metadata.update({
            "type": "forecast",
            "saved_at": datetime.utcnow().isoformat(),
            "model_class": model.__class__.__name__
        })
        
        return await self.save_model(name, model, forecast_metadata)
    
    async def compare_models(self, model_ids: List[str]) -> Dict[str, Any]:
        results = {}
        for model_id in model_ids:
            evaluation = await self._get_model_evaluation(model_id)
            metadata = await self._get_model_metadata(model_id)
            results[model_id] = {
                "evaluation": evaluation,
                "metadata": metadata,
                "comparison_time": datetime.utcnow().isoformat()
            }
        return results
    
    def _get_next_version(self, name: str) -> str:
        # Logic to determine the next version
        pass
    
    def _save_model_to_path(self, model: Any, path: Path):
        # Logic to save the model
        pass
    
    def _save_metadata_to_path(self, metadata: Dict[str, Any], path: Path):
        # Logic to save the metadata
        pass

class ModelEvaluator:
    def __init__(self, evaluation_path: Path):
        self.evaluation_path = evaluation_path
        
    def evaluate(self, model: Any) -> Dict[str, float]:
        # Logic to evaluate the model
        pass
