from datetime import datetime
# Define Session class
class Session:
    def __init__(self, app_id, code, start_time, end_time=None, created_at=None):
        self.app_id = app_id
        self.code = code
        self.start_time = start_time
        self.end_time = end_time
        self.created_at = created_at or datetime.now()
