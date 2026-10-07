# Discovery — Sweep-270 (2026-10-07)

**Selection:** `random.SystemRandom().choice` over the authenticated search payload `user:beyond-repair` (`total_count` 83, `incomplete_results` false), order `updated` desc. Index 46. Subject `DigitalDoubleVirtualWorkforce3.5`.
**Default branch:** `master`
**Pre-sweep HEAD:** `1b5f46b7a8ae39dbf46f09813760cdb3b6506090`
**Tree:** 51 paths, not truncated.

## Surfaces

- `main.py`: Claim-0 offline demo (agent, SQLite `:memory:` queue, in-memory CAP toys, quant advice).
- `src/core/`: agent, config, rules, storage, cap, monitor.
- `src/models/model_quantizer.py`: RAM advice only. No torch.
- `docs/archive_fragments/`: historical misnamed dump files. Not imported by tests.
- `tests/`: pytest suite. `tests_governance/`: banner invariants. Does not import `src`.
- Dependencies: pydantic, typing-extensions, python-dotenv, pytest, pytest-cov. No lockfile.

## Prior CI

- supersede-guard run 37051311649 success on pre-sweep HEAD (banner unittest only).
- Dependabot graph update run 37051325456 success.

## Local verification this sweep

- `pytest -q`: 18 passed (Python 3.10.21, pytest 9.1.1).
- `python -m unittest discover -s tests_governance`: 3 tests OK.

Not a production, fault-tolerance, or successor-parity claim.
