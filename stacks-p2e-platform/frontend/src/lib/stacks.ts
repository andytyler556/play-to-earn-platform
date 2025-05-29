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
// import { StacksApiSocketClient } from '@stacks/blockchain-api-client';

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
  // return new StacksApiSocketClient({
  //   url: getApiUrl().replace('https://', 'wss://').replace('http://', 'ws://'),
  // });
  return null; // Temporarily disabled for local preview
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
