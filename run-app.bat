@echo off
REM Define the absolute path to the frontend directory
set FRONTEND_PATH=C:\Users\mur4t\Desktop\nwslicing\src\frontend

REM Check if the directory exists
IF NOT EXIST %FRONTEND_PATH% (
    echo Frontend directory not found at: %FRONTEND_PATH%
    exit /b 1
)

REM Navigate to the frontend directory
cd /d %FRONTEND_PATH%

REM Set the port to avoid conflicts
set PORT=3001

REM Check if react-scripts exists
IF NOT EXIST %FRONTEND_PATH%\node_modules\.bin\react-scripts.cmd (
    echo Installing react-scripts...
    call npm install --legacy-peer-deps
)

REM Start the React application using npx
echo Starting React application on port 3001...
npx react-scripts start 