// Blockchain contract integration for Stacks P2E Gaming Platform
import { 
  callReadOnlyFunction, 
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  standardPrincipalCV,
  uintCV,
  stringAsciiCV,
  intCV,
  someCV,
  noneCV
} from '@stacks/transactions';
import { StacksNetwork, StacksTestnet, StacksMainnet } from '@stacks/network';
import { openContractCall } from '@stacks/connect';

// Contract addresses - these should be set after deployment
export const CONTRACT_ADDRESSES = {
  LAND_NFT: process.env.NEXT_PUBLIC_LAND_CONTRACT_ADDRESS || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.land-nft',
  BLUEPRINT_NFT: process.env.NEXT_PUBLIC_BLUEPRINT_CONTRACT_ADDRESS || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.blueprint-nft',
  MARKETPLACE: process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.marketplace',
  PLATFORM_TOKEN: process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.platform-token',
  GAME_REWARDS: process.env.NEXT_PUBLIC_REWARDS_CONTRACT_ADDRESS || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.game-rewards'
};

// Network configuration
export const getStacksNetwork = (): StacksNetwork => {
  const isMainnet = process.env.NEXT_PUBLIC_STACKS_NETWORK === 'mainnet';
  return isMainnet ? new StacksMainnet() : new StacksTestnet();
};

// Contract interaction utilities
export class ContractService {
  private network: StacksNetwork;

  constructor() {
    this.network = getStacksNetwork();
  }

  // Land NFT Contract Functions
  async getLandData(tokenId: number) {
    try {
      const [contractAddress, contractName] = CONTRACT_ADDRESSES.LAND_NFT.split('.');
      
      const result = await callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: 'get-land-data',
        functionArgs: [uintCV(tokenId)],
        network: this.network,
        senderAddress: contractAddress
      });

