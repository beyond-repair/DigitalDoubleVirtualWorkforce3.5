import unittest
from unittest.mock import MagicMock
import threading
import time

from agents.core.multi_agent_orchestrator import (
    MultiAgentOrchestrator,
    PluginAdapterManager,
    ErrorManager,
    TaskOptimizer
)


class TestMultiAgentOrchestrator(unittest.TestCase):

    def setUp(self):
        self.orchestrator = MultiAgentOrchestrator(
            redis_channel='test_channel'
        )
        self.orchestrator.publish_message = MagicMock()
        self.orchestrator.stop_event = threading.Event()

    def test_agent_registration_and_routing(self):
        def dummy_agent(msg):
            return {'recipient': 'next_agent', 'payload': 'done'}

        self.orchestrator.registry.register('dummy', dummy_agent)
        message = {'recipient': 'dummy'}
        self.orchestrator.route_message(message)
        self.orchestrator.publish_message.assert_called_once()
        response = self.orchestrator.publish_message.call_args[0][0]
        self.assertIn('recipient', response)

    def test_plugin_adapter_manager_call(self):
        plugin_manager = PluginAdapterManager()
        plugin_manager.docker = MagicMock()
        plugin_manager.docker.build_image = MagicMock(return_value='built')
        result = plugin_manager.call_plugin(
            'docker', 'build_image', 'Dockerfile', 'mytag'
        )
        self.assertEqual(result, 'built')

    def test_error_manager_handles_agent_error(self):
        error_manager = ErrorManager()
        # Should not raise
        error_manager.handle_agent_error('dummy', {}, Exception('fail'))

    def test_error_manager_handles_no_agent(self):
        error_manager = ErrorManager()
        # Should not raise
        error_manager.handle_no_agent('missing', {})

    def test_task_optimizer_returns_list(self):
        optimizer = TaskOptimizer()
        task = {'task': 'do_something'}
        subtasks = optimizer.optimize(task)
        self.assertIsInstance(subtasks, list)
        self.assertIn(task, subtasks)

    def test_start_and_stop(self):
        self.orchestrator._listen_loop = MagicMock()
        self.orchestrator.start()
        time.sleep(0.1)
        self.orchestrator.stop()
        self.assertTrue(self.orchestrator.stop_event.is_set())


if __name__ == '__main__':
    unittest.main()