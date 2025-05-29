import {
  AppConfig,
  UserSession,
  showConnect,
  openContractCall,
  openSTXTransfer,
} from '@stacks/connect';
import {
  StacksTestnet,
  StacksMainnet,
  StacksNetwork,
} from '@stacks/network';
import {
  callReadOnlyFunction,
  cvToJSON,
  standardPrincipalCV,
  uintCV,
  stringAsciiCV,
  stringUtf8CV,
  contractPrincipalCV,
  PostConditionMode,
  AnchorMode,
  makeContractCall,
  broadcastTransaction,
  TxBroadcastResult,
} from '@stacks/transactions';
import { StacksApiSocketClient } from '@stacks/blockchain-api-client';

// Configuration
const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

// Network configuration
export const getNetwork = (): StacksNetwork => {
  const networkType = process.env.NEXT_PUBLIC_NETWORK || 'testnet';
  return networkType === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
};

export const getApiUrl = (): string => {
  return process.env.NEXT_PUBLIC_STACKS_API_URL || 'https://api.testnet.hiro.so';
};

export const getContractAddress = (): string => {
  return process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'ST34EECPKYV8K5P8HBXZ2KDB895V3MCDTR4P4QMAA';
};

// Contract names
export const CONTRACTS = {
  LAND_NFT: 'land-nft',
  BLUEPRINT_NFT: 'blueprint-nft',
  MARKETPLACE: 'marketplace',
  GAME_REWARDS: 'game-rewards',
  PLATFORM_TOKEN: 'platform-token',
} as const;

// Wallet connection
export const connectWallet = () => {
  showConnect({
    appDetails: {
      name: 'P2E Gaming Platform',
      icon: '/logo.png',
    },
    redirectTo: '/',
    onFinish: () => {
      window.location.reload();
    },
    userSession,
  });
};

export const disconnectWallet = () => {
  userSession.signUserOut('/');
};

export const isWalletConnected = (): boolean => {
  return userSession.isUserSignedIn();
};

export const getUserAddress = (): string | null => {
  if (!isWalletConnected()) return null;
  return userSession.loadUserData().profile.stxAddress.testnet;
};

// Contract interaction utilities
export interface ContractCallOptions {
  contractName: string;
  functionName: string;
  functionArgs: any[];
  postConditionMode?: PostConditionMode;
  onFinish?: (data: TxBroadcastResult) => void;
  onCancel?: () => void;
}

export const callContract = async (options: ContractCallOptions) => {
  const {
    contractName,
    functionName,
    functionArgs,
    postConditionMode = PostConditionMode.Deny,
    onFinish,
    onCancel,
  } = options;

  const contractAddress = getContractAddress();
  const network = getNetwork();

  return openContractCall({
    network,
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    postConditionMode,
    onFinish: onFinish || (() => {}),
    onCancel: onCancel || (() => {}),
  });
};

export const readContract = async (
  contractName: string,
  functionName: string,
  functionArgs: any[] = [],
  senderAddress?: string
): Promise<any> => {
  const contractAddress = getContractAddress();
  const network = getNetwork();
  const sender = senderAddress || contractAddress;

  try {
    const result = await callReadOnlyFunction({
      network,
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      senderAddress: sender,
    });

    return cvToJSON(result);
  } catch (error) {
    console.error('Error reading contract:', error);
    throw error;
  }
};

// Land NFT functions
export const mintLand = async (
  recipient: string,
  x: number,
  y: number,
  terrain: string,
  size: number,
  onFinish?: (data: TxBroadcastResult) => void
) => {
  return callContract({
    contractName: CONTRACTS.LAND_NFT,
    functionName: 'mint-land',
    functionArgs: [
      standardPrincipalCV(recipient),
      uintCV(x),
      uintCV(y),
      stringAsciiCV(terrain),
      uintCV(size),
    ],
    onFinish,
  });
};

export const transferLand = async (
  tokenId: number,
  sender: string,
  recipient: string,
  onFinish?: (data: TxBroadcastResult) => void
) => {
  return callContract({
    contractName: CONTRACTS.LAND_NFT,
    functionName: 'transfer',
    functionArgs: [
      uintCV(tokenId),
      standardPrincipalCV(sender),
      standardPrincipalCV(recipient),
    ],
    onFinish,
  });
};

export const getLandData = async (tokenId: number) => {
  return readContract(CONTRACTS.LAND_NFT, 'get-land-data', [uintCV(tokenId)]);
};

