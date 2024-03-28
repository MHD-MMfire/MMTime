from config import APP_NAMES
from datetime import datetime, timedelta

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
            "duration": str(self.duration()).split('.')[0],
            "scan_time": self.created_at,
        }

    def duration(self):
        if not self.end_time:
            return datetime.min - datetime.min
        return datetime.strptime(self.end_time, "%Y-%m-%d %H:%M:%S") - datetime.strptime(self.start_time,
                                                                                         "%Y-%m-%d %H:%M:%S")

    # returns duration that is in the given date
    def date_duration(self, date):
        if not self.end_time:
            return datetime.min - datetime.min
        # Convert date to datetime object with time set to 00:00:00
        start_of_date = datetime.combine(date, datetime.min.time())
        end_of_date = datetime.combine(date, datetime.max.time())

        # Parse session start and end times
        start_time = datetime.strptime(self.start_time, "%Y-%m-%d %H:%M:%S")
        end_time = datetime.strptime(self.end_time, "%Y-%m-%d %H:%M:%S")

        # Calculate overlap duration
        overlap_start = max(start_time, start_of_date)
        overlap_end = min(end_time, end_of_date)

        # If there's no overlap, return zero duration
        if overlap_start >= overlap_end:
            return datetime.min - datetime.min

        return overlap_end - overlap_start

    def app_name(self):
        return APP_NAMES.get(str(self.app_id), "Undefined")
