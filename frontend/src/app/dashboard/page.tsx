'use client';

import React from 'react';
import { 
  Home, 
  TrendingUp, 
  Users, 
  Bell,
  RefreshCw,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PlayerOverview } from '@/components/game/PlayerOverview';
import { ResourceInventory } from '@/components/game/ResourceInventory';
import { ActivityFeed } from '@/components/game/ActivityFeed';
import { QuickActions } from '@/components/game/QuickActions';
import { AnnouncementBanner } from '@/components/game/AnnouncementBanner';
import { useBlockchainData } from '@/hooks/useBlockchainData';
import { useWallet } from '@/components/providers/WalletProvider';

export default function DashboardPage() {
  const { isConnected, address } = useWallet();
  const {
    landPlots,
    blueprints,
    playerProfile,
    loading,
    errors,
    refresh
  } = useBlockchainData();

  // Redirect to home if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-digital-oasis flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallet Not Connected</h2>
          <p className="text-gray-600 mb-4">Please connect your wallet to access the dashboard.</p>
          <Button onClick={() => window.location.href = '/'}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-digital-oasis">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Home className="w-8 h-8 mr-3 text-blue-500" />
                Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Welcome back to your virtual empire</p>
            </div>
            <div className="flex items-center space-x-2">
              {loading.any && (
                <div className="flex items-center text-sm text-gray-600">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={refresh.all}
                leftIcon={<RefreshCw className={loading.any ? 'animate-spin' : ''} />}
                disabled={loading.any}
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Announcement Banner */}
        <div className="mb-6">
          <AnnouncementBanner />
        </div>

        {/* Error Display */}
        {(errors.landPlots || errors.blueprints || errors.playerProfile) && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Data Loading Issues</h3>
                <div className="text-sm text-red-700 mt-1">
                  {errors.landPlots && <div>• Land plots: {errors.landPlots}</div>}
                  {errors.blueprints && <div>• Blueprints: {errors.blueprints}</div>}
                  {errors.playerProfile && <div>• Player profile: {errors.playerProfile}</div>}
                </div>
                <p className="text-xs text-red-600 mt-2">
                  Using cached or mock data. Check your connection and try refreshing.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Player Overview and Resources */}
          <div className="lg:col-span-1 space-y-6">
            <PlayerOverview 
              profile={playerProfile}
              loading={loading.playerProfile}
              onRefresh={refresh.playerProfile}
            />
            <ResourceInventory 
              landPlots={landPlots}
              loading={loading.landPlots}
            />
          </div>

          {/* Middle Column - Activity Feed */}
          <div className="lg:col-span-2">
            <ActivityFeed 
              landPlots={landPlots}
              blueprints={blueprints}
              loading={loading.any}
            />
          </div>

          {/* Right Column - Quick Actions */}
          <div className="lg:col-span-1">
            <QuickActions 
              landPlots={landPlots}
              blueprints={blueprints}
              loading={loading.any}
            />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-game p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Land Plots Owned</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading.landPlots ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    landPlots.length
                  )}
                </p>
              </div>
              <Home className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-game p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Blueprints Owned</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading.blueprints ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    blueprints.length
                  )}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-game p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Buildings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {landPlots.reduce((sum, land) => sum + land.buildings.length, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-game p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Player Level</p>
                <p className="text-2xl font-bold text-gray-900">
                  {playerProfile?.level || 1}
                </p>
              </div>
              <Bell className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="mt-6 bg-white rounded-lg shadow-game border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Blockchain Connected</p>
                <p className="text-xs text-gray-600">
                  Address: {address?.slice(0, 8)}...{address?.slice(-6)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600">Network: Stacks Testnet</p>
              <p className="text-xs text-gray-600">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
