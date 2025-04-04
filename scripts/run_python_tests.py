import os
import pytest


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)

    python_src = os.path.join(project_root, 'src', 'python')
    test_path = os.path.join(python_src, 'tests')

    exit_code = pytest.main([test_path, '-v'])
    return exit_code


if __name__ == '__main__':
    exit(main())


