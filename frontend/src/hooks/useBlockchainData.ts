// React hook for managing blockchain data with caching and loading states
import { useState, useEffect, useCallback, useRef } from 'react';
import { blockchainDataService } from '@/lib/blockchain/data-service';
import { 
  LandPlot, 
  Blueprint, 
  MarketplaceListing, 
  PlayerProfile,
  MOCK_PLAYER_INVENTORY,
  MOCK_PLAYER_PROFILE,
  generateMockMarketplaceListings
} from '@/lib/game-data';
import { useWallet } from '@/components/providers/WalletProvider';

interface UseBlockchainDataOptions {
  enableCache?: boolean;
  cacheTimeout?: number; // in milliseconds
  fallbackToMock?: boolean;
}

interface DataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const DEFAULT_OPTIONS: UseBlockchainDataOptions = {
  enableCache: true,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
  fallbackToMock: true
};

// Cache storage
const dataCache = new Map<string, { data: any; timestamp: number }>();

export function useBlockchainData(options: UseBlockchainDataOptions = {}) {
  const { address, isConnected } = useWallet();
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // State for different data types
  const [landPlots, setLandPlots] = useState<DataState<LandPlot[]>>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null
  });

  const [blueprints, setBlueprints] = useState<DataState<Blueprint[]>>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null
  });

  const [marketplaceListings, setMarketplaceListings] = useState<DataState<MarketplaceListing[]>>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null
  });

  const [playerProfile, setPlayerProfile] = useState<DataState<PlayerProfile>>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null
  });

  // Refs to prevent multiple simultaneous requests
  const loadingRefs = useRef({
    landPlots: false,
    blueprints: false,
    marketplaceListings: false,
    playerProfile: false
  });

  // Cache utilities
  const getCachedData = useCallback((key: string) => {
    if (!opts.enableCache) return null;
    
    const cached = dataCache.get(key);
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > opts.cacheTimeout!;
    if (isExpired) {
      dataCache.delete(key);
      return null;
    }
    
    return cached.data;
  }, [opts.enableCache, opts.cacheTimeout]);

  const setCachedData = useCallback((key: string, data: any) => {
    if (!opts.enableCache) return;
    
    dataCache.set(key, {
      data,
      timestamp: Date.now()
    });
  }, [opts.enableCache]);

  // Generic data fetcher with error handling and caching
  const fetchData = useCallback(async <T>(
    key: string,
    fetcher: () => Promise<T>,
    setter: React.Dispatch<React.SetStateAction<DataState<T>>>,
    mockFallback?: T
  ) => {
    // Prevent multiple simultaneous requests
    if (loadingRefs.current[key as keyof typeof loadingRefs.current]) {
      return;
    }

    // Check cache first
    const cachedData = getCachedData(key);
    if (cachedData) {
      setter({
        data: cachedData,
        loading: false,
        error: null,
        lastUpdated: Date.now()
      });
      return;
    }

    loadingRefs.current[key as keyof typeof loadingRefs.current] = true;
    
    setter(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await fetcher();
      
      setCachedData(key, data);
      
      setter({
        data,
        loading: false,
        error: null,
        lastUpdated: Date.now()
      });
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Use mock data as fallback if enabled
      if (opts.fallbackToMock && mockFallback) {
        console.warn(`Using mock data for ${key} due to error:`, errorMessage);
        setter({
          data: mockFallback,
          loading: false,
          error: null, // Don't show error when using fallback
          lastUpdated: Date.now()
        });
      } else {
        setter({
          data: null,
          loading: false,
          error: errorMessage,
          lastUpdated: Date.now()
        });
      }
    } finally {
      loadingRefs.current[key as keyof typeof loadingRefs.current] = false;
    }
  }, [getCachedData, setCachedData, opts.fallbackToMock]);

  // Data fetching functions
  const fetchLandPlots = useCallback(async () => {
    if (!address) return;
    
    await fetchData(
      `landPlots-${address}`,
      () => blockchainDataService.fetchPlayerLandPlots(address),
      setLandPlots,
      MOCK_PLAYER_INVENTORY.landPlots
    );
  }, [address, fetchData]);

  const fetchBlueprints = useCallback(async () => {
    if (!address) return;
    
    await fetchData(
      `blueprints-${address}`,
      () => blockchainDataService.fetchPlayerBlueprints(address),
      setBlueprints,
      MOCK_PLAYER_INVENTORY.blueprints
    );
  }, [address, fetchData]);

  const fetchMarketplaceListings = useCallback(async () => {
    await fetchData(
      'marketplaceListings',
      () => blockchainDataService.fetchMarketplaceListings(),
      setMarketplaceListings,
      generateMockMarketplaceListings(15)
    );
  }, [fetchData]);

  const fetchPlayerProfile = useCallback(async () => {
    if (!address) return;
    
    await fetchData(
      `playerProfile-${address}`,
      () => blockchainDataService.fetchPlayerProfile(address),
      setPlayerProfile,
      MOCK_PLAYER_PROFILE
    );
  }, [address, fetchData]);

  // Auto-fetch data when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      fetchLandPlots();
      fetchBlueprints();
      fetchPlayerProfile();
    }
  }, [isConnected, address, fetchLandPlots, fetchBlueprints, fetchPlayerProfile]);

  // Auto-fetch marketplace data (doesn't require wallet)
  useEffect(() => {
    fetchMarketplaceListings();
  }, [fetchMarketplaceListings]);

  // Refresh functions
  const refreshLandPlots = useCallback(() => {
    if (address) {
      dataCache.delete(`landPlots-${address}`);
      fetchLandPlots();
    }
  }, [address, fetchLandPlots]);

  const refreshBlueprints = useCallback(() => {
    if (address) {
      dataCache.delete(`blueprints-${address}`);
      fetchBlueprints();
    }
  }, [address, fetchBlueprints]);

  const refreshMarketplaceListings = useCallback(() => {
    dataCache.delete('marketplaceListings');
    fetchMarketplaceListings();
  }, [fetchMarketplaceListings]);

  const refreshPlayerProfile = useCallback(() => {
    if (address) {
      dataCache.delete(`playerProfile-${address}`);
      fetchPlayerProfile();
    }
  }, [address, fetchPlayerProfile]);

  const refreshAll = useCallback(() => {
    refreshLandPlots();
    refreshBlueprints();
    refreshMarketplaceListings();
    refreshPlayerProfile();
  }, [refreshLandPlots, refreshBlueprints, refreshMarketplaceListings, refreshPlayerProfile]);

  // Clear cache function
  const clearCache = useCallback(() => {
    dataCache.clear();
  }, []);

  return {
    // Data states
    landPlots: landPlots.data || [],
    blueprints: blueprints.data || [],
    marketplaceListings: marketplaceListings.data || [],
    playerProfile: playerProfile.data,
    
    // Loading states
    loading: {
      landPlots: landPlots.loading,
      blueprints: blueprints.loading,
      marketplaceListings: marketplaceListings.loading,
      playerProfile: playerProfile.loading,
      any: landPlots.loading || blueprints.loading || marketplaceListings.loading || playerProfile.loading
    },
    
    // Error states
    errors: {
      landPlots: landPlots.error,
      blueprints: blueprints.error,
      marketplaceListings: marketplaceListings.error,
      playerProfile: playerProfile.error
    },
    
    // Last updated timestamps
    lastUpdated: {
      landPlots: landPlots.lastUpdated,
      blueprints: blueprints.lastUpdated,
      marketplaceListings: marketplaceListings.lastUpdated,
      playerProfile: playerProfile.lastUpdated
    },
    
    // Refresh functions
    refresh: {
      landPlots: refreshLandPlots,
      blueprints: refreshBlueprints,
      marketplaceListings: refreshMarketplaceListings,
      playerProfile: refreshPlayerProfile,
      all: refreshAll
    },
    
    // Utility functions
    clearCache,
    
    // Connection state
    isConnected,
    address
  };
}
