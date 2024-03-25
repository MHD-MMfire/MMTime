@echo off

REM Define Python script path
set PYTHON_PATH="app.py"

REM Set Flask app to production mode
set FLASK_ENV=production

REM Start Flask server
start "" cmd /k python %PYTHON_PATH%

REM Display message while waiting for server to start
echo "Wait for server to start..."

REM Wait for Flask server to start
timeout /t 5

REM Open web browser
start "" http://127.0.0.1:5000

REM Display message for opening browser
echo "Flask server started. Opening browser..."