export const getLandByCoordinates = async (x: number, y: number) => {
  return readContract(CONTRACTS.LAND_NFT, 'get-token-by-coordinates', [
    uintCV(x),
    uintCV(y),
  ]);
};

// Blueprint NFT functions
export const mintBlueprint = async (
  recipient: string,
  buildingType: string,
  rarity: string,
  onFinish?: (data: TxBroadcastResult) => void
) => {
  return callContract({
    contractName: CONTRACTS.BLUEPRINT_NFT,
    functionName: 'mint-blueprint',
    functionArgs: [
      standardPrincipalCV(recipient),
      stringAsciiCV(buildingType),
      stringAsciiCV(rarity),
    ],
    onFinish,
  });
};

export const getBlueprintData = async (tokenId: number) => {
  return readContract(CONTRACTS.BLUEPRINT_NFT, 'get-blueprint-data', [
    uintCV(tokenId),
  ]);
};

// Marketplace functions
export const listNFT = async (
  nftContract: string,
  tokenId: number,
  price: number,
  currency: string,
  duration?: number,
  onFinish?: (data: TxBroadcastResult) => void
) => {
  const args = [
    contractPrincipalCV(getContractAddress(), nftContract),
    uintCV(tokenId),
    uintCV(price),
    stringAsciiCV(currency),
  ];

  if (duration) {
    args.push(uintCV(duration));
  }

  return callContract({
    contractName: CONTRACTS.MARKETPLACE,
    functionName: 'list-nft',
    functionArgs: args,
    onFinish,
  });
};

export const buyNFT = async (
  listingId: number,
  onFinish?: (data: TxBroadcastResult) => void
) => {
  return callContract({
    contractName: CONTRACTS.MARKETPLACE,
    functionName: 'buy-nft',
    functionArgs: [uintCV(listingId)],
    onFinish,
  });
};

export const getListing = async (listingId: number) => {
  return readContract(CONTRACTS.MARKETPLACE, 'get-listing', [uintCV(listingId)]);
};

// Game rewards functions
export const createCompetition = async (
  name: string,
  description: string,
  competitionType: string,
  duration: number,
  maxParticipants: number,
  entryFee: number,
  onFinish?: (data: TxBroadcastResult) => void
) => {
  return callContract({
    contractName: CONTRACTS.GAME_REWARDS,
    functionName: 'create-competition',
    functionArgs: [
      stringUtf8CV(name),
      stringUtf8CV(description),
      stringAsciiCV(competitionType),
      uintCV(duration),
      uintCV(maxParticipants),
      uintCV(entryFee),
    ],
    onFinish,
  });
};

export const joinCompetition = async (
  competitionId: number,
  onFinish?: (data: TxBroadcastResult) => void
) => {
  return callContract({
    contractName: CONTRACTS.GAME_REWARDS,
    functionName: 'join-competition',
    functionArgs: [uintCV(competitionId)],
    onFinish,
  });
};

export const getCompetition = async (competitionId: number) => {
  return readContract(CONTRACTS.GAME_REWARDS, 'get-competition', [
    uintCV(competitionId),
  ]);
};

// Platform token functions
export const getTokenBalance = async (address: string) => {
  return readContract(CONTRACTS.PLATFORM_TOKEN, 'get-balance', [
    standardPrincipalCV(address),
  ]);
};

export const transferTokens = async (
  amount: number,
  sender: string,
  recipient: string,
  memo?: string,
  onFinish?: (data: TxBroadcastResult) => void
) => {
  const args = [
    uintCV(amount),
    standardPrincipalCV(sender),
    standardPrincipalCV(recipient),
  ];

  if (memo) {
    args.push(stringUtf8CV(memo));
  }

  return callContract({
    contractName: CONTRACTS.PLATFORM_TOKEN,
    functionName: 'transfer',
    functionArgs: args,
    onFinish,
  });
};

// WebSocket for real-time updates
export const createSocketClient = () => {
  return new StacksApiSocketClient({
    url: getApiUrl().replace('https://', 'wss://').replace('http://', 'ws://'),
  });
};

// Utility functions
export const formatSTX = (microSTX: number): string => {
  return (microSTX / 1000000).toFixed(6);
};

export const parseSTX = (stx: string): number => {
  return Math.floor(parseFloat(stx) * 1000000);
};

