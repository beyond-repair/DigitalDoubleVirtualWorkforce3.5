import unittest
from unittest.mock import MagicMock, patch
import torch
import numpy as np
from datetime import datetime
from ..agent import Agent, ModelType, PrivacyConfig, ModelConfig, ModelState

class TestAgent(unittest.TestCase):
    def setUp(self):
        self.agent = Agent(
            model_type=ModelType.MIXTRAL,
            privacy_config=PrivacyConfig(),
            edge_mode=True,
            model_config=ModelConfig()
        )
        
    def test_model_initialization(self):
        with patch('torch.load') as mock_load:
            mock_load.return_value = MagicMock()
            self.agent.initialize_model()
            self.assertIsNotNone(self.agent.model)
            
    def test_privacy_processing(self):
        test_data = {"key": "value"}
        processed = self.agent.process_with_privacy(test_data)
        self.assertIsInstance(processed, dict)
        
    def test_quantization(self):
        self.agent.model = MagicMock()
        with patch('torch.quantization.prepare'):
            self.agent._apply_quantization()
            self.assertTrue(len(self.agent.audit_log) > 0)
            
    def test_edge_sync(self):
        with patch('kubernetes.config.load_kube_config'):
            with patch('kubernetes.client.CoreV1Api'):
                self.agent.sync_edge_cloud()
                self.assertIn("edge_sync", 
                            [e["event_type"] for e in self.agent.audit_log])
                            
    def test_calibration(self):
        self.agent.model = MagicMock()
        self.agent._calibrate_quantization()
        self.assertEqual(len(self.agent.calibration_data), 10)
        
    def test_metrics_collection(self):
        metrics = self.agent.collect_metrics()
        self.assertIsInstance(metrics.cpu_usage, float)
        self.assertIsInstance(metrics.memory_usage, float)
        
    def test_model_calibration_data(self):
        data = self.agent._generate_calibration_data()
        self.assertEqual(len(data), 10)
        self.assertEqual(data[0].shape, 
                        (self.agent.model_config.batch_size,
                         self.agent.model_config.max_sequence_length))
