import threading
import time

class ShortTermMemory:
    def __init__(self):
        self._store = {}

    def set(self, key, value):
        self._store[key] = value

    def get(self, key, default=None):
        return self._store.get(key, default)

    def clear(self):
        self._store.clear()

class LongTermMemory:
    def __init__(self):
        # Placeholder for vector DB integration
        self._store = {}

    def add_embedding(self, key, embedding, metadata=None):
        self._store[key] = {'embedding': embedding, 'metadata': metadata}

    def search(self, query_embedding, top_k=5):
        # Placeholder: return dummy results
        return list(self._store.items())[:top_k]

    def summarize(self):
        # Placeholder summarization
        return "Summary of long-term memory."

class SummarizerAgent(threading.Thread):
    def __init__(self, long_term_memory, interval=300):
        super().__init__(daemon=True)
        self.ltm = long_term_memory
        self.interval = interval
        self.stop_event = threading.Event()

    def run(self):
        while not self.stop_event.is_set():
            summary = self.ltm.summarize()
            print(f"[Summarizer] {summary}")
            time.sleep(self.interval)

    def stop(self):
        self.stop_event.set()

# Instantiate memories
short_term_memory = ShortTermMemory()
long_term_memory = LongTermMemory()
summarizer_agent = SummarizerAgent(long_term_memory)

if __name__ == "__main__":
    summarizer_agent.start()
    # Example usage
    short_term_memory.set("task1", {"status": "in_progress"})
    long_term_memory.add_embedding("task1", [0.1, 0.2, 0.3], {"desc": "Example embedding"})
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        summarizer_agent.stop()