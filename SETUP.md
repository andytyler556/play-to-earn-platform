# 🎮 P2E Gaming Platform - Local Setup Guide

## Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** - [Download here](https://git-scm.com/)

## 🚀 Quick Start

### 1. Navigate to the Frontend Directory
```bash
cd stacks-p2e-platform/frontend
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Start the Development Server
```bash
npm run dev
# or
yarn dev
```

### 4. Open Your Browser
Visit [http://localhost:3000](http://localhost:3000) to see your P2E Gaming Platform!

## 🎯 What You'll See

### **Welcome Page (No Wallet Connected)**
- Beautiful landing page with platform features
- Statistics and how-it-works section
- Call-to-action to connect wallet

### **Game Dashboard (Wallet Connected)**
- Interactive game world with land grid
- Inventory management system
- Marketplace for trading assets
- Competition and rewards system

## 🔧 Configuration

### Environment Variables
The platform is pre-configured with testnet settings in `.env.local`:
- **Network**: Stacks Testnet
- **API URL**: https://api.testnet.hiro.so
- **Contract Address**: Your testnet address

### Mock Data
For the local preview, the platform uses mock data for:
- Land plots and buildings
- Marketplace listings
- Competition data
- User balances

## 📱 Features to Explore

### 🗺️ **Game World**
- Zoom and pan the interactive land grid
- Switch between terrain, ownership, and building views
- Click land plots to see details
- Use building placement interface

### 📦 **Inventory**
- View owned land with filtering and sorting
- Manage blueprint collection
- Track token balances and staking
- Portfolio analytics

### 🛒 **Marketplace**
- Browse land and blueprint listings
- Filter by price, rarity, and terrain
- View market statistics
- Like and track favorite items

### 🏆 **Competitions**
- See active community challenges
- Track daily quest progress
- View achievement system
- Monitor leaderboards

## 🎨 Design Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Game-themed UI**: Custom colors and animations
- **Professional Layout**: Clean, modern interface
- **Accessibility**: Proper contrast and keyboard navigation

## 🔗 Navigation

- **Home**: Game world and dashboard
- **Inventory**: Asset management
- **Marketplace**: Trading interface
- **Competitions**: Challenges and rewards

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Tech Stack
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Query** for data fetching

## 🚀 Next Steps

1. **Connect a Stacks Wallet** (Hiro Wallet recommended)
2. **Deploy Smart Contracts** to testnet
3. **Integrate Real Blockchain Data**
4. **Add Backend API** for off-chain features
5. **Deploy to Production**

## 📞 Support

If you encounter any issues:
1. Check that Node.js v18+ is installed
2. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
3. Restart the development server
4. Check browser console for errors

## 🎉 Enjoy Your P2E Gaming Platform!

The platform showcases a complete blockchain gaming ecosystem with:
- ✅ Virtual land ownership
- ✅ Building and development
- ✅ Asset trading marketplace
- ✅ Community competitions
- ✅ Token economics
- ✅ Professional UI/UX

Happy gaming! 🎮