export const shortenAddress = (address: string, chars = 4): string => {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

export const getExplorerUrl = (txId: string): string => {
  const network = process.env.NEXT_PUBLIC_NETWORK || 'testnet';
  const baseUrl = network === 'mainnet'
    ? 'https://explorer.stacks.co'
    : 'https://explorer.stacks.co/?chain=testnet';
  return `${baseUrl}/txid/${txId}`;
};

// ============================================================================
// REAL CONTRACT INTERACTIONS
// ============================================================================

// Contract addresses (will be updated after deployment)
export const CONTRACT_ADDRESSES = {
  PLATFORM_TOKEN: process.env.NEXT_PUBLIC_PLATFORM_TOKEN_CONTRACT || 'ST34EECPKYV8K5P8HBXZ2KDB895V3MCDTR4P4QMAA.platform-token',
  LAND_NFT: process.env.NEXT_PUBLIC_LAND_NFT_CONTRACT || 'ST34EECPKYV8K5P8HBXZ2KDB895V3MCDTR4P4QMAA.land-nft',
  BLUEPRINT_NFT: process.env.NEXT_PUBLIC_BLUEPRINT_NFT_CONTRACT || 'ST34EECPKYV8K5P8HBXZ2KDB895V3MCDTR4P4QMAA.blueprint-nft',
  MARKETPLACE: process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT || 'ST34EECPKYV8K5P8HBXZ2KDB895V3MCDTR4P4QMAA.marketplace',
  GAME_REWARDS: process.env.NEXT_PUBLIC_GAME_REWARDS_CONTRACT || 'ST34EECPKYV8K5P8HBXZ2KDB895V3MCDTR4P4QMAA.game-rewards',
};

// Real STX balance fetching
export const getRealSTXBalance = async (address: string): Promise<number> => {
  try {
    const response = await fetch(`${getApiUrl()}/extended/v1/address/${address}/balances`);
    const data = await response.json();
    return parseInt(data.stx.balance) / 1000000; // Convert from microSTX
  } catch (error) {
    console.error('Error fetching STX balance:', error);
    return 0;
  }
};

// Real token balance fetching
export const getRealTokenBalance = async (address: string): Promise<number> => {
  try {
    const [contractAddress, contractName] = CONTRACT_ADDRESSES.PLATFORM_TOKEN.split('.');
    const functionArgs = [standardPrincipalCV(address)];

    const response = await fetch(`${getApiUrl()}/v2/contracts/call-read/${contractAddress}/${contractName}/get-balance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: address,
        arguments: functionArgs.map(arg => cvToHex(arg)),
      }),
    });

    const result = await response.json();
    if (result.okay) {
      const balance = hexToCV(result.result);
      return parseInt(balance.value.toString()) / 1000000; // Assuming 6 decimals
    }
    return 0;
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return 0;
  }
};

// Real land NFT data fetching
export const getRealLandData = async (landId: number): Promise<any> => {
  try {
    const [contractAddress, contractName] = CONTRACT_ADDRESSES.LAND_NFT.split('.');
    const functionArgs = [uintCV(landId)];

    const response = await fetch(`${getApiUrl()}/v2/contracts/call-read/${contractAddress}/${contractName}/get-land-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: contractAddress,
        arguments: functionArgs.map(arg => cvToHex(arg)),
      }),
    });

    const result = await response.json();
    if (result.okay) {
      return hexToCV(result.result);
    }
    return null;
  } catch (error) {
    console.error('Error fetching land data:', error);
    return null;
  }
};

// Real land minting transaction
export const mintRealLand = async (
  x: number,
  y: number,
  terrain: string,
  rarity: string,
  onFinish?: (data: any) => void
): Promise<void> => {
  const [contractAddress, contractName] = CONTRACT_ADDRESSES.LAND_NFT.split('.');

  const functionArgs = [
    intCV(x),
    intCV(y),
    stringAsciiCV(terrain),
    stringAsciiCV(rarity),
  ];

  const txOptions = {
    contractAddress,
    contractName,
    functionName: 'mint-land',
    functionArgs,
    network: getNetwork(),
    appDetails: {
      name: 'P2E Gaming Platform',
      icon: window.location.origin + '/favicon.ico',
    },
    onFinish: (data: any) => {
      console.log('Land minting transaction:', data);
      if (onFinish) onFinish(data);
    },
  };

  await openContractCall(txOptions);
};
