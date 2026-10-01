# Claim Status

**Repository:** DigitalDoubleVirtualWorkforce3.5
**Classification:** SUPERSEDED
**Claim level:** 0
**Successor:** https://github.com/beyond-repair/Digital_Double_virtual_workforce
**Governing source:** https://github.com/beyond-repair/ADL-Governance

## Allowed statements

- This tree is a historical 3.5-line snapshot.
- Public canonical workforce work is `Digital_Double_virtual_workforce`.
- GitHub `archived` is false until an operator sets the flag.

## Forbidden statements

- Production readiness, fault-tolerance proof, or CAP-theorem management as a verified property of this tree.
- A working `src.core.agent.DigitalDoubleAgent` entrypoint. `tests/conftest.py` imports that symbol; the module is not in the tree.
- Coverage or unit-test success. `pytest.ini` requests `--cov=src`, and no `test_*.py` files exist under `tests/`.

## Evidence

Tree at pre-sweep head `7c9a67ffa38e5941be46e45a529bdee34fd2fb18`: README and GOVERNANCE already mark SUPERSEDED. Workflows API `total_count=0` before this guard. Dependabot open alerts: empty list returned. No release tag is created by this sweep.
