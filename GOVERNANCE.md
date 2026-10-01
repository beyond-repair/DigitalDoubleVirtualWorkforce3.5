# GOVERNANCE

**Classification:** SUPERSEDED  
**Claim level:** 0 (historical / no active claims)  
**Canonical successor:** [Digital_Double_virtual_workforce](https://github.com/beyond-repair/Digital_Double_virtual_workforce)  
**Governing source:** [ADL-Governance](https://github.com/beyond-repair/ADL-Governance)

## Allowed

- Historical reference and read-only inspection.
- Citation of prior design notes as provenance for the canonical line.
- Idempotent claim-cap docs and banner tests that do not import `src`.

## Forbidden

- New feature development or product mutation.
- Assertion of current validation, performance, or production readiness.
- Duplication of functionality already present in the canonical repository.
- Treating `tests/conftest.py` as a passing suite. It imports `src.core.agent`, which is not in the tree.

## CI / Tests

Product CI is not required. `.github/workflows/supersede-guard.yml` runs `tests_governance/` only (unittest, no `src` import). `pytest.ini` coverage flags are historical and are not the guard.

## Archive

GitHub `archived` flag is operator-gated (see OPERATOR_QUEUE.md). Do not delete history.

---
*Locked by autonomous portfolio sweep. Idempotent.*
