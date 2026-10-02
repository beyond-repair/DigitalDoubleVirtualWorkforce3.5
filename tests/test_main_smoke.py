import runpy
import sys
from pathlib import Path


def test_main_demo_smoke(capsys):
    root = Path(__file__).resolve().parents[1]
    sys.path.insert(0, str(root))
    # Execute main module's run_demo via runpy
    ns = runpy.run_path(str(root / "main.py"), run_name="not_main")
    code = ns["run_demo"]()
    assert code == 0
    out = capsys.readouterr().out
    assert "Claim-0 demo" in out
    assert "SUPERSEDED" in out
