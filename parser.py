from config import STEAM_PATH, DB_NAME
import re
import sqlite3
from datetime import datetime

steam_log = STEAM_PATH + "/logs/compat_log.txt"

# Define Session class
class Session:
    def __init__(self, app_id, code, start_time, end_time=None, created_at=None):
        self.app_id = app_id
        self.code = code
        self.start_time = start_time
        self.end_time = end_time
        self.created_at = created_at or datetime.now()

# Function to parse log lines and extract session information
def parse_log(log_line):
    start_session_pattern = r'\[(.*?)\] StartSession: appID (\d+) session (\w+)'
    end_session_pattern = r'\[(.*?)\] OnAppLifetimeNotification: release session\(s\) for appID (\d+)'

    start_match = re.match(start_session_pattern, log_line)
    end_match = re.match(end_session_pattern, log_line)

    if start_match:
        timestamp_str, app_id, code = start_match.groups()
        start_time = datetime.strptime(timestamp_str, "%Y-%m-%d %H:%M:%S")
        return Session(int(app_id), code, start_time)
    elif end_match:
        timestamp_str, app_id = end_match.groups()
        end_time = datetime.strptime(timestamp_str, "%Y-%m-%d %H:%M:%S")
        return int(app_id), end_time
    else:
        return None

# Function to create database table if it doesn't exist already
def create_db(conn):
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS sessions (
                          id INTEGER PRIMARY KEY,
                          app_id INTEGER NOT NULL,
                          code TEXT UNIQUE NOT NULL,
                          start_time TIMESTAMP NOT NULL,
                          end_time TIMESTAMP,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                          )''')
    cursor.close()
    conn.commit()

# Function to insert session object into SQLite database
def insert_db(session, conn):
    cursor = conn.cursor()
    try:
        if isinstance(session, Session):
            cursor.execute('''INSERT INTO sessions (app_id, code, start_time, end_time, created_at)
                              VALUES (?, ?, ?, ?, ?)''',
                           (session.app_id, session.code, session.start_time, session.end_time, session.created_at))
        else:
            cursor.execute('''UPDATE sessions
                              SET end_time = ?
                              WHERE app_id = ? AND end_time IS NULL
                              ORDER BY start_time DESC
                              LIMIT 1''',
                           (session[1], session[0]))
        conn.commit()

    except sqlite3.IntegrityError as e:
        pass
    finally:
        cursor.close()

# Main function to parse log file and insert session objects into database
def main():
    print("Connecting to database...")
    with sqlite3.connect(DB_NAME) as conn:
        create_db(conn)
        print("Scanning Log File...")
        with open(steam_log, 'r') as f:
            for line in f:
                session_info = parse_log(line)
                if session_info:
                    insert_db(session_info, conn)
    print("Scan Complete! Database Updated!")

if __name__ == "__main__":
    main()
