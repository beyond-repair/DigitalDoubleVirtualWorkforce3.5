# Claim Status

**Repository:** DigitalDoubleVirtualWorkforce3.5
**Classification:** SUPERSEDED
**Claim level:** 0
**Successor:** https://github.com/beyond-repair/Digital_Double_virtual_workforce
**Governing source:** https://github.com/beyond-repair/ADL-Governance

## Allowed statements

- This tree is a historical 3.5-line snapshot repaired as a **Claim-0 offline runnable sketch**.
- Public canonical workforce work is `Digital_Double_virtual_workforce`.
- `python main.py` and `pytest` exercise offline agent + SQLite queue + in-memory CAP toys only.
- GitHub `archived` is false until an operator sets the flag.

## Forbidden statements

- Production readiness, fault-tolerance **proof**, or CAP-theorem management as a verified property of this tree.
- Live multi-node consensus, torch quantization of production models, or parity with the successor product.
- Any claim above Claim level 0.

## Evidence

- Finish repair (2026-10-02): misnamed `src/core/` dump fragments archived under `docs/archive_fragments/`; `DigitalDoubleAgent`, `StorageManager`, CAP toys, and pytest suite added; `pytest.ini` no longer requires coverage for the guard.
- Governance banner tests remain in `tests_governance/` (unittest-compatible).
