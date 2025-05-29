#!/bin/bash

# 🎮 P2E Gaming Platform - Development Setup Script
# This script sets up the development environment for the P2E Gaming Platform

echo "🎮 Setting up P2E Gaming Platform Development Environment..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Current version: $(node -v)"
    echo "   Please upgrade Node.js from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "frontend" ] || [ ! -d "contracts" ]; then
    echo "❌ Please run this script from the stacks-p2e-platform root directory"
    exit 1
fi

echo "✅ Project structure verified"

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend

if [ ! -f "package.json" ]; then
    echo "❌ Frontend package.json not found"
    exit 1
fi

npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo "✅ Frontend dependencies installed"

# Go back to root
cd ..

# Install contract dependencies (if needed)
echo ""
echo "🔧 Setting up contracts..."
cd contracts

if [ -f "package.json" ]; then
    echo "📦 Installing contract dependencies..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install contract dependencies"
        exit 1
    fi
    
    echo "✅ Contract dependencies installed"
fi

# Go back to root
cd ..

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "🚀 To start development:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "🌐 Then open: http://localhost:3000"
echo ""
echo "📋 Available commands:"
echo "   Frontend:"
echo "     npm run dev      - Start development server"
echo "     npm run build    - Build for production"
echo "     npm run lint     - Run linting"
echo ""
echo "   Contracts:"
echo "     clarinet check   - Check contract syntax"
echo "     clarinet test    - Run contract tests"
echo "     clarinet console - Interactive console"
echo ""
echo "Happy coding! 🎮✨"
