# 🎮 P2E Gaming Platform - Smart Contracts

## Overview
This directory contains the Clarity smart contracts for the P2E Gaming Platform built on Stacks blockchain.

## Contracts

### 🏞️ **Land NFT Contract** (`land-nft.clar`)
- **SIP-009 compliant** NFT contract for virtual land plots
- **Terrain types**: plains, forest, mountain, desert, coastal, volcanic
- **Coordinate system**: (-1000, -1000) to (1000, 1000)
- **Rarity system**: common, uncommon, rare, epic, legendary
- **Resource multipliers** based on terrain and rarity

### 🏗️ **Blueprint NFT Contract** (`blueprint-nft.clar`)
- **Building blueprints** as NFTs with construction properties
- **Building types**: residential, commercial, industrial, decorative
- **Resource consumption**: wood, stone, metal, energy
- **Output benefits**: population, resources, defense, happiness
- **Rarity affects efficiency** (legendary = 50% cost, 300% output)

### 🛒 **Marketplace Contract** (`marketplace.clar`)
- **Decentralized trading** for all NFT assets
- **Listing system** with STX pricing and duration
- **Offer/bidding mechanism** for negotiations
- **Platform fees** (2.5% configurable)
- **Sales history** and analytics

### 🏆 **Game Rewards Contract** (`game-rewards.clar`)
- **Competition system** with entry fees and prize pools
- **Daily quest mechanics** with consecutive day bonuses
- **Achievement system** with NFT/token rewards
- **Leaderboards** and ranking system

### 💰 **Platform Token Contract** (`platform-token.clar`)
- **SIP-010 compliant** fungible token
- **Staking system** with rewards (15.5% APR)
- **Governance features** for platform decisions
- **Utility token** for platform services

## Testing

Run contract tests:
```bash
cd contracts
npm test
```

## Deployment

Deploy to testnet:
```bash
clarinet deploy --network testnet
```

## Configuration

- **Testnet Address**: `ST34EECPKYV8K5P8HBXZ2KDB895V3MCDTR4P4QMAA`
- **Network**: Stacks Testnet
- **API**: https://api.testnet.hiro.so

## Features

✅ **True Asset Ownership** - All items are blockchain NFTs
✅ **Interoperable** - Assets can be traded across platforms  
✅ **Decentralized** - No central authority controls assets
✅ **Secure** - Protected by Bitcoin's security model
✅ **Transparent** - All transactions are publicly verifiable
