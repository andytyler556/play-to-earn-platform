'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Building, 
  TrendingUp, 
  MoreHorizontal,
  Eye,
  ShoppingBag,
  Edit,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LandPlot, useGameStore } from '@/components/providers/GameProvider';
import { usePlayerAssets } from '@/components/providers/GameProvider';

interface LandInventoryProps {
  viewMode: 'grid' | 'list';
  sortBy: 'newest' | 'oldest' | 'rarity' | 'value';
  searchQuery: string;
}

const TERRAIN_EMOJIS = {
  plains: '🌾',
  forest: '🌲',
  mountain: '⛰️',
  desert: '🏜️',
  coastal: '🏖️',
  volcanic: '🌋',
};

const RARITY_COLORS = {
  common: 'border-gray-300 bg-gray-50',
  uncommon: 'border-green-300 bg-green-50',
  rare: 'border-blue-300 bg-blue-50',
  epic: 'border-purple-300 bg-purple-50',
  legendary: 'border-yellow-300 bg-yellow-50',
};

export function LandInventory({ viewMode, sortBy, searchQuery }: LandInventoryProps) {
  const { land: ownedLand } = usePlayerAssets();
  const setSelectedLand = useGameStore(state => state.setSelectedLand);
  const [selectedLandId, setSelectedLandId] = useState<number | null>(null);

  // Filter and sort land
  const filteredLand = ownedLand
    .filter(land => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        land.terrain.toLowerCase().includes(query) ||
        land.rarity.toLowerCase().includes(query) ||
        `${land.x},${land.y}`.includes(query)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.id - a.id;
        case 'oldest':
          return a.id - b.id;
        case 'rarity':
          const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
          return rarityOrder[b.rarity as keyof typeof rarityOrder] - rarityOrder[a.rarity as keyof typeof rarityOrder];
        case 'value':
          return (b.size * b.resourceMultiplier) - (a.size * a.resourceMultiplier);
        default:
          return 0;
      }
    });

  const handleLandAction = (land: LandPlot, action: 'view' | 'list' | 'manage') => {
    setSelectedLand(land);
    
    switch (action) {
      case 'view':
        // Navigate to world view with this land selected
        break;
      case 'list':
        // Open marketplace listing modal
        break;
      case 'manage':
        // Open land management modal
        break;
    }
  };

  if (ownedLand.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Land Owned</h3>
        <p className="text-gray-600 mb-6">
          Start building your empire by purchasing your first land plot
        </p>
        <Button variant="primary">
          <ShoppingBag className="w-4 h-4 mr-2" />
          Browse Marketplace
        </Button>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredLand.map((land) => {
          const buildingCount = land.buildings?.length || 0;
          const terrainEmoji = TERRAIN_EMOJIS[land.terrain as keyof typeof TERRAIN_EMOJIS];
          
          return (
            <div
              key={land.id}
              className={`border-2 rounded-lg p-4 transition-all hover:shadow-md cursor-pointer ${
                RARITY_COLORS[land.rarity as keyof typeof RARITY_COLORS]
              }`}
              onClick={() => setSelectedLandId(selectedLandId === land.id ? null : land.id)}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{terrainEmoji}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      ({land.x}, {land.y})
                    </h3>
                    <p className="text-sm text-gray-600 capitalize">{land.terrain}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  land.rarity === 'common' ? 'bg-gray-100 text-gray-800' :
                  land.rarity === 'uncommon' ? 'bg-green-100 text-green-800' :
                  land.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                  land.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {land.rarity}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{land.size}</div>
                  <div className="text-xs text-gray-600">Size</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{buildingCount}</div>
                  <div className="text-xs text-gray-600">Buildings</div>
                </div>
              </div>

              {/* Resource Generation */}
              <div className="bg-white/50 rounded-lg p-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Resources/hour</span>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.round(100 * (land.resourceMultiplier / 100))}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {selectedLandId === land.id && (
                <div className="space-y-2">
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLandAction(land, 'view');
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View in World
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLandAction(land, 'manage');
                      }}
                    >
                      <Building className="w-4 h-4 mr-1" />
                      Manage
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLandAction(land, 'list');
                      }}
                    >
                      <ShoppingBag className="w-4 h-4 mr-1" />
                      List
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-4">
      {filteredLand.map((land) => {
        const buildingCount = land.buildings?.length || 0;
        const terrainEmoji = TERRAIN_EMOJIS[land.terrain as keyof typeof TERRAIN_EMOJIS];
        
        return (
          <div
            key={land.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{terrainEmoji}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Land Plot ({land.x}, {land.y})
                    </h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {land.terrain} • {land.rarity} • Size {land.size}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">{buildingCount}</div>
                  <div className="text-xs text-gray-600">Buildings</div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">
                    {Math.round(100 * (land.resourceMultiplier / 100))}
                  </div>
                  <div className="text-xs text-gray-600">Resources/hr</div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLandAction(land, 'view')}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLandAction(land, 'manage')}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLandAction(land, 'list')}
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
