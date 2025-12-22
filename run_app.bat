@echo off
title Giveaway Form Setup & Run
echo ==========================================
echo      Giveaway Form - Setup & Run
echo ==========================================
echo.

echo [1/3] Checking for Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Node.js was not found!
    echo Please install Node.js from https://nodejs.org/
    echo After installing, restart this script.
    echo.
    pause
    exit /b
)
echo Node.js is installed.
echo.

if not exist "node_modules" (
    echo [2/3] Installing dependencies...
    echo This might take a minute...
    call npm install
) else (
    echo [2/3] Dependencies already installed.
)

echo.
echo [3/3] Starting the application...
echo.
echo Open your browser to: http://localhost:3000
echo.
call npm run dev
pause
