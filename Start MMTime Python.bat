@echo off

REM Start Flask server
start "MMTime Server" cmd /k "%cd%\venv\Scripts\python.exe %cd%\MMTime.py"

REM Display message while waiting for server to start
echo "Wait for server to start..."

REM Wait for Flask server to start
timeout /t 3

REM Display message for opening browser
echo "Flask server started. Opening browser..."

REM Open web browser
start "" http://127.0.0.1:5000