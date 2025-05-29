'use client';

import React, { createContext, useContext } from 'react';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Game types
export interface LandPlot {
  id: number;
  x: number;
  y: number;
  terrain: string;
  size: number;
  rarity: string;
  resourceMultiplier: number;
  owner: string;
  buildings: Building[];
}

export interface Building {
  id: number;
  blueprintId: number;
  type: string;
  rarity: string;
  position: { x: number; y: number };
  isBuilt: boolean;
  buildProgress: number;
}

export interface Blueprint {
  id: number;
  buildingType: string;
  rarity: string;
  resourceConsumption: {
    wood: number;
    stone: number;
    metal: number;
    energy: number;
  };
  output: {
    populationCapacity: number;
    resourceGeneration: number;
    defenseBonus: number;
    happinessBonus: number;
  };
  buildTime: number;
  maintenanceCost: number;
  owner: string;
}

export interface Competition {
  id: number;
  name: string;
  description: string;
  type: string;
  startBlock: number;
  endBlock: number;
  maxParticipants: number;
  entryFee: number;
  prizePool: number;
  isActive: boolean;
  participants: number;
}

export interface MarketplaceListing {
  id: number;
  seller: string;
  nftContract: string;
  tokenId: number;
  price: number;
  currency: string;
  isActive: boolean;
  createdAt: number;
  expiresAt?: number;
}

// Game store interface
interface GameState {
  // Player data
  ownedLand: LandPlot[];
  ownedBlueprints: Blueprint[];
  
  // Game world
  visibleLand: LandPlot[];
  activeCompetitions: Competition[];
  marketplaceListings: MarketplaceListing[];
  
  // UI state
  selectedLand: LandPlot | null;
  selectedBlueprint: Blueprint | null;
  gameView: 'world' | 'inventory' | 'marketplace' | 'competitions';
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setSelectedLand: (land: LandPlot | null) => void;
  setSelectedBlueprint: (blueprint: Blueprint | null) => void;
  setGameView: (view: 'world' | 'inventory' | 'marketplace' | 'competitions') => void;
  addOwnedLand: (land: LandPlot) => void;
  addOwnedBlueprint: (blueprint: Blueprint) => void;
  updateLand: (landId: number, updates: Partial<LandPlot>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refreshGameData: () => Promise<void>;
}

// Create Zustand store
export const useGameStore = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    ownedLand: [],
    ownedBlueprints: [],
    visibleLand: [],
    activeCompetitions: [],
    marketplaceListings: [],
    selectedLand: null,
    selectedBlueprint: null,
    gameView: 'world',
    isLoading: false,
    error: null,

    // Actions
    setSelectedLand: (land) => set({ selectedLand: land }),
    setSelectedBlueprint: (blueprint) => set({ selectedBlueprint: blueprint }),
    setGameView: (view) => set({ gameView: view }),
    
    addOwnedLand: (land) => set((state) => ({
      ownedLand: [...state.ownedLand, land]
    })),
    
    addOwnedBlueprint: (blueprint) => set((state) => ({
      ownedBlueprints: [...state.ownedBlueprints, blueprint]
    })),
    
    updateLand: (landId, updates) => set((state) => ({
      ownedLand: state.ownedLand.map(land => 
        land.id === landId ? { ...land, ...updates } : land
      ),
      visibleLand: state.visibleLand.map(land => 
        land.id === landId ? { ...land, ...updates } : land
      )
    })),
    
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    
    refreshGameData: async () => {
      set({ isLoading: true, error: null });
      
      try {
        // This would fetch data from contracts and backend
        // For now, we'll use mock data
        
        // Mock competitions
        const mockCompetitions: Competition[] = [
          {
            id: 1,
            name: "Summer Building Contest",
            description: "Build the most creative residential complex",
            type: "building",
            startBlock: 100000,
            endBlock: 101000,
            maxParticipants: 50,
            entryFee: 10,
            prizePool: 500,
            isActive: true,
            participants: 23
          },
          {
            id: 2,
            name: "Resource Master Challenge",
            description: "Generate the most resources in 24 hours",
            type: "resource",
            startBlock: 100500,
            endBlock: 100644,
            maxParticipants: 100,
            entryFee: 5,
            prizePool: 250,
            isActive: true,
            participants: 67
          }
        ];
        
        set({ 
          activeCompetitions: mockCompetitions,
          isLoading: false 
        });
        
      } catch (error) {
        console.error('Error refreshing game data:', error);
        set({ 
          error: 'Failed to refresh game data',
          isLoading: false 
        });
      }
    },
  }))
);

// Game context
const GameContext = createContext<GameState | null>(null);

interface GameProviderProps {
  children: React.ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const gameState = useGameStore();

  React.useEffect(() => {
    // Initialize game data on mount
    gameState.refreshGameData();
  }, []);

  return (
    <GameContext.Provider value={gameState}>
      {children}
    </GameContext.Provider>
  );
}

// Custom hooks
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export function useGameView() {
  return useGameStore((state) => ({
    currentView: state.gameView,
    setView: state.setGameView,
  }));
}

export function usePlayerAssets() {
  return useGameStore((state) => ({
    land: state.ownedLand,
    blueprints: state.ownedBlueprints,
    selectedLand: state.selectedLand,
    selectedBlueprint: state.selectedBlueprint,
  }));
}

export function useCompetitions() {
  return useGameStore((state) => ({
    competitions: state.activeCompetitions,
    isLoading: state.isLoading,
    refresh: state.refreshGameData,
  }));
}

export function useMarketplace() {
  return useGameStore((state) => ({
    listings: state.marketplaceListings,
    isLoading: state.isLoading,
  }));
}
