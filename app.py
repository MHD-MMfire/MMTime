from config import DB_NAME
from session import Session
import scanner
from flask import Flask, render_template, jsonify, request
import sqlite3
from datetime import datetime, timedelta
from pytz import timezone

app = Flask(__name__)

@app.route('/')
def dashboard():
    scanner.main()
    # Render the dashboard template with the retrieved sessions
    return render_template('dashboard.html', data=relative_date_sessions())

@app.route('/scan')
def scan():
    scanner.main()
    return render_template('job.html', message="Database was updated. You can close this page.")

@app.route('/scheduler')
def set_scheduler():
    # todo: create task in task scheduler
    return render_template('job.html',
                           message="Task successfully created in Windows Task Scheduler. You can close this page.")

@app.route('/date', methods=['GET'])
def select_date():
    selected_date = request.args.get("date")
    try:
        date = datetime.strptime(selected_date, "%Y-%m-%d")
    except ValueError:
        return "time data does not match the correct format", 400
    return jsonify(date_stats(date))

def date_stats(date):
    # Get date's sessions
    sessions_data = date_sessions(date, True)

    # Calculate stats
    date_duration = datetime.min - datetime.min  # timedelta()
    sessions_duration = datetime.min - datetime.min  # timedelta()
    apps = {}
    sessions = []
    row = 1
    for session in sessions_data:
        # session
        sessions.append(session.as_dict())
        # date
        date_duration += session.date_duration(date)
        sessions_duration += session.duration()
        # app
        if session.app_id not in apps:
            apps[session.app_id] = {"row": row,
                                    "app_id": session.app_id,
                                    "app_name": session.app_name(),
                                    "duration": session.duration(),
                                    "date_duration": session.date_duration(date)}
            row += 1
        else:
            apps[session.app_id]["duration"] += session.duration()
            apps[session.app_id]["date_duration"] += session.date_duration(date)

    for k in apps.keys():
        apps[k]["duration"] = str(apps[k]["duration"]).split('.')[0]
        apps[k]["date_duration"] = str(apps[k]["date_duration"]).split('.')[0]

    return {
        "date": date.strftime("%Y-%m-%d"),
        "date_duration": str(date_duration).split('.')[0],
        "sessions_duration": str(sessions_duration).split('.')[0],
        "apps": apps,
        "sessions": sessions,
    }

def relative_date_sessions(days_before=0, include_exceeded_prev_day=True):
    # Get the date in the timezone
    date_tz = datetime.now(timezone("Asia/Tehran")).date() - timedelta(days=days_before)
    return date_sessions(date_tz, include_exceeded_prev_day)

def date_sessions(date, include_exceeded_prev_day):
    # Connect to the SQLite database
    conn = connect_db()
    cursor = conn.cursor()

    # Query sessions for today in the timezone
    q = "SELECT * FROM sessions WHERE DATE(start_time) = DATE(?)"
    params = (date,)
    if include_exceeded_prev_day:
        q += " OR DATE(end_time) = DATE(?)"
        params = (date, date)
    cursor.execute(q, params)
    result = cursor.fetchall()
    conn.close()

    sessions = Session.create(result)
    return sessions

def connect_db():
    return sqlite3.connect(DB_NAME)

if __name__ == '__main__':
    app.run(debug=True)
