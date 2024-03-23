from datetime import datetime
# Define Session class
class Session:
    def __init__(self, app_id, code, start_time, end_time=None, created_at=None):
        self.app_id = app_id
        self.code = code
        self.start_time = start_time
        self.end_time = end_time
        self.created_at = created_at or datetime.now()

    # converts query fetch results to session object(s)
    @staticmethod
    def create(fetch_result, force_array=False):
        if fetch_result:
            if isinstance(fetch_result[0], tuple):
                # If fetch_result is a single tuple, return a single Session object
                return [Session(*fetch_result[0])] if force_array else Session(*fetch_result[0])
            else:
                # If fetch_result is a list of tuples, return a list of Session objects
                return [Session(*row) for row in fetch_result]
        else:
            return [] if force_array else None

