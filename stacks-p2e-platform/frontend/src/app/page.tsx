'use client';

import React from 'react';
import { useWallet } from '@/components/providers/WalletProvider';
import { WelcomeSection } from '@/components/game/WelcomeSection';
import { GameWorld } from '@/components/game/GameWorld';
import { QuickActions } from '@/components/game/QuickActions';
import { GameStats } from '@/components/game/GameStats';

export default function HomePage() {
  const { isConnected } = useWallet();

  if (!isConnected) {
    return <WelcomeSection />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Game Stats Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <GameStats />
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Game World - Main Area */}
          <div className="lg:col-span-3">
            <GameWorld />
          </div>

          {/* Quick Actions Sidebar */}
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
}
