'use client';

import React from 'react';
import { 
  MapPin, 
  Building, 
  TrendingUp, 
  Star,
  Clock,
  Zap,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LandPlot, TERRAIN_CONFIG, RESOURCE_CONFIG } from '@/lib/game-data';

interface LandPlotCardProps {
  land: LandPlot;
  viewMode: 'grid' | 'list';
  onSelect: () => void;
  isSelected: boolean;
}

export function LandPlotCard({ land, viewMode, onSelect, isSelected }: LandPlotCardProps) {
  const terrainConfig = TERRAIN_CONFIG[land.terrain];
  
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'uncommon': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProductivityColor = (productivity: number) => {
    if (productivity >= 80) return 'text-green-600';
    if (productivity >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (viewMode === 'list') {
    return (
      <div 
        className={`bg-white rounded-lg shadow-game border-2 transition-all cursor-pointer hover:shadow-lg ${
          isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={onSelect}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              {/* Terrain Icon */}
              <div 
                className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl"
                style={{ backgroundColor: terrainConfig?.color + '20' }}
              >
                {terrainConfig?.icon || '🏞️'}
              </div>

              {/* Land Info */}
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Plot ({land.x}, {land.y})
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(land.rarity)}`}>
                    {land.rarity}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {terrainConfig?.name || land.terrain} • {land.size} units
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Building className="w-4 h-4" />
                    <span>{land.buildings.length} buildings</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Zap className="w-4 h-4" />
                    <span>{land.resources.length} resources</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Harvested {formatTimeAgo(land.lastHarvested)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-6">
              {/* Productivity */}
              <div className="text-center">
                <div className={`text-2xl font-bold ${getProductivityColor(land.productivity)}`}>
                  {land.productivity}%
                </div>
                <div className="text-xs text-gray-500">Productivity</div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" leftIcon={<Eye />}>
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div 
      className={`bg-white rounded-lg shadow-game border-2 transition-all cursor-pointer hover:shadow-lg ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      {/* Header */}
      <div 
        className="h-32 rounded-t-lg flex items-center justify-center text-4xl relative"
        style={{ backgroundColor: terrainConfig?.color + '20' }}
      >
        {terrainConfig?.icon || '🏞️'}
        
        {/* Rarity Badge */}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(land.rarity)}`}>
          {land.rarity}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">
            Plot ({land.x}, {land.y})
          </h3>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">{land.productivity}%</span>
          </div>
        </div>

        {/* Terrain */}
        <p className="text-sm text-gray-600 mb-3">
          {terrainConfig?.name || land.terrain} • {land.size} units
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded">
            <Building className="w-4 h-4 mx-auto mb-1 text-blue-500" />
            <div className="text-sm font-medium">{land.buildings.length}</div>
            <div className="text-xs text-gray-500">Buildings</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <Zap className="w-4 h-4 mx-auto mb-1 text-green-500" />
            <div className="text-sm font-medium">{land.resources.length}</div>
            <div className="text-xs text-gray-500">Resources</div>
          </div>
        </div>

        {/* Resource Preview */}
        {land.resources.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-1">Resources:</div>
            <div className="flex flex-wrap gap-1">
              {land.resources.slice(0, 3).map((resource, index) => {
                const config = RESOURCE_CONFIG[resource.type];
                return (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs"
                  >
                    <span className="mr-1">{config?.icon || '📦'}</span>
                    {resource.currentAmount}
                  </span>
                );
              })}
              {land.resources.length > 3 && (
                <span className="text-xs text-gray-500">+{land.resources.length - 3} more</span>
              )}
            </div>
          </div>
        )}

        {/* Last Harvested */}
        <div className="text-xs text-gray-500 mb-3 flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          Harvested {formatTimeAgo(land.lastHarvested)}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" fullWidth leftIcon={<Eye />}>
            View
          </Button>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
