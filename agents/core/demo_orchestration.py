# demo_orchestration.py
# Minimal example chaining planner and researcher agents

from agents.roles.planner_agent import plan_tasks
from agents.roles.researcher_agent import perform_research


def run_demo(goal):
    print(f"Goal: {goal}")
    tasks = plan_tasks(goal)
    print(f"Planned tasks: {tasks}")

    for task in tasks:
        result = perform_research(task)
        print(f"Research result for '{task}': {result}")


if __name__ == "__main__":
    run_demo("Build a multi-agent assistant")
    run_demo("Build a multi-agent assistant")