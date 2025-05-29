'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { WalletProvider } from './WalletProvider';
import { GameProvider } from './GameProvider';
import { SecurityProvider } from '../security/SecurityProvider';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SecurityProvider>
      <QueryClientProvider client={queryClient}>
        <WalletProvider>
          <GameProvider>
            {children}
          </GameProvider>
        </WalletProvider>
      </QueryClientProvider>
    </SecurityProvider>
  );
}
