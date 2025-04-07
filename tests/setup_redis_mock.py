import sys

class DummyRedis:
    def __init__(self, *args, **kwargs):
        pass

    def publish(self, *args, **kwargs):
        return None

sys.modules['redis'] = type('redis', (), {'Redis': DummyRedis})