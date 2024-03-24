from config import APP_NAMES
from datetime import datetime

# Define Session class
class Session:
    def __init__(self, app_id, code, start_time, end_time=None, created_at=None, s_id=None):
        self.id = s_id
        self.app_id = app_id
        self.code = code
        self.start_time = start_time
        self.end_time = end_time
        self.created_at = created_at or datetime.now()

    # converts query fetch results to session object(s)
    @staticmethod
    def create(fetch_result):
        return [Session(row[1], row[2], row[3], row[4], row[5], s_id=row[0])
                for row in fetch_result]

    def as_dict(self):
        return {
            "id": self.id,
            "app_id": self.app_id,
            "app_name": self.app_name(),
            "code": self.code,
            "start_time": self.start_time,
            "end_time": self.end_time,
            "duration": self.duration(),
            "scan_time": self.created_at,
        }

    def duration(self):
        return self.end_time - self.start_time

    # returns duration that is in the given date
    def date_duration(self, date):
        # todo
        pass

    def app_name(self):
        return APP_NAMES.get(self.app_id, "Undefined")
