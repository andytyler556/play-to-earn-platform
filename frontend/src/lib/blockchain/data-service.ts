// Data service layer for transforming blockchain data to frontend models
import { contractService } from './contracts';
import { cvToValue } from '@stacks/transactions';
import { 
  LandPlot, 
  Blueprint, 
  MarketplaceListing, 
  PlayerProfile,
  CommunityEvent,
  TERRAIN_CONFIG,
  BUILDING_CONFIG 
} from '../game-data';

export class BlockchainDataService {
  // Land-related data fetching
  async fetchPlayerLandPlots(playerAddress: string): Promise<LandPlot[]> {
    try {
      const lastTokenIdResult = await contractService.getLastLandTokenId();
      const lastTokenId = cvToValue(lastTokenIdResult);
      
      const landPlots: LandPlot[] = [];
      
      // Iterate through all tokens to find owned ones
      for (let tokenId = 1; tokenId <= lastTokenId.value; tokenId++) {
        try {
          const ownerResult = await contractService.getLandOwner(tokenId);
          const owner = cvToValue(ownerResult);
          
          if (owner.value && owner.value.value === playerAddress) {
            const landData = await this.fetchLandPlotData(tokenId);
            if (landData) {
              landPlots.push(landData);
            }
          }
        } catch (error) {
          console.warn(`Error fetching land ${tokenId}:`, error);
          continue;
        }
      }
      
      return landPlots;
    } catch (error) {
      console.error('Error fetching player land plots:', error);
      // Fallback to mock data in case of error
      return [];
    }
  }

  async fetchLandPlotData(tokenId: number): Promise<LandPlot | null> {
    try {
      const landDataResult = await contractService.getLandData(tokenId);
      const landData = cvToValue(landDataResult);
      
      if (!landData.value) {
        return null;
      }
      
      const data = landData.value;
      
      return {
        id: `land-${tokenId}`,
        tokenId,
        x: data.x.value,
        y: data.y.value,
        terrain: data.terrain.value as any,
        rarity: this.mapRarityFromContract(data.rarity?.value || 'common'),
        size: data.size.value,
        owner: data.owner.value,
        buildings: [], // TODO: Implement building data fetching
        resources: this.generateResourceNodes(data.terrain.value, data.size.value),
        lastHarvested: new Date(data['last-harvested']?.value * 1000 || Date.now()),
        productivity: this.calculateProductivity(data.terrain.value, data.size.value)
      };
    } catch (error) {
      console.error(`Error fetching land plot ${tokenId}:`, error);
      return null;
    }
  }

  // Blueprint-related data fetching
  async fetchPlayerBlueprints(playerAddress: string): Promise<Blueprint[]> {
    try {
      const lastTokenIdResult = await contractService.getLastBlueprintTokenId();
      const lastTokenId = cvToValue(lastTokenIdResult);
      
      const blueprints: Blueprint[] = [];
      
      // Iterate through all tokens to find owned ones
      for (let tokenId = 1; tokenId <= lastTokenId.value; tokenId++) {
        try {
          const ownerResult = await contractService.getBlueprintOwner(tokenId);
          const owner = cvToValue(ownerResult);
          
          if (owner.value && owner.value.value === playerAddress) {
            const blueprintData = await this.fetchBlueprintData(tokenId);
            if (blueprintData) {
              blueprints.push(blueprintData);
            }
          }
        } catch (error) {
          console.warn(`Error fetching blueprint ${tokenId}:`, error);
          continue;
        }
      }
      
      return blueprints;
    } catch (error) {
      console.error('Error fetching player blueprints:', error);
      return [];
    }
  }

  async fetchBlueprintData(tokenId: number): Promise<Blueprint | null> {
    try {
      const blueprintDataResult = await contractService.getBlueprintData(tokenId);
      const blueprintData = cvToValue(blueprintDataResult);
      
      if (!blueprintData.value) {
        return null;
      }
      
      const data = blueprintData.value;
      
      return {
        id: `blueprint-${tokenId}`,
        tokenId,
        buildingType: data['building-type'].value as any,
        rarity: data.rarity.value as any,
        resourceConsumption: this.transformResourceConsumption(data['resource-consumption']),
        output: this.transformResourceOutput(data.output),
        constructionTime: data['build-time'].value,
        maxLevel: 5, // Default max level
        description: BUILDING_CONFIG[data['building-type'].value as keyof typeof BUILDING_CONFIG]?.description || 'Custom building',
        owner: '' // Will be set by the calling function
      };
    } catch (error) {
      console.error(`Error fetching blueprint ${tokenId}:`, error);
      return null;
    }
  }

  // Marketplace data fetching
  async fetchMarketplaceListings(): Promise<MarketplaceListing[]> {
    try {
      const lastListingIdResult = await contractService.getLastListingId();
      const lastListingId = cvToValue(lastListingIdResult);
      
      const listings: MarketplaceListing[] = [];
      
      // Fetch recent listings (last 50)
      const startId = Math.max(1, lastListingId.value - 49);
      
      for (let listingId = startId; listingId <= lastListingId.value; listingId++) {
        try {
          const listingData = await this.fetchMarketplaceListing(listingId);
          if (listingData) {
            listings.push(listingData);
          }
        } catch (error) {
          console.warn(`Error fetching listing ${listingId}:`, error);
          continue;
        }
      }
      
      return listings.filter(listing => listing !== null);
    } catch (error) {
      console.error('Error fetching marketplace listings:', error);
      return [];
    }
  }

