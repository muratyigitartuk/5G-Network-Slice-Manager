@echo off
REM Navigate to the frontend directory
cd src\frontend

IF NOT EXIST %CD% (
    echo Frontend directory not found at: %CD%
    exit /b 1
)

REM Set the port to avoid conflicts
set PORT=3001

REM Check if react-scripts exists
IF NOT EXIST node_modules\.bin\react-scripts.cmd (
    echo Installing react-scripts...
    call npm install --legacy-peer-deps
)

REM Start the React application using npx
npx react-scripts start 