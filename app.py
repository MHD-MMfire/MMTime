from config import DB_NAME, TIMEZONE
from session import Session
from flask import Flask, render_template
import sqlite3
from datetime import datetime, timedelta
from pytz import timezone


app = Flask(__name__)
tz = timezone(TIMEZONE)

@app.route('/')
def dashboard():
    # Render the dashboard template with the retrieved sessions
    return render_template('dashboard.html', data=relative_date_sessions())


def relative_date_sessions(days_before=0, include_exceeded_prev_day=True):
    # Get the date in the timezone
    date_tz = datetime.now(tz).date() - timedelta(days=days_before)
    return date_sessions(date_tz, include_exceeded_prev_day)

def date_sessions(date, include_exceeded_prev_day):
    # Connect to the SQLite database
    conn = connect_db()
    cursor = conn.cursor()

    # Query sessions for today in the timezone
    q = "SELECT * FROM sessions WHERE DATE(start_time) = ?"
    params = (date,)
    if include_exceeded_prev_day:
        q += " OR DATE(end_time) = ?"
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