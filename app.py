from config import DB_NAME
from session import Session
from flask import Flask, render_template
import sqlite3


app = Flask(__name__)

@app.route('/')
def dashboard():
    # Connect to the SQLite database
    conn = connect_db()
    cursor = conn.cursor()

    # Query data from the database
    cursor.execute("SELECT * FROM sessions")
    data = cursor.fetchall()
    conn.close()

    # Render the dashboard template with the retrieved data
    return render_template('dashboard.html', data=data)

def connect_db():
    return sqlite3.connect(DB_NAME)

if __name__ == '__main__':
    app.run(debug=True)