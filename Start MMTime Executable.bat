@echo off

REM Define Flask executable path
set EXE_PATH="path\to\your\flask\executable\MMTime.exe"

REM Set Flask app to production mode
set FLASK_ENV=production

REM Start Flask server
start "" cmd /k %EXE_PATH% run

REM Display message while waiting for server to start
echo "Wait for server to start..."

REM Wait for Flask server to start
timeout /t 5

REM Open web browser
start "" http://127.0.0.1:5000

REM Display message for opening browser
echo "Flask server started. Opening browser..."
