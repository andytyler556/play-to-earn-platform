'use client';

import React from 'react';
import { 
  MapPin, 
  Building, 
  TrendingUp, 
  Users, 
  Trophy, 
  Clock,
  Zap,
  Coins
} from 'lucide-react';
import { usePlayerAssets } from '@/components/providers/GameProvider';
import { useWalletBalance } from '@/components/providers/WalletProvider';

export function GameStats() {
  const { land: ownedLand, blueprints: ownedBlueprints } = usePlayerAssets();
  const { stx: stxBalance, token: tokenBalance } = useWalletBalance();

  // Calculate stats
  const totalLand = ownedLand.length;
  const totalBuildings = ownedLand.reduce((sum, land) => sum + (land.buildings?.length || 0), 0);
  const totalResourceGeneration = ownedLand.reduce((sum, land) => {
    const landGeneration = land.buildings?.reduce((buildingSum, building) => {
      if (building.isBuilt) {
        // This would come from blueprint data in a real implementation
        return buildingSum + 10; // Mock value
      }
      return buildingSum;
    }, 0) || 0;
    return sum + landGeneration;
  }, 0);

  const stats = [
    {
      label: 'Land Owned',
      value: totalLand.toString(),
      icon: MapPin,
      color: 'text-green-600 bg-green-100',
      change: totalLand > 0 ? '+1 this week' : 'Get your first plot!',
    },
    {
      label: 'Buildings',
      value: totalBuildings.toString(),
      icon: Building,
      color: 'text-blue-600 bg-blue-100',
      change: totalBuildings > 0 ? `${Math.round((totalBuildings / (totalLand * 10)) * 100)}% capacity` : 'Start building!',
    },
    {
      label: 'Resource/Hour',
      value: totalResourceGeneration.toString(),
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-100',
      change: totalResourceGeneration > 0 ? '+12% this week' : 'Build to generate!',
    },
    {
      label: 'STX Balance',
      value: stxBalance.toFixed(2),
      icon: Coins,
      color: 'text-orange-600 bg-orange-100',
      change: 'Available for trading',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
