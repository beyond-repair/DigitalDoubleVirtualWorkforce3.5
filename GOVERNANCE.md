# GOVERNANCE

**Classification:** SUPERSEDED  
**Claim level:** 0 (historical Claim-0 runnable sketch)  
**Canonical successor:** [Digital_Double_virtual_workforce](https://github.com/beyond-repair/Digital_Double_virtual_workforce)  
**Governing source:** [ADL-Governance](https://github.com/beyond-repair/ADL-Governance)

## Allowed

- Historical reference and Claim-0 offline repair (demo + pytest) that preserves SUPERSEDED identity.
- Citation of prior design notes as provenance for the canonical line.
- Banner / claim-cap tests in `tests_governance/`.

## Forbidden

- New product feature work competing with the canonical repository.
- Assertion of current validation, performance, or production readiness.
- Claiming CAP / fault-tolerance proofs beyond the in-memory toy.

## CI / Tests

Product CI is not required. `.github/workflows/supersede-guard.yml` runs `tests_governance/` only. Local Claim-0 verification: `pip install -r requirements.txt && pytest && python main.py`.

## Archive

GitHub `archived` flag is operator-gated. Do not delete history. Dump fragments live under `docs/archive_fragments/`.

---
*Claim-0 Finish repair; SUPERSEDED lock retained.*