      return result;
    } catch (error) {
      console.error('Error fetching land data:', error);
      throw error;
    }
  }

  async getTokenByCoordinates(x: number, y: number) {
    try {
      const [contractAddress, contractName] = CONTRACT_ADDRESSES.LAND_NFT.split('.');
      
      const result = await callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: 'get-token-by-coordinates',
        functionArgs: [intCV(x), intCV(y)],
        network: this.network,
        senderAddress: contractAddress
      });

      return result;
    } catch (error) {
      console.error('Error fetching token by coordinates:', error);
      throw error;
    }
  }

  async getLandOwner(tokenId: number) {
    try {
      const [contractAddress, contractName] = CONTRACT_ADDRESSES.LAND_NFT.split('.');
      
      const result = await callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: 'get-owner',
        functionArgs: [uintCV(tokenId)],
        network: this.network,
        senderAddress: contractAddress
      });

      return result;
    } catch (error) {
      console.error('Error fetching land owner:', error);
      throw error;
    }
  }

  async getLastLandTokenId() {
    try {
      const [contractAddress, contractName] = CONTRACT_ADDRESSES.LAND_NFT.split('.');
      
      const result = await callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: 'get-last-token-id',
        functionArgs: [],
        network: this.network,
        senderAddress: contractAddress
      });

      return result;
    } catch (error) {
      console.error('Error fetching last land token ID:', error);
      throw error;
    }
  }

  // Blueprint NFT Contract Functions
  async getBlueprintData(tokenId: number) {
    try {
      const [contractAddress, contractName] = CONTRACT_ADDRESSES.BLUEPRINT_NFT.split('.');
      
      const result = await callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: 'get-blueprint-data',
        functionArgs: [uintCV(tokenId)],
        network: this.network,
        senderAddress: contractAddress
      });

      return result;
    } catch (error) {
      console.error('Error fetching blueprint data:', error);
      throw error;
    }
  }

  async getBlueprintOwner(tokenId: number) {
    try {
      const [contractAddress, contractName] = CONTRACT_ADDRESSES.BLUEPRINT_NFT.split('.');
      
      const result = await callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: 'get-owner',
        functionArgs: [uintCV(tokenId)],
        network: this.network,
        senderAddress: contractAddress
      });

      return result;
    } catch (error) {
      console.error('Error fetching blueprint owner:', error);
      throw error;
    }
  }

  async getLastBlueprintTokenId() {
    try {
      const [contractAddress, contractName] = CONTRACT_ADDRESSES.BLUEPRINT_NFT.split('.');
      
      const result = await callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: 'get-last-token-id',
        functionArgs: [],
        network: this.network,
        senderAddress: contractAddress
      });

      return result;
    } catch (error) {
      console.error('Error fetching last blueprint token ID:', error);
      throw error;
    }
  }

  // Marketplace Contract Functions
  async getMarketplaceListing(listingId: number) {
    try {
      const [contractAddress, contractName] = CONTRACT_ADDRESSES.MARKETPLACE.split('.');
      
      const result = await callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: 'get-listing',
        functionArgs: [uintCV(listingId)],
        network: this.network,
        senderAddress: contractAddress
      });

      return result;
    } catch (error) {
      console.error('Error fetching marketplace listing:', error);
      throw error;
    }
  }

  async getLastListingId() {
    try {
      const [contractAddress, contractName] = CONTRACT_ADDRESSES.MARKETPLACE.split('.');
      
      const result = await callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: 'get-last-listing-id',
        functionArgs: [],
        network: this.network,
        senderAddress: contractAddress
      });

      return result;
    } catch (error) {
      console.error('Error fetching last listing ID:', error);
      throw error;
    }
  }

  async getPlatformFeeRate() {
    try {
      const [contractAddress, contractName] = CONTRACT_ADDRESSES.MARKETPLACE.split('.');
      
      const result = await callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: 'get-platform-fee-rate',
        functionArgs: [],
        network: this.network,
        senderAddress: contractAddress
      });

      return result;
    } catch (error) {
      console.error('Error fetching platform fee rate:', error);
      throw error;
    }
  }

  // Transaction functions (require wallet connection)
  async mintLand(
    recipient: string,
    x: number,
    y: number,
    terrain: string,
    size: number,
    userSession: any
  ) {
    try {
      const [contractAddress, contractName] = CONTRACT_ADDRESSES.LAND_NFT.split('.');

      const txOptions = {
        contractAddress,
        contractName,
        functionName: 'mint-land',
        functionArgs: [
          standardPrincipalCV(recipient),
          intCV(x),
          intCV(y),
          stringAsciiCV(terrain),
          uintCV(size)
        ],
        senderKey: userSession.loadUserData().profile.stxAddress.testnet,
        network: this.network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow
      };

      const transaction = await makeContractCall(txOptions);
      const broadcastResponse = await broadcastTransaction(transaction, this.network);
      
      return broadcastResponse;
    } catch (error) {
      console.error('Error minting land:', error);
      throw error;
    }
  }

  async transferLand(tokenId: number, sender: string, recipient: string) {
    try {
      const [contractAddress, contractName] = CONTRACT_ADDRESSES.LAND_NFT.split('.');

      await openContractCall({
        contractAddress,
        contractName,
        functionName: 'transfer',
        functionArgs: [
          uintCV(tokenId),
          standardPrincipalCV(sender),
          standardPrincipalCV(recipient)
        ],
        network: this.network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data) => {
          console.log('Transfer completed:', data);
        },
        onCancel: () => {
          console.log('Transfer cancelled');
        }
      });
    } catch (error) {
      console.error('Error transferring land:', error);
      throw error;
    }
  }

  async listNFTForSale(
    nftContract: string,
    tokenId: number,
    price: number,
    currency: string,
    duration?: number
  ) {
    try {
      const [contractAddress, contractName] = CONTRACT_ADDRESSES.MARKETPLACE.split('.');

      await openContractCall({
        contractAddress,
        contractName,
        functionName: 'list-nft',
        functionArgs: [
          standardPrincipalCV(nftContract),
          uintCV(tokenId),
          uintCV(price),
          stringAsciiCV(currency),
          duration ? someCV(uintCV(duration)) : noneCV()
        ],
        network: this.network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data) => {
          console.log('NFT listed for sale:', data);
        },
        onCancel: () => {
          console.log('Listing cancelled');
        }
      });
    } catch (error) {
      console.error('Error listing NFT for sale:', error);
      throw error;
    }
  }

  async buyNFT(listingId: number) {
    try {
      const [contractAddress, contractName] = CONTRACT_ADDRESSES.MARKETPLACE.split('.');

      await openContractCall({
        contractAddress,
        contractName,
        functionName: 'buy-nft',
        functionArgs: [uintCV(listingId)],
        network: this.network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data) => {
          console.log('NFT purchased:', data);
        },
        onCancel: () => {
          console.log('Purchase cancelled');
        }
      });
    } catch (error) {
      console.error('Error buying NFT:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const contractService = new ContractService();
