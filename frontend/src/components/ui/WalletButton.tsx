'use client';

import React from 'react';
import { Wallet } from 'lucide-react';
import { Button } from './Button';
import { connectWallet } from '@/lib/stacks';
import { useWalletConnection } from '@/components/providers/WalletProvider';

export function WalletButton() {
  const { isConnected, isLoading } = useWalletConnection();

  const handleConnect = () => {
    connectWallet();
  };

  if (isConnected) {
    return null; // Don't show connect button if already connected
  }

  return (
    <Button
      onClick={handleConnect}
      loading={isLoading}
      leftIcon={<Wallet />}
      variant="primary"
      size="sm"
    >
      Connect Wallet
    </Button>
  );
}
