# 🛠️ Development Guide

## 🚀 Getting Started

### Quick Setup
Run the setup script for your platform:

**Windows:**
```bash
dev-setup.bat
```

**macOS/Linux:**
```bash
chmod +x dev-setup.sh
./dev-setup.sh
```

**Manual Setup:**
```bash
cd frontend
npm install
npm run dev
```

## 🏗️ Development Workflow

### 1. Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking
```

### 2. Smart Contract Development
```bash
cd contracts
clarinet check       # Syntax checking
clarinet test        # Run unit tests
clarinet console     # Interactive REPL
clarinet deploy      # Deploy to testnet
```

### 3. Git Workflow
```bash
git status           # Check changes
git add .            # Stage changes
git commit -m "..."  # Commit with message
git log --oneline    # View commit history
```

## 📁 Project Architecture

### Frontend Structure
```
frontend/src/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── inventory/         # Inventory page
│   ├── marketplace/       # Marketplace page
│   └── competitions/      # Competitions page
├── components/
│   ├── game/              # Game-specific components
│   ├── inventory/         # Inventory components
│   ├── marketplace/       # Marketplace components
│   ├── layout/            # Layout components
│   ├── providers/         # Context providers
│   └── ui/                # Reusable UI components
├── lib/
│   └── stacks.ts          # Stacks blockchain integration
└── styles/
    └── globals.css        # Global styles with Tailwind
```

### Smart Contracts
```
contracts/contracts/
├── land-nft.clar          # Land NFT (SIP-009)
├── blueprint-nft.clar     # Blueprint NFT (SIP-009)
├── marketplace.clar       # Decentralized marketplace
├── game-rewards.clar      # Competitions & rewards
└── platform-token.clar    # Platform token (SIP-010)
```

## 🎯 Development Features

### State Management
- **Zustand** for global state
- **React Query** for server state
- **Local Storage** for persistence

### Styling
- **Tailwind CSS** with custom game theme
- **Responsive design** for all devices
- **Dark/light mode** support (coming soon)

### Blockchain Integration
- **Stacks Connect** for wallet connection
- **Contract interactions** with error handling
- **Real-time updates** via WebSocket (planned)

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm test             # Run Jest tests
npm run test:watch  # Watch mode
npm run test:coverage # Coverage report
```

### Contract Testing
```bash
cd contracts
clarinet test        # Run all tests
clarinet test --filter land-nft  # Specific contract
```

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build        # Build production bundle
npm start           # Start production server
```

### Contract Deployment
```bash
cd contracts
clarinet deploy --network testnet
```

## 🔧 Configuration

### Environment Variables
```bash
# frontend/.env.local
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_STACKS_API_URL=https://api.testnet.hiro.so
NEXT_PUBLIC_CONTRACT_ADDRESS=ST34EECPKYV8K5P8HBXZ2KDB895V3MCDTR4P4QMAA
```

### Clarinet Configuration
```toml
# contracts/Clarinet.toml
[network.testnet]
stacks_node_rpc_address = "https://api.testnet.hiro.so"
```

## 📋 Development Checklist

### Before Committing
- [ ] Code compiles without errors
- [ ] Tests pass
- [ ] Linting passes
- [ ] TypeScript checks pass
- [ ] Components are responsive
- [ ] Accessibility guidelines followed

### Before Deploying
- [ ] All tests pass
- [ ] Production build works
- [ ] Environment variables set
- [ ] Smart contracts tested on testnet
- [ ] Security audit completed

## 🐛 Troubleshooting

### Common Issues

**Node.js Version:**
- Ensure Node.js 18+ is installed
- Use `nvm` to manage versions

**Dependencies:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**TypeScript Errors:**
```bash
npm run type-check
```

**Build Errors:**
```bash
npm run build
```

### Getting Help
1. Check the console for error messages
2. Review the documentation
3. Search existing issues
4. Create a new issue with details

## 🎮 Happy Coding!

This development guide will help you contribute to the P2E Gaming Platform. The platform showcases modern blockchain gaming with professional development practices.

**Build the future of gaming! 🚀✨**
