'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { 
  userSession, 
  isWalletConnected, 
  getUserAddress,
  getTokenBalance,
} from '@/lib/stacks';
import toast from 'react-hot-toast';

// Wallet store interface
interface WalletState {
  isConnected: boolean;
  address: string | null;
  stxBalance: number;
  tokenBalance: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  connect: () => void;
  disconnect: () => void;
  refreshBalances: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Create Zustand store
export const useWalletStore = create<WalletState>()(
  subscribeWithSelector((set, get) => ({
    isConnected: false,
    address: null,
    stxBalance: 0,
    tokenBalance: 0,
    isLoading: false,
    error: null,

    connect: () => {
      try {
        const connected = isWalletConnected();
        const address = getUserAddress();
        
        set({ 
          isConnected: connected, 
          address,
          error: null 
        });

        if (connected && address) {
          get().refreshBalances();
          toast.success('Wallet connected successfully!');
        }
      } catch (error) {
        console.error('Error connecting wallet:', error);
        set({ error: 'Failed to connect wallet' });
        toast.error('Failed to connect wallet');
      }
    },

    disconnect: () => {
      try {
        userSession.signUserOut('/');
        set({ 
          isConnected: false, 
          address: null, 
          stxBalance: 0,
          tokenBalance: 0,
          error: null 
        });
        toast.success('Wallet disconnected');
      } catch (error) {
        console.error('Error disconnecting wallet:', error);
        toast.error('Failed to disconnect wallet');
      }
    },

    refreshBalances: async () => {
      const { address } = get();
      if (!address) return;

      set({ isLoading: true });
      
      try {
        // Get STX balance from API
        const response = await fetch(`${process.env.NEXT_PUBLIC_STACKS_API_URL}/v1/addresses/${address}`);
        const data = await response.json();
        const stxBalance = parseInt(data.balance) / 1000000; // Convert from microSTX

        // Get platform token balance
        const tokenBalanceResult = await getTokenBalance(address);
        const tokenBalance = tokenBalanceResult?.value || 0;

        set({ 
          stxBalance, 
          tokenBalance: tokenBalance / 1000000, // Assuming 6 decimals
          isLoading: false,
          error: null 
        });
      } catch (error) {
        console.error('Error fetching balances:', error);
        set({ 
          isLoading: false, 
          error: 'Failed to fetch balances' 
        });
      }
    },

    setLoading: (loading: boolean) => set({ isLoading: loading }),
    setError: (error: string | null) => set({ error }),
  }))
);

// Wallet context
const WalletContext = createContext<WalletState | null>(null);

interface WalletProviderProps {
  children: React.ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const walletState = useWalletStore();

  useEffect(() => {
    // Initialize wallet state on mount
    walletState.connect();

    // Set up periodic balance refresh
    const interval = setInterval(() => {
      if (walletState.isConnected) {
        walletState.refreshBalances();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Subscribe to wallet connection changes
  useEffect(() => {
    const unsubscribe = useWalletStore.subscribe(
      (state) => state.isConnected,
      (isConnected) => {
        if (isConnected) {
          walletState.refreshBalances();
        }
      }
    );

    return unsubscribe;
  }, []);

  return (
    <WalletContext.Provider value={walletState}>
      {children}
    </WalletContext.Provider>
  );
}

// Custom hook to use wallet context
export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

// Additional hooks for specific wallet data
export function useWalletAddress() {
  return useWalletStore((state) => state.address);
}

export function useWalletBalance() {
  return useWalletStore((state) => ({
    stx: state.stxBalance,
    token: state.tokenBalance,
    isLoading: state.isLoading,
  }));
}

export function useWalletConnection() {
  return useWalletStore((state) => ({
    isConnected: state.isConnected,
    connect: state.connect,
    disconnect: state.disconnect,
    isLoading: state.isLoading,
    error: state.error,
  }));
}
