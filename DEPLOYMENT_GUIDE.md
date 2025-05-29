# 🚀 P2E Gaming Platform - Manual Deployment Guide

## 📋 Prerequisites

✅ **Your Testnet Account**: `ST34EECPKYV8K5P8HBXZ2KDB895V3MCDTR4P4QMAA`  
✅ **STX Balance**: 500 STX (sufficient for deployment)  
✅ **Mnemonic**: Configured in project  
✅ **Contracts**: 5 smart contracts ready for deployment  

## 🎯 Deployment Options

### **Option 1: Browser-Based Deployment (Recommended)**

1. **Install Hiro Wallet Browser Extension**
   - Go to: https://wallet.hiro.so/
   - Install the browser extension
   - Import your wallet using your mnemonic

2. **Use Stacks Explorer Contract Deploy**
   - Go to: https://explorer.stacks.co/sandbox/deploy?chain=testnet
   - Connect your Hiro Wallet
   - Deploy contracts one by one

3. **Contract Deployment Order**:
   ```
   1. platform-token.clar    (Deploy first - no dependencies)
   2. land-nft.clar         (Independent)
   3. blueprint-nft.clar    (Independent) 
   4. marketplace.clar      (May reference NFT contracts)
   5. game-rewards.clar     (May reference all contracts)
   ```

### **Option 2: Clarinet CLI (Alternative)**

```bash
# Navigate to contracts directory
cd contracts

# Deploy using Clarinet (if configuration issues are resolved)
clarinet deployments apply --testnet --no-dashboard
```

### **Option 3: Stacks CLI (Manual)**

```bash
# Get private key from mnemonic first
stx make_keychain -t

# Deploy each contract (replace PRIVATE_KEY with actual key)
stx deploy_contract contracts/platform-token.clar platform-token 50000 0 PRIVATE_KEY -t
stx deploy_contract contracts/land-nft.clar land-nft 60000 1 PRIVATE_KEY -t
stx deploy_contract contracts/blueprint-nft.clar blueprint-nft 55000 2 PRIVATE_KEY -t
stx deploy_contract contracts/marketplace.clar marketplace 70000 3 PRIVATE_KEY -t
stx deploy_contract contracts/game-rewards.clar game-rewards 80000 4 PRIVATE_KEY -t
```

## 📝 After Deployment

### **1. Update Contract Addresses**

Once deployed, update `frontend/.env.local`:

```env
# Replace with actual deployed contract addresses
NEXT_PUBLIC_PLATFORM_TOKEN_CONTRACT=ST34EECPKYV8K5P8HBXZ2KDB895V3MCDTR4P4QMAA.platform-token
NEXT_PUBLIC_LAND_NFT_CONTRACT=ST34EECPKYV8K5P8HBXZ2KDB895V3MCDTR4P4QMAA.land-nft
NEXT_PUBLIC_BLUEPRINT_NFT_CONTRACT=ST34EECPKYV8K5P8HBXZ2KDB895V3MCDTR4P4QMAA.blueprint-nft
NEXT_PUBLIC_MARKETPLACE_CONTRACT=ST34EECPKYV8K5P8HBXZ2KDB895V3MCDTR4P4QMAA.marketplace
NEXT_PUBLIC_GAME_REWARDS_CONTRACT=ST34EECPKYV8K5P8HBXZ2KDB895V3MCDTR4P4QMAA.game-rewards
```

### **2. Test Contract Functions**

```bash
# Test platform token
stx call_read_only_contract_func ST34EECPKYV8K5P8HBXZ2KDB895V3MCDTR4P4QMAA platform-token get-name -t

# Test land NFT
stx call_read_only_contract_func ST34EECPKYV8K5P8HBXZ2KDB895V3MCDTR4P4QMAA land-nft get-last-token-id -t
```

### **3. Restart Frontend**

```bash
cd frontend
npm run dev
```

## 🔗 Useful Links

- **Testnet Explorer**: https://explorer.stacks.co/?chain=testnet
- **Your Address**: https://explorer.stacks.co/address/ST34EECPKYV8K5P8HBXZ2KDB895V3MCDTR4P4QMAA?chain=testnet
- **Hiro Wallet**: https://wallet.hiro.so/
- **Stacks Sandbox**: https://explorer.stacks.co/sandbox/deploy?chain=testnet

## 🎮 Expected Deployment Costs

| Contract | Estimated Cost | Description |
|----------|---------------|-------------|
| platform-token | ~0.05 STX | SIP-010 fungible token |
| land-nft | ~0.06 STX | SIP-009 land NFTs |
| blueprint-nft | ~0.055 STX | SIP-009 blueprint NFTs |
| marketplace | ~0.07 STX | Trading marketplace |
| game-rewards | ~0.08 STX | Competition system |
| **Total** | **~0.315 STX** | **All contracts** |

## ✅ Success Criteria

After deployment, you should be able to:

1. **Connect Real Wallet** - Hiro Wallet connects to your platform
2. **See Real Balances** - Actual STX and token balances display
3. **Mint NFTs** - Create land and blueprint NFTs on-chain
4. **Trade Assets** - List and purchase items with real STX
5. **Verify on Explorer** - All transactions visible on Stacks Explorer

## 🚨 Next Steps After Deployment

1. **Update contract addresses** in environment variables
2. **Test all contract functions** through the frontend
3. **Verify transactions** on Stacks Explorer
4. **Enable real blockchain mode** in the frontend
5. **Test complete user flow** with real wallet

**Your P2E Gaming Platform will then be fully integrated with the Stacks blockchain! 🎮✨**
