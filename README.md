<div align="center">

```
╔══════════════════════════════════════════════════════════════╗
║   ATOMIC DREAM LABS  ·  BEYOND-REPAIR                        ║
╚══════════════════════════════════════════════════════════════╝
```

# Digital Double Virtual Workforce 3.5

### SUPERSEDED Claim-0 offline sketch — not the canonical product

[![Lifecycle](https://img.shields.io/badge/●_SUPERSEDED-f59e0b?style=for-the-badge&labelColor=0f0f23)](https://github.com/beyond-repair/ADL-Governance)
[![Claim](https://img.shields.io/badge/Claim_0-22c55e?style=for-the-badge&labelColor=0f0f23)](https://github.com/beyond-repair/ADL-Governance/blob/main/docs/CLAIM_VALIDATION.md)
[![Governance](https://img.shields.io/badge/ADL--Governance-7c3aed?style=for-the-badge&labelColor=0f0f23)](https://github.com/beyond-repair/ADL-Governance)

```
LIFECYCLE   SUPERSEDED (Claim-0 runnable sketch)
CLAIM       0
SUCCESSOR   Digital_Double_virtual_workforce
NOT CLAIMED distributed production · CAP proof · torch quantization · live cluster
```

</div>

---

> **SUPERSEDED.** Canonical successor: [Digital_Double_virtual_workforce](https://github.com/beyond-repair/Digital_Double_virtual_workforce). No new feature work beyond Claim-0 repair.

## Status

**RUNNABLE SKETCH — NOT A COMPLETE PRODUCT.**

Historical 3.5-line dump (misnamed fragment files under `src/core/`) repaired so a stranger can clone, install, run an **offline** agent + SQLite task queue + in-memory CAP/quorum toy, and pass pytest. Product authority remains the successor repo.

| Item | State |
|------|--------|
| Classification | SUPERSEDED |
| Claim | 0 |
| Offline agent | `DigitalDoubleAgent` submit/run local tasks |
| CAP toy | `CapCluster` / quorum / partition status (in-memory) |
| Quantizer | RAM advice stub (**no torch**) |
| Dump fragments | Moved to `docs/archive_fragments/` |

## What works (Claim-0)

| Surface | Behavior |
| --- | --- |
| `python main.py` | Offline demo: agent tasks, quorum write, partition degrade, quant advice |
| `pytest` | config, agent, storage, CAP/monitor, rules/quant, main smoke + governance banners |
| `src/core/` | `agent`, `config`, `rules`, `storage`, `cap`, `monitor` |
| `src/models/model_quantizer.py` | Precision **advice** only |

## What is **not** claimed

- Production fault-tolerance or CAP-theorem management as a verified property
- Real multi-node networking, consensus, or replication
- Torch / dynamic quantization of real models
- Equivalence with the canonical `Digital_Double_virtual_workforce` product

## Quick start

```bash
git clone https://github.com/beyond-repair/DigitalDoubleVirtualWorkforce3.5.git
cd DigitalDoubleVirtualWorkforce3.5
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python main.py
pytest -q
```

## Layout

```
DigitalDoubleVirtualWorkforce3.5/
├── main.py                 ← Claim-0 demo
├── requirements.txt
├── pytest.ini
├── CLAIM_STATUS.md
├── GOVERNANCE.md
├── src/core/               ← agent, CAP toy, storage, rules
├── src/models/             ← quantizer advice stub
├── tests/                  ← pytest suite
├── tests_governance/       ← SUPERSEDED banner invariants
└── docs/archive_fragments/ ← historical misnamed dump files
```

## See also

- [CLAIM_STATUS.md](CLAIM_STATUS.md) — allowed / forbidden statements
- [GOVERNANCE.md](GOVERNANCE.md)
- Successor: [Digital_Double_virtual_workforce](https://github.com/beyond-repair/Digital_Double_virtual_workforce)
- [ADL-Governance](https://github.com/beyond-repair/ADL-Governance) · [Claim levels 0–5](https://github.com/beyond-repair/ADL-Governance/blob/main/docs/CLAIM_VALIDATION.md)

---

<div align="center">

**REWRITE · BUILD · TRANSCEND**

</div>
