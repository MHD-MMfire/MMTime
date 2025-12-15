from config import STEAM_PATH, DB_NAME
from session import Session
import re
import sqlite3
from datetime import datetime
from time import time

blacklist_names = ["UbisoftGameLauncher.exe"]
blacklist_pids = set()
active_app = None
active_pid = None

# Function to parse log lines and extract session information
def parse_log(log_line):
    global blacklist_names, blacklist_pids, active_app, active_pid

    start_session_pattern = r'\[(.*?)\] AppID (\d+) adding PID (\d+) as a tracked process ""'
    end_session_pattern = r'\[(.*?)\] AppID (\d+) no longer tracking PID (\d+)'

    start_match = re.match(start_session_pattern, log_line)
    end_match = re.match(end_session_pattern, log_line)

    if start_match:
        timestamp_str, app_id, pid = start_match.groups()
        start_time = datetime.strptime(timestamp_str, "%Y-%m-%d %H:%M:%S")

        # Check if blacklisted
        if any(blacklist_name.lower() in log_line.lower() for blacklist_name in blacklist_names):
            blacklist_pids.add(pid)
            return None

        # if same app is already running, skip this
        if active_app == app_id:
            return None
        active_app = app_id
        active_pid = pid

        return Session(int(app_id), pid, start_time)
    elif end_match:
        timestamp_str, app_id, pid = end_match.groups()
        end_time = datetime.strptime(timestamp_str, "%Y-%m-%d %H:%M:%S")

        if pid in blacklist_pids:
            blacklist_pids.remove(pid)
            return None

        if active_app == app_id and active_pid == pid:
            active_app = None
            active_pid = None
            return int(app_id), pid, end_time

    return None

# Function to create database table if it doesn't exist already
def create_db(conn):
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS sessions (
                          id INTEGER PRIMARY KEY,
                          app_id INTEGER NOT NULL,
                          pid INTEGER NOT NULL,
                          start_time DATETIME NOT NULL,
                          end_time DATETIME,
                          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                          UNIQUE(app_id, pid, start_time)
                          )''')
    cursor.close()
    conn.commit()

# Function to insert session object into SQLite database
def insert_db(session, conn):
    cursor = conn.cursor()
    try:
        if isinstance(session, Session):
            cursor.execute('''INSERT INTO sessions (app_id, pid, start_time, end_time, created_at)
                              VALUES (?, ?, ?, ?, ?)''',
                           (session.app_id, session.pid, session.start_time, session.end_time, session.created_at))
            conn.commit()
        else:
            app_id = session[0]
            pid = session[1]
            end_time = session[2]
            cursor.execute('''SELECT id
                                  FROM sessions
                                  WHERE app_id = ? AND end_time IS NULL AND pid = ? AND start_time < ?
                                  ORDER BY start_time DESC
                                  LIMIT 1''',
                           (app_id, pid, end_time))  # start time < end time
            row = cursor.fetchone()
            if row is not None:
                id_value = row[0]
                cursor.execute('UPDATE sessions SET end_time = ? WHERE id = ?',
                               (end_time, id_value))
                conn.commit()

    except sqlite3.IntegrityError as e:
        pass
    finally:
        cursor.close()

def scan_file(path, conn):
    with open(path, 'r') as f:
        for line in f:
            session_info = parse_log(line)
            if session_info:
                insert_db(session_info, conn)

# Main function to parse log file and insert session objects into database
def main():
    steam_log = STEAM_PATH + "/logs/gameprocess_log.txt"
    t = time()
    print("Connecting to database...")
    with sqlite3.connect(DB_NAME) as conn:
        create_db(conn)
        print("Scanning Log File...")
        scan_file(steam_log, conn)

    print(f"Scan Complete! Database Updated! Job took {time() - t} seconds.")

if __name__ == "__main__":
    main()