  async fetchMarketplaceListing(listingId: number): Promise<MarketplaceListing | null> {
    try {
      const listingResult = await contractService.getMarketplaceListing(listingId);
      const listing = cvToValue(listingResult);
      
      if (!listing.value || !listing.value['is-active'].value) {
        return null;
      }
      
      const data = listing.value;
      
      return {
        id: `listing-${listingId}`,
        type: this.determineNFTType(data['nft-contract'].value),
        tokenId: data['token-id'].value,
        seller: data.seller.value,
        price: data.price.value,
        currency: data.currency.value as any,
        listedAt: new Date(data['created-at'].value * 1000),
        expiresAt: data['expires-at']?.value ? new Date(data['expires-at'].value * 1000) : undefined,
        featured: Math.random() > 0.8 // Random featured status for now
      };
    } catch (error) {
      console.error(`Error fetching marketplace listing ${listingId}:`, error);
      return null;
    }
  }

  // Player profile data
  async fetchPlayerProfile(playerAddress: string): Promise<PlayerProfile> {
    try {
      // For now, we'll create a basic profile with blockchain data
      const landPlots = await this.fetchPlayerLandPlots(playerAddress);
      const blueprints = await this.fetchPlayerBlueprints(playerAddress);
      
      return {
        address: playerAddress,
        username: this.generateUsernameFromAddress(playerAddress),
        level: Math.max(1, Math.floor((landPlots.length + blueprints.length) / 2)),
        experience: (landPlots.length * 100) + (blueprints.length * 50),
        joinedAt: new Date('2024-01-01'), // Default join date
        achievements: [], // TODO: Implement achievement system
        stats: {
          landsOwned: landPlots.length,
          blueprintsOwned: blueprints.length,
          buildingsConstructed: landPlots.reduce((sum, land) => sum + land.buildings.length, 0),
          resourcesHarvested: 0, // TODO: Track from events
          tokensEarned: 0, // TODO: Track from events
          eventsParticipated: 0, // TODO: Track from events
          marketplaceSales: 0 // TODO: Track from marketplace events
        }
      };
    } catch (error) {
      console.error('Error fetching player profile:', error);
      // Return basic profile on error
      return {
        address: playerAddress,
        level: 1,
        experience: 0,
        joinedAt: new Date(),
        achievements: [],
        stats: {
          landsOwned: 0,
          blueprintsOwned: 0,
          buildingsConstructed: 0,
          resourcesHarvested: 0,
          tokensEarned: 0,
          eventsParticipated: 0,
          marketplaceSales: 0
        }
      };
    }
  }

  // Helper functions
  private mapRarityFromContract(contractRarity: string): 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' {
    const rarityMap: Record<string, any> = {
      'common': 'common',
      'uncommon': 'uncommon',
      'rare': 'rare',
      'epic': 'epic',
      'legendary': 'legendary'
    };
    return rarityMap[contractRarity] || 'common';
  }

  private transformResourceConsumption(consumption: any) {
    return [
      { type: 'wood' as const, amount: consumption.wood?.value || 0 },
      { type: 'stone' as const, amount: consumption.stone?.value || 0 },
      { type: 'metal' as const, amount: consumption.metal?.value || 0 },
      { type: 'energy' as const, amount: consumption.energy?.value || 0 }
    ].filter(item => item.amount > 0);
  }

  private transformResourceOutput(output: any) {
    const outputs = [];
    
    if (output['population-capacity']?.value > 0) {
      outputs.push({ type: 'tokens' as const, amount: output['population-capacity'].value, interval: 60 });
    }
    if (output['resource-generation']?.value > 0) {
      outputs.push({ type: 'energy' as const, amount: output['resource-generation'].value, interval: 60 });
    }
    
    return outputs;
  }

  private generateResourceNodes(terrain: string, size: number) {
    const terrainConfig = TERRAIN_CONFIG[terrain as keyof typeof TERRAIN_CONFIG];
    if (!terrainConfig) return [];
    
    const nodes = [];
    const nodeCount = Math.floor(size / 25); // One node per 25 size units
    
    for (let i = 0; i < nodeCount; i++) {
      const resourceTypes = Object.keys(terrainConfig.resourceBonus);
      const resourceType = resourceTypes[i % resourceTypes.length];
      
      nodes.push({
        id: `resource-${i}`,
        type: resourceType as any,
        x: Math.random() * 100,
        y: Math.random() * 100,
        capacity: 100,
        currentAmount: Math.floor(Math.random() * 100),
        regenerationRate: 5
      });
    }
    
    return nodes;
  }

  private calculateProductivity(terrain: string, size: number): number {
    const terrainConfig = TERRAIN_CONFIG[terrain as keyof typeof TERRAIN_CONFIG];
    const baseProductivity = terrainConfig?.baseProductivity || 70;
    const sizeBonus = Math.min(20, size / 5); // Up to 20% bonus for large plots
    
    return Math.min(100, baseProductivity + sizeBonus);
  }

  private determineNFTType(contractAddress: string): 'land' | 'blueprint' {
    // Simple heuristic based on contract name
    if (contractAddress.includes('land')) return 'land';
    if (contractAddress.includes('blueprint')) return 'blueprint';
    return 'land'; // Default
  }

  private generateUsernameFromAddress(address: string): string {
    const prefixes = ['Land', 'Build', 'Craft', 'Mine', 'Farm', 'Trade'];
    const suffixes = ['Master', 'Lord', 'King', 'Pro', 'Expert', 'Guru'];
    
    const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const prefix = prefixes[hash % prefixes.length];
    const suffix = suffixes[(hash * 7) % suffixes.length];
    
    return `${prefix}${suffix}`;
  }
}

// Export singleton instance
export const blockchainDataService = new BlockchainDataService();
