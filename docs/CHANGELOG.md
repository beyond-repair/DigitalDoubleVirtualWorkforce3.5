# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Sweep-270 (2026-10-07)
- Extended `.github/workflows/supersede-guard.yml` to install `requirements.txt` and run `pytest -q` after the banner unittest. Claim remains 0. Not a product release.
- Added `SUPERSEDED.md` and `docs/DISCOVERY.md`. Archive flag not set.

### Claim-0 Finish repair (2026-10-02)
- Archived misnamed `src/core/` dump files to `docs/archive_fragments/`.
- Added working `DigitalDoubleAgent`, SQLite `StorageManager`, in-memory CAP cluster toys, offline `main.py` demo, and pytest suite.
- `model_quantizer` is RAM-advice only (no torch dependency).
- SUPERSEDED / Claim-0 banners retained; successor unchanged.

### Governance
- Sweep-193: claim cap recorded in `CLAIM_STATUS.md`. Banner invariant tests live in `tests_governance/` and do not import `src`.
- Historical bullets below are retained as prior notes. They are not a verification claim.

### Added
- Initial project structure
- Core agent framework
- Configuration system
- Basic task queue implementation
- Local model cache foundation
- Git version control setup
- Model quantization system with dynamic adaptation
- Integration between model cache and quantizer
- Test framework with pytest
- Unit tests for core components
- Coverage reporting
