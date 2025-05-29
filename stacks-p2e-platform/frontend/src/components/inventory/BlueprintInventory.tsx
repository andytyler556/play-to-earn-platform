'use client';

import React, { useState } from 'react';
import { 
  Building, 
  Home, 
  Store, 
  Factory, 
  Palette,
  Clock,
  Zap,
  Users,
  Heart,
  ShoppingBag,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Blueprint } from '@/components/providers/GameProvider';
import { usePlayerAssets } from '@/components/providers/GameProvider';

interface BlueprintInventoryProps {
  viewMode: 'grid' | 'list';
  sortBy: 'newest' | 'oldest' | 'rarity' | 'value';
  searchQuery: string;
}

const BUILDING_ICONS = {
  residential: Home,
  commercial: Store,
  industrial: Factory,
  decorative: Palette,
};

const RARITY_COLORS = {
  common: 'border-gray-300 bg-gray-50',
  uncommon: 'border-green-300 bg-green-50',
  rare: 'border-blue-300 bg-blue-50',
  epic: 'border-purple-300 bg-purple-50',
  legendary: 'border-yellow-300 bg-yellow-50',
};

export function BlueprintInventory({ viewMode, sortBy, searchQuery }: BlueprintInventoryProps) {
  const { blueprints: ownedBlueprints } = usePlayerAssets();
  const [selectedBlueprintId, setSelectedBlueprintId] = useState<number | null>(null);

  // Filter and sort blueprints
  const filteredBlueprints = ownedBlueprints
    .filter(blueprint => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        blueprint.buildingType.toLowerCase().includes(query) ||
        blueprint.rarity.toLowerCase().includes(query)
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
          return b.output.resourceGeneration - a.output.resourceGeneration;
        default:
          return 0;
      }
    });

  const handleBlueprintAction = (blueprint: Blueprint, action: 'use' | 'list' | 'details') => {
    switch (action) {
      case 'use':
        // Navigate to world view to place building
        break;
      case 'list':
        // Open marketplace listing modal
        break;
      case 'details':
        // Open blueprint details modal
        break;
    }
  };

  if (ownedBlueprints.length === 0) {
    return (
      <div className="text-center py-12">
        <Building className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Blueprints Owned</h3>
        <p className="text-gray-600 mb-6">
          Acquire building blueprints to start constructing on your land
        </p>
        <Button variant="primary">
          <ShoppingBag className="w-4 h-4 mr-2" />
          Browse Blueprints
        </Button>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBlueprints.map((blueprint) => {
          const Icon = BUILDING_ICONS[blueprint.buildingType as keyof typeof BUILDING_ICONS];
          
          return (
            <div
              key={blueprint.id}
              className={`border-2 rounded-lg p-4 transition-all hover:shadow-md cursor-pointer ${
                RARITY_COLORS[blueprint.rarity as keyof typeof RARITY_COLORS]
              }`}
              onClick={() => setSelectedBlueprintId(selectedBlueprintId === blueprint.id ? null : blueprint.id)}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/50 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 capitalize">
                      {blueprint.buildingType}
                    </h3>
                    <p className="text-sm text-gray-600">Blueprint</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  blueprint.rarity === 'common' ? 'bg-gray-100 text-gray-800' :
                  blueprint.rarity === 'uncommon' ? 'bg-green-100 text-green-800' :
                  blueprint.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                  blueprint.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {blueprint.rarity}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{blueprint.buildTime}h</div>
                  <div className="text-xs text-gray-600">Build Time</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{blueprint.output.resourceGeneration}</div>
                  <div className="text-xs text-gray-600">Resources/hr</div>
                </div>
              </div>

              {/* Output Benefits */}
              <div className="bg-white/50 rounded-lg p-2 mb-4">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {blueprint.output.populationCapacity > 0 && (
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3 text-gray-500" />
                      <span>{blueprint.output.populationCapacity}</span>
                    </div>
                  )}
                  {blueprint.output.happinessBonus > 0 && (
                    <div className="flex items-center space-x-1">
                      <Heart className="w-3 h-3 text-gray-500" />
                      <span>+{blueprint.output.happinessBonus}</span>
                    </div>
                  )}
                  {blueprint.output.defenseBonus > 0 && (
                    <div className="flex items-center space-x-1">
                      <span className="w-3 h-3 text-gray-500">🛡️</span>
                      <span>+{blueprint.output.defenseBonus}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              {selectedBlueprintId === blueprint.id && (
                <div className="space-y-2">
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBlueprintAction(blueprint, 'use');
                    }}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Use Blueprint
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBlueprintAction(blueprint, 'details');
                      }}
                    >
                      Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBlueprintAction(blueprint, 'list');
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
      {filteredBlueprints.map((blueprint) => {
        const Icon = BUILDING_ICONS[blueprint.buildingType as keyof typeof BUILDING_ICONS];
        
        return (
          <div
            key={blueprint.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 capitalize">
                    {blueprint.buildingType} Blueprint
                  </h3>
                  <p className="text-sm text-gray-600">
                    {blueprint.rarity} • {blueprint.buildTime}h build time
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">{blueprint.output.resourceGeneration}</div>
                  <div className="text-xs text-gray-600">Resources/hr</div>
                </div>
                
                {blueprint.output.populationCapacity > 0 && (
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">{blueprint.output.populationCapacity}</div>
                    <div className="text-xs text-gray-600">Population</div>
                  </div>
                )}

                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">{blueprint.maintenanceCost}</div>
                  <div className="text-xs text-gray-600">Maintenance</div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleBlueprintAction(blueprint, 'use')}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Use
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBlueprintAction(blueprint, 'list')}
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
