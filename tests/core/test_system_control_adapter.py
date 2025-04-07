import unittest
from unittest.mock import patch, MagicMock
from agents.core.plugin_adapters import SystemControlAdapter

class TestSystemControlAdapter(unittest.TestCase):
    def setUp(self):
        self.adapter = SystemControlAdapter()
        self.adapter.redis_client = MagicMock()
        self.adapter.pubsub = MagicMock()

    @patch('agents.core.plugin_adapters.pyautogui')
    def test_type_text(self, mock_pyautogui):
        mock_pyautogui.typewrite = MagicMock()
        result = self.adapter.type_text('hello')
        mock_pyautogui.typewrite.assert_called_with('hello')
        self.assertEqual(result, 'typed')

    @patch('agents.core.plugin_adapters.pyautogui')
    def test_move_mouse(self, mock_pyautogui):
        mock_pyautogui.moveTo = MagicMock()
        result = self.adapter.move_mouse(100, 200)
        mock_pyautogui.moveTo.assert_called_with(100, 200)
        self.assertEqual(result, 'mouse moved')

    @patch('agents.core.plugin_adapters.subprocess')
    def test_launch_app(self, mock_subprocess):
        mock_subprocess.Popen = MagicMock()
        result = self.adapter.launch_app('notepad.exe')
        mock_subprocess.Popen.assert_called_with('notepad.exe')
        self.assertEqual(result, 'app launched')

    @patch('agents.core.plugin_adapters.psutil')
    def test_close_app(self, mock_psutil):
        proc = MagicMock()
        proc.info = {'name': 'notepad.exe'}
        mock_psutil.process_iter.return_value = [proc]
        result = self.adapter.close_app('notepad.exe')
        proc.terminate.assert_called_once()
        self.assertIn('terminated', result)

    @patch('agents.core.plugin_adapters.subprocess')
    def test_run_script(self, mock_subprocess):
        completed = MagicMock()
        completed.stdout = 'out'
        completed.stderr = 'err'
        completed.returncode = 0
        mock_subprocess.run.return_value = completed
        result = self.adapter.run_script('echo hi')
        self.assertEqual(result['stdout'], 'out')
        self.assertEqual(result['stderr'], 'err')
        self.assertEqual(result['returncode'], 0)

if __name__ == '__main__':
    unittest.main()