"""Invariant checks for the SUPERSEDED lock. Does not import src."""

import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]


class SupersedeInvariants(unittest.TestCase):
    def test_readme_banner(self):
        text = (ROOT / "README.md").read_text(encoding="utf-8")
        self.assertIn("SUPERSEDED", text)
        self.assertIn("Digital_Double_virtual_workforce", text)
        self.assertIn("CLAIM", text)

    def test_governance_lock(self):
        text = (ROOT / "GOVERNANCE.md").read_text(encoding="utf-8")
        self.assertIn("SUPERSEDED", text)
        self.assertIn("Claim level:** 0", text)
        self.assertIn("Digital_Double_virtual_workforce", text)

    def test_claim_status_cap(self):
        text = (ROOT / "CLAIM_STATUS.md").read_text(encoding="utf-8")
        self.assertIn("Claim level:** 0", text)
        self.assertIn("SUPERSEDED", text)
        lowered = text.lower()
        self.assertNotIn("production-ready", lowered)
        self.assertNotIn("validated fault", lowered)


if __name__ == "__main__":
    unittest.main()
