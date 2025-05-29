@echo off
REM 🎮 P2E Gaming Platform - Development Setup Script (Windows)
REM This script sets up the development environment for the P2E Gaming Platform

echo 🎮 Setting up P2E Gaming Platform Development Environment...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected: 
node --version

REM Check if we're in the right directory
if not exist "README.md" (
    echo ❌ Please run this script from the stacks-p2e-platform root directory
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ❌ Frontend directory not found
    pause
    exit /b 1
)

if not exist "contracts" (
    echo ❌ Contracts directory not found
    pause
    exit /b 1
)

echo ✅ Project structure verified

REM Install frontend dependencies
echo.
echo 📦 Installing frontend dependencies...
cd frontend

if not exist "package.json" (
    echo ❌ Frontend package.json not found
    pause
    exit /b 1
)

call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

echo ✅ Frontend dependencies installed

REM Go back to root
cd ..

REM Install contract dependencies (if needed)
echo.
echo 🔧 Setting up contracts...
cd contracts

if exist "package.json" (
    echo 📦 Installing contract dependencies...
    call npm install
    
    if %errorlevel% neq 0 (
        echo ❌ Failed to install contract dependencies
        pause
        exit /b 1
    )
    
    echo ✅ Contract dependencies installed
)

REM Go back to root
cd ..

echo.
echo 🎉 Setup Complete!
echo.
echo 🚀 To start development:
echo    cd frontend
echo    npm run dev
echo.
echo 🌐 Then open: http://localhost:3000
echo.
echo 📋 Available commands:
echo    Frontend:
echo      npm run dev      - Start development server
echo      npm run build    - Build for production
echo      npm run lint     - Run linting
echo.
echo    Contracts:
echo      clarinet check   - Check contract syntax
echo      clarinet test    - Run contract tests
echo      clarinet console - Interactive console
echo.
echo Happy coding! 🎮✨
echo.
pause
