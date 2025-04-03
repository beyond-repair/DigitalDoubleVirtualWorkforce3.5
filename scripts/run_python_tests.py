import unittest
import sys
import importlib
from pathlib import Path
import subprocess

# Add project root, src/python, and models directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Add src/python to path
sys.path.insert(0, str(Path(__file__).parent.parent / 'src' / 'python'))

# Add models directory to path
sys.path.insert(0, str(Path(__file__).parent.parent / 'src' / 'python' / 'core' / 'models'))

# Import test file using full path
test_path = Path(__file__).parent.parent / 'src' / 'python' / 'tests' / 'test_agent.py'

spec = importlib.util.spec_from_file_location("test_agent", test_path)
test_agent = importlib.util.module_from_spec(spec)
spec.loader.exec_module(test_agent)

# Create test suite and run
suite = unittest.TestLoader().loadTestsFromModule(test_agent)
result = unittest.TextTestRunner().run(suite)

command = (
    "python -m pytest "
    "--maxfail=1 "
    "--disable-warnings"
)
subprocess.run(command, shell=True)

another_command = (
    "flake8 --exclude=venv,build,dist "
    "--max-line-length=79"
)
subprocess.run(another_command, shell=True)

sys.exit(0 if result.wasSuccessful() else 1)