import os
import re
import subprocess
from datetime import datetime
from agents.core.logger import get_logger


class RefactorDocAgent:
    """
    Autonomous Refactoring & Documentation Agent

    Automates parsing markdown task files, executing code changes,
    updating documentation, and pushing commits to GitHub in a
    continuous loop.
    """

    def __init__(self, repo_path="."):
        self.logger = get_logger("RefactorDocAgent")
        self.logger.info("RefactorDocAgent initialized.")
        self.repo_path = repo_path
        self.markdown_files = [
            "README.md",
            "docs/DOCUMENT.md",
            "docs/project_blueprint.md",
            "docs/CHANGELOG.md"
        ]
        self.tasks = []

        self.logger.debug("Parsing markdown files for tasks...")

    def load_and_parse_markdown(self):
        """
        Load markdown files and extract tasks using regex patterns.
        """
        task_patterns = [
            r"- \[ \] (.+)",          # Unchecked checkbox tasks
            r"TODO: (.+)",            # TODOs
        ]
        parsed_tasks = []
        for md_file in self.markdown_files:
            md_path = os.path.join(self.repo_path, md_file)
            if not os.path.exists(md_path):
                continue
            with open(md_path, "r", encoding="utf-8") as f:
                content = f.read()
            for pattern in task_patterns:
                matches = re.findall(pattern, content)
                for match in matches:
                    parsed_tasks.append({
                        "description": match.strip(),
                        "file": md_file
                    })
        self.logger.info(f"Found {len(parsed_tasks)} tasks in markdown files.")
        self.tasks = parsed_tasks

    def map_instructions_to_codebase(self):
        """
        Map parsed task descriptions to specific files, functions,
        or classes in the codebase.
        """
        mapped_tasks = []
        for task in self.tasks:
            desc = task["description"]
            # Simple heuristics: look for file or class/function references
            target_file = None
            if "plugin adapter" in desc:
                target_file = "agents/core/plugin_adapters.py"
            elif "orchestrator" in desc:
                target_file = "agents/core/multi_agent_orchestrator.py"
            # Extend with more mappings as needed
            mapped_tasks.append({
                "description": desc,
                "file": target_file,
                "type": self._infer_task_type(desc)
            })
        self.tasks = mapped_tasks

    def _infer_task_type(self, description):
        """
        Infer task type from description keywords.
        """
        if "refactor" in description.lower():
            return "refactor"
        elif "fix" in description.lower() or "bug" in description.lower():
            return "bugfix"
        elif ("update" in description.lower() or
              "enhance" in description.lower()):
            return "enhancement"
        else:
            return "unknown"

    def execute_code_changes(self):
        """
        Execute code modifications based on mapped tasks.
        """
        for task in self.tasks:
            if not task.get("file"):
                continue  # Skip if no target file mapped
            # Placeholder: In real implementation, parse file, apply diff,
            # refactor, etc.
            # For now, just log intended action
                self.logger.info(
                    f"Would perform {task['type']} on {task['file']} "
                    f"for: {task['description']}"
                )
            print(
                f"Would perform {task['type']} on {task['file']} "
                f"for: {task['description']}"
            )

    def update_markdown_files(self):
        """
        Update markdown files: check off completed tasks and update changelog.
        """
        date_str = datetime.now().strftime("%Y-%m-%d")
        changelog_path = os.path.join(self.repo_path, "docs/CHANGELOG.md")
        changelog_entry = f"\n## [{date_str}]\n"
        for task in self.tasks:
            changelog_entry += (
                f"- {task['type'].capitalize()}: {task['description']}\n"
            )

        # Append to changelog
        with open(changelog_path, "a", encoding="utf-8") as f:
            f.write(changelog_entry)

        # Mark tasks as done in markdown files (simplified)
        for md_file in self.markdown_files:
            md_path = os.path.join(self.repo_path, md_file)
            if not os.path.exists(md_path):
                continue
            with open(md_path, "r", encoding="utf-8") as f:
                content = f.read()
            content = re.sub(r"- \[ \] (.+)", r"- [x] \1", content)
            with open(md_path, "w", encoding="utf-8") as f:
                f.write(content)

    def log_and_push_changes(self):
        """
        Commit and push changes to GitHub.
        """
        subprocess.run(["git", "add", "."], cwd=self.repo_path)
        commit_message = "[Auto] Completed tasks"
        subprocess.run(
            ["git", "commit", "-m", commit_message],
            cwd=self.repo_path
        )
        subprocess.run(["git", "push"], cwd=self.repo_path)

    def run_loop(self):
        """
        Main loop: parse markdown, map tasks, execute, update docs,
        commit, repeat.
        """
        while True:
            self.load_and_parse_markdown()
            if not self.tasks:
                print("No tasks found. Sleeping...")
                break  # For now, exit loop; replace with sleep for
                # continuous mode
            self.map_instructions_to_codebase()
            self.execute_code_changes()
            self.update_markdown_files()
            self.log_and_push_changes()