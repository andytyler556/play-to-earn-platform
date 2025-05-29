'use client';

import React from 'react';
import { 
  MapPin, 
  Building, 
  TrendingUp, 
  DollarSign,
  Star,
  Zap
} from 'lucide-react';
import { usePlayerAssets } from '@/components/providers/GameProvider';
import { useWalletBalance } from '@/components/providers/WalletProvider';

export function InventoryStats() {
  const { land: ownedLand, blueprints: ownedBlueprints } = usePlayerAssets();
  const { stx: stxBalance, token: tokenBalance } = useWalletBalance();

  // Calculate portfolio value (mock calculation)
  const landValue = ownedLand.reduce((sum, land) => {
    const baseValue = land.size * 10; // Base value per size unit
    const rarityMultiplier = {
      common: 1,
      uncommon: 1.5,
      rare: 2.5,
      epic: 4,
      legendary: 8
    }[land.rarity as keyof typeof rarityMultiplier] || 1;
    
    return sum + (baseValue * rarityMultiplier);
  }, 0);

  const blueprintValue = ownedBlueprints.reduce((sum, blueprint) => {
    const baseValue = 50; // Base blueprint value
    const rarityMultiplier = {
      common: 1,
      uncommon: 1.5,
      rare: 2.5,
      epic: 4,
      legendary: 8
    }[blueprint.rarity as keyof typeof rarityMultiplier] || 1;
    
    return sum + (baseValue * rarityMultiplier);
  }, 0);

  const totalPortfolioValue = landValue + blueprintValue + (stxBalance * 100); // Mock STX price

  // Calculate resource generation
  const totalResourceGeneration = ownedLand.reduce((sum, land) => {
    const landGeneration = land.buildings?.reduce((buildingSum, building) => {
      if (building.isBuilt) {
        return buildingSum + 15; // Mock resource generation per building
      }
      return buildingSum;
    }, 0) || 0;
    return sum + landGeneration;
  }, 0);

  // Get rarity distribution
  const rarityDistribution = [...ownedLand, ...ownedBlueprints].reduce((acc, item) => {
    acc[item.rarity] = (acc[item.rarity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stats = [
    {
      label: 'Portfolio Value',
      value: `$${totalPortfolioValue.toLocaleString()}`,
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'text-green-600 bg-green-100',
    },
    {
      label: 'Total Assets',
      value: (ownedLand.length + ownedBlueprints.length).toString(),
      change: '+3 this week',
      changeType: 'positive' as const,
      icon: MapPin,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      label: 'Resource/Hour',
      value: totalResourceGeneration.toString(),
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      label: 'Avg. Rarity',
      value: calculateAverageRarity(rarityDistribution),
      change: 'Improving',
      changeType: 'neutral' as const,
      icon: Star,
      color: 'text-yellow-600 bg-yellow-100',
    },
  ];

  function calculateAverageRarity(distribution: Record<string, number>): string {
    const rarityValues = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
    const totalItems = Object.values(distribution).reduce((sum, count) => sum + count, 0);
    
    if (totalItems === 0) return 'N/A';
    
    const weightedSum = Object.entries(distribution).reduce((sum, [rarity, count]) => {
      return sum + (rarityValues[rarity as keyof typeof rarityValues] || 1) * count;
    }, 0);
    
    const average = weightedSum / totalItems;
    
    if (average >= 4.5) return 'Legendary';
    if (average >= 3.5) return 'Epic';
    if (average >= 2.5) return 'Rare';
    if (average >= 1.5) return 'Uncommon';
    return 'Common';
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' :
                    stat.changeType === 'negative' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center ml-4`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
