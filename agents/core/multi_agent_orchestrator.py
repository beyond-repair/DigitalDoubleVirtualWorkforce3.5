import json
import threading
import time
import redis

# Initialize Redis client (default localhost:6379)
redis_client = redis.Redis(
    host='localhost',
    port=6379,
    db=0,
    decode_responses=True
)

class AgentRegistry:
    def __init__(self):
        self.agents = {}

    def register(self, name, func):
        self.agents[name] = func

    def get(self, name):
        return self.agents.get(name)

class MultiAgentOrchestrator:
    def __init__(self, redis_channel='agent_channel'):
        self.registry = AgentRegistry()
        self.channel = redis_channel
        self.stop_event = threading.Event()

    def start(self):
        threading.Thread(target=self._listen_loop, daemon=True).start()

    def stop(self):
        self.stop_event.set()

    def _listen_loop(self):
        pubsub = redis_client.pubsub()
        pubsub.subscribe(self.channel)
        for message in pubsub.listen():
            if self.stop_event.is_set():
                break
            if message['type'] == 'message':
                try:
                    data = json.loads(message['data'])
                    self.route_message(data)
                except Exception as e:
                    print(f"Error processing message: {e}")

    def route_message(self, message):
        recipient = message.get('recipient')
        agent_func = self.registry.get(recipient)
        if agent_func:
            try:
                response = agent_func(message)
                if response:
                    self.publish_message(response)
            except Exception as e:
                print(f"Agent '{recipient}' error: {e}")
                self.handle_fallback(message)
        else:
            print(f"No agent registered as '{recipient}'")
            self.handle_fallback(message)

    def publish_message(self, message):
        redis_client.publish(self.channel, json.dumps(message))

    def handle_fallback(self, failed_message):
        # Basic fallback: mark as failed,
        # could add retries or alternative agents
        failed_message['status'] = 'failed'
        print(f"Fallback handling for message: {failed_message}")

    def optimize_subtasks(self, task):
        # Placeholder for subtask optimization logic
        # For now, just return the task as-is
        return [task]

# Example standardized message schema:
# {
#   "sender": "planner",
#   "recipient": "coder",
#   "task": "implement_feature",
#   "payload": {...},
#   "status": "pending"
# }

# Example agent wrapper
def planner_agent(message):
    goal = message.get('payload', {}).get('goal', '')
    subtasks = ["Write code for " + goal, "Test " + goal]
    for sub in subtasks:
        orchestrator.publish_message({
            "sender": "planner",
            "recipient": "coder",
            "task": "generate_code",
            "payload": {"description": sub},
            "status": "pending"
        })
    return None

def coder_agent(message):
    description = message.get('payload', {}).get('description', '')
    code = f"# Code for: {description}\nprint('Hello from coder')"
    response = {
        "sender": "coder",
        "recipient": "tester",
        "task": "test_code",
        "payload": {"code": code},
        "status": "pending"
    }
    return response

def tester_agent(message):
    code = message.get('payload', {}).get('code', '')
    # Simulate test result
    test_result = "success" if "print" in code else "failure"
    response = {
        "sender": "tester",
        "recipient": "integrator",
        "task": "integrate_code",
        "payload": {"code": code, "test_result": test_result},
        "status": "pending"
    }
    return response

def integrator_agent(message):
    code = message.get('payload', {}).get('code', '')
    test_result = message.get('payload', {}).get('test_result', '')
    if test_result == "success":
        print(f"Integrating code:\n{code}")
    else:
        print("Integration failed due to test failure.")
    return None

# Instantiate orchestrator and register agents
orchestrator = MultiAgentOrchestrator()
orchestrator.registry.register('planner', planner_agent)
orchestrator.registry.register('coder', coder_agent)
orchestrator.registry.register('tester', tester_agent)
orchestrator.registry.register('integrator', integrator_agent)

if __name__ == "__main__":
    orchestrator.start()
    # Example: send initial goal message
    orchestrator.publish_message({
        "sender": "user",
        "recipient": "planner",
        "task": "plan_project",
        "payload": {"goal": "Build a calculator"},
        "status": "pending"
    })
    # Keep main thread alive
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        orchestrator.stop()