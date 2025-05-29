#!/usr/bin/env node

/**
 * Secure Deployment Script for P2E Gaming Platform
 * 
 * This script handles secure contract deployment without storing
 * sensitive data in files or version control.
 * 
 * SECURITY FEATURES:
 * - Prompts for sensitive inputs at runtime
 * - Never logs or stores private keys
 * - Validates all inputs before deployment
 * - Uses secure environment variable handling
 */

const fs = require('fs');
const path = require('path');
const { securePrompt, validateMnemonic } = require('./secure-key-manager');

/**
 * Validate environment setup
 */
function validateEnvironment() {
  console.log('🔍 Validating environment setup...');
  
  const requiredVars = [
    'NEXT_PUBLIC_NETWORK',
    'NEXT_PUBLIC_STACKS_API_URL'
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  console.log('✅ Environment validation passed');
}

/**
 * Validate contract files exist
 */
function validateContractFiles() {
  console.log('📁 Validating contract files...');
  
  const contractsDir = path.join(__dirname, '../contracts/contracts');
  const requiredContracts = [
    'platform-token.clar',
    'land-nft.clar',
    'blueprint-nft.clar',
    'marketplace.clar',
    'game-rewards.clar'
  ];
  
  const missing = requiredContracts.filter(contract => {
    const contractPath = path.join(contractsDir, contract);
    return !fs.existsSync(contractPath);
  });
  
  if (missing.length > 0) {
    throw new Error(`Missing contract files: ${missing.join(', ')}`);
  }
  
  console.log('✅ All contract files found');
}

/**
 * Check STX balance for deployment
 */
async function checkBalance(address) {
  console.log('💰 Checking STX balance...');
  
  const network = process.env.NEXT_PUBLIC_NETWORK;
  const apiUrl = process.env.NEXT_PUBLIC_STACKS_API_URL;
  
  try {
    const response = await fetch(`${apiUrl}/extended/v1/address/${address}/balances`);
    const data = await response.json();
    const balance = parseInt(data.stx.balance) / 1000000;
    
    console.log(`💰 Current balance: ${balance} STX`);
    
    if (balance < 1) {
      throw new Error('Insufficient STX balance for deployment. Need at least 1 STX.');
    }
    
    return balance;
  } catch (error) {
    throw new Error(`Failed to check balance: ${error.message}`);
  }
}

/**
 * Generate deployment plan
 */
function generateDeploymentPlan() {
  const contracts = [
    { name: 'platform-token', cost: 0.05, description: 'SIP-010 Platform Token' },
    { name: 'land-nft', cost: 0.06, description: 'SIP-009 Land NFTs' },
    { name: 'blueprint-nft', cost: 0.055, description: 'SIP-009 Blueprint NFTs' },
    { name: 'marketplace', cost: 0.07, description: 'Decentralized Marketplace' },
    { name: 'game-rewards', cost: 0.08, description: 'Competition & Rewards' }
  ];
  
  const totalCost = contracts.reduce((sum, contract) => sum + contract.cost, 0);
  
  console.log('\n📋 Deployment Plan:');
  console.log('==================');
  contracts.forEach((contract, index) => {
    console.log(`${index + 1}. ${contract.name} - ${contract.description} (~${contract.cost} STX)`);
  });
  console.log(`\nTotal estimated cost: ${totalCost} STX`);
  
  return { contracts, totalCost };
}

/**
 * Create deployment configuration
 */
async function createDeploymentConfig(address, network) {
  const config = {
    deployer: address,
    network: network,
    timestamp: new Date().toISOString(),
    contracts: {}
  };
  
  // This will be updated with actual contract addresses after deployment
  const contractNames = ['platform-token', 'land-nft', 'blueprint-nft', 'marketplace', 'game-rewards'];
  
  contractNames.forEach(name => {
    config.contracts[name] = `${address}.${name}`;
  });
  
  return config;
}

/**
 * Update environment variables with deployed contract addresses
 */
function updateEnvironmentFile(config) {
  const envPath = path.join(__dirname, '../frontend/.env.local');
  
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Update contract addresses
  const updates = {
    'NEXT_PUBLIC_PLATFORM_TOKEN_CONTRACT': config.contracts['platform-token'],
    'NEXT_PUBLIC_LAND_NFT_CONTRACT': config.contracts['land-nft'],
    'NEXT_PUBLIC_BLUEPRINT_NFT_CONTRACT': config.contracts['blueprint-nft'],
    'NEXT_PUBLIC_MARKETPLACE_CONTRACT': config.contracts['marketplace'],
    'NEXT_PUBLIC_GAME_REWARDS_CONTRACT': config.contracts['game-rewards']
  };
  
  Object.entries(updates).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    const newLine = `${key}=${value}`;
    
    if (envContent.match(regex)) {
      envContent = envContent.replace(regex, newLine);
    } else {
      envContent += `\n${newLine}`;
    }
  });
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Environment file updated with contract addresses');
}

/**
 * Main deployment function
 */
async function main() {
  console.log('🚀 P2E Gaming Platform - Secure Deployment');
  console.log('==========================================\n');
  
  try {
    // Step 1: Validate environment
    validateEnvironment();
    validateContractFiles();
    
    // Step 2: Get deployment details
    console.log('\n🔐 Deployment Authentication');
    console.log('Please provide your deployment credentials:');
    
    const mnemonic = await securePrompt('Mnemonic phrase (hidden): ');
    validateMnemonic(mnemonic);
    
    const address = await new Promise(resolve => {
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question('Deployer address: ', (answer) => {
        rl.close();
        resolve(answer);
      });
    });
    
    // Step 3: Check balance
    await checkBalance(address);
    
    // Step 4: Show deployment plan
    const { contracts, totalCost } = generateDeploymentPlan();
    
    console.log('\n⚠️  SECURITY CONFIRMATION');
    console.log('========================');
    console.log(`Network: ${process.env.NEXT_PUBLIC_NETWORK}`);
    console.log(`Deployer: ${address}`);
    console.log(`Total cost: ~${totalCost} STX`);
    
    const confirm = await new Promise(resolve => {
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question('\nProceed with deployment? (yes/no): ', (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === 'yes');
      });
    });
    
    if (!confirm) {
      console.log('❌ Deployment cancelled by user');
      return;
    }
    
    // Step 5: Create deployment configuration
    const config = await createDeploymentConfig(address, process.env.NEXT_PUBLIC_NETWORK);
    
    // Step 6: Show next steps (actual deployment would happen here)
    console.log('\n🎯 Next Steps:');
    console.log('==============');
    console.log('1. Use Hiro Wallet browser extension for deployment');
    console.log('2. Go to: https://explorer.stacks.co/sandbox/deploy?chain=testnet');
    console.log('3. Deploy contracts in this order:');
    
    contracts.forEach((contract, index) => {
      console.log(`   ${index + 1}. ${contract.name}.clar`);
    });
    
    console.log('\n4. Update contract addresses in environment file');
    console.log('5. Test deployment with frontend application');
    
    // Step 7: Update environment file with expected addresses
    updateEnvironmentFile(config);
    
    console.log('\n✅ Deployment preparation complete!');
    console.log('📝 Environment file updated with contract address templates');
    console.log('🔒 No sensitive data was stored in files');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

// Run deployment if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, validateEnvironment, validateContractFiles };
