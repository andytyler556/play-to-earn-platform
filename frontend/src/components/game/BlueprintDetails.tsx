'use client';

import React from 'react';
import { 
  X, 
  Package, 
  Building, 
  Clock, 
  Star,
  Zap,
  Hammer,
  ShoppingBag,
  TrendingUp,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useBlockchainData } from '@/hooks/useBlockchainData';
import { BUILDING_CONFIG, RESOURCE_CONFIG } from '@/lib/game-data';

interface BlueprintDetailsProps {
  blueprintId: string;
  onClose: () => void;
}

export function BlueprintDetails({ blueprintId, onClose }: BlueprintDetailsProps) {
  const { blueprints } = useBlockchainData();
  const blueprint = blueprints.find(bp => bp.id === blueprintId);

  if (!blueprint) {
    return (
      <div className="bg-white rounded-lg shadow-game border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Blueprint Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-600">Blueprint not found.</p>
      </div>
    );
  }

  const config = BUILDING_CONFIG[blueprint.buildingType as keyof typeof BUILDING_CONFIG];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'epic': return 'text-purple-600 bg-purple-100 border-purple-300';
      case 'rare': return 'text-blue-600 bg-blue-100 border-blue-300';
      case 'uncommon': return 'text-green-600 bg-green-100 border-green-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getBuildingIcon = (buildingType: string) => {
    return config?.icon || '🏗️';
  };

  const formatConstructionTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours} hours`;
  };

  const totalResourceCost = blueprint.resourceConsumption.reduce((sum, resource) => sum + resource.amount, 0);
  const totalOutput = blueprint.output.reduce((sum, output) => sum + output.amount, 0);

  return (
    <div className="bg-white rounded-lg shadow-game border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Package className="w-5 h-5 mr-2 text-blue-500" />
          Blueprint Details
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Blueprint Preview */}
      <div className="bg-blue-50 h-24 flex items-center justify-center text-3xl relative">
        {getBuildingIcon(blueprint.buildingType)}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium border ${getRarityColor(blueprint.rarity)}`}>
          {blueprint.rarity}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Basic Info */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Building Type:</span>
              <span className="font-medium capitalize">{blueprint.buildingType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Token ID:</span>
              <span className="font-medium">#{blueprint.tokenId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rarity:</span>
              <span className={`font-medium capitalize ${getRarityColor(blueprint.rarity).split(' ')[0]}`}>
                {blueprint.rarity}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Max Level:</span>
              <span className="font-medium">{blueprint.maxLevel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Construction Time:</span>
              <span className="font-medium">{formatConstructionTime(blueprint.constructionTime)}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Description</h4>
          <p className="text-sm text-gray-600">
            {config?.description || blueprint.description}
          </p>
        </div>

        {/* Performance Metrics */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
            Performance
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <Package className="w-5 h-5 mx-auto mb-1 text-red-600" />
              <div className="text-lg font-bold text-red-900">{totalResourceCost}</div>
              <div className="text-xs text-red-700">Total Cost</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Zap className="w-5 h-5 mx-auto mb-1 text-green-600" />
              <div className="text-lg font-bold text-green-900">{totalOutput}</div>
              <div className="text-xs text-green-700">Total Output</div>
            </div>
          </div>
        </div>

        {/* Resource Requirements */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
            <Package className="w-4 h-4 mr-2 text-red-500" />
            Resource Requirements
          </h4>
          {blueprint.resourceConsumption.length > 0 ? (
            <div className="space-y-2">
              {blueprint.resourceConsumption.map((resource, index) => {
                const config = RESOURCE_CONFIG[resource.type];
                
                return (
                  <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{config?.icon || '📦'}</span>
                      <span className="font-medium capitalize">{resource.type}</span>
                    </div>
                    <span className="font-bold text-red-900">{resource.amount}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No resource requirements</p>
          )}
        </div>

        {/* Output */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
            <Zap className="w-4 h-4 mr-2 text-green-500" />
            Production Output
          </h4>
          {blueprint.output.length > 0 ? (
            <div className="space-y-2">
              {blueprint.output.map((output, index) => {
                const config = RESOURCE_CONFIG[output.type];
                
                return (
                  <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{config?.icon || '📦'}</span>
                      <span className="font-medium capitalize">{output.type}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-900">{output.amount}</div>
                      <div className="text-xs text-green-700">per {output.interval}m</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No production output</p>
          )}
        </div>

        {/* Building Levels */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
            <Building className="w-4 h-4 mr-2 text-blue-500" />
            Upgrade Levels
          </h4>
          <div className="space-y-2">
            {Array.from({ length: blueprint.maxLevel }, (_, i) => i + 1).map((level) => (
              <div key={level} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Level {level}</span>
                </div>
                <div className="text-sm text-blue-700">
                  +{level * 10}% efficiency
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Construction Time */}
        <div className="bg-yellow-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-yellow-600" />
            <span className="font-medium text-yellow-900">Construction Time</span>
          </div>
          <div className="text-sm text-yellow-800">
            <div className="flex justify-between">
              <span>Base construction:</span>
              <span className="font-medium">{formatConstructionTime(blueprint.constructionTime)}</span>
            </div>
            <div className="flex justify-between">
              <span>With premium boost:</span>
              <span className="font-medium">{formatConstructionTime(Math.floor(blueprint.constructionTime * 0.8))}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-gray-200 space-y-2">
          <Button fullWidth leftIcon={<Hammer />} className="bg-blue-500 hover:bg-blue-600">
            Build Now
          </Button>
          <Button variant="outline" fullWidth leftIcon={<ShoppingBag />}>
            List for Sale
          </Button>
          <Button variant="outline" fullWidth leftIcon={<Settings />}>
            Manage Blueprint
          </Button>
        </div>

        {/* Rarity Benefits */}
        {blueprint.rarity !== 'common' && (
          <div className={`rounded-lg p-3 ${getRarityColor(blueprint.rarity).replace('text-', 'bg-').replace('bg-', 'bg-').replace('-600', '-50')}`}>
            <h5 className={`font-medium mb-2 ${getRarityColor(blueprint.rarity).split(' ')[0].replace('-600', '-900')}`}>
              {blueprint.rarity.charAt(0).toUpperCase() + blueprint.rarity.slice(1)} Benefits
            </h5>
            <div className="space-y-1 text-sm">
              {blueprint.rarity === 'uncommon' && (
                <div>• +10% construction speed</div>
              )}
              {blueprint.rarity === 'rare' && (
                <>
                  <div>• +20% construction speed</div>
                  <div>• +15% resource efficiency</div>
                </>
              )}
              {blueprint.rarity === 'epic' && (
                <>
                  <div>• +30% construction speed</div>
                  <div>• +25% resource efficiency</div>
                  <div>• Unique visual effects</div>
                </>
              )}
              {blueprint.rarity === 'legendary' && (
                <>
                  <div>• +50% construction speed</div>
                  <div>• +40% resource efficiency</div>
                  <div>• Exclusive visual effects</div>
                  <div>• Special abilities</div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
