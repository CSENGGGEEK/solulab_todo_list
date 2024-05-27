@echo off
setlocal

rem Check if Node.js is installed
node --version >nul 2>&1 || (
    echo Node.js is not installed. Please install Node.js manually.
    exit /b 1
)
echo Node.js is already installed.
echo Node.js version:
node --version
echo npm version:
npm --version
endlocal
