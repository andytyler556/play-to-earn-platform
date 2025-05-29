'use client';

import React from 'react';
import { 
  Package, 
  Star, 
  Clock,
  Zap,
  Building,
  Eye,
  MoreHorizontal,
  Hammer
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Blueprint, BUILDING_CONFIG, RESOURCE_CONFIG } from '@/lib/game-data';

interface BlueprintGalleryProps {
  blueprints: Blueprint[];
  viewMode: 'grid' | 'list';
  onSelectBlueprint: (blueprintId: string) => void;
  selectedBlueprintId: string | null;
}

export function BlueprintGallery({ 
  blueprints, 
  viewMode, 
  onSelectBlueprint, 
  selectedBlueprintId 
}: BlueprintGalleryProps) {
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
    const config = BUILDING_CONFIG[buildingType as keyof typeof BUILDING_CONFIG];
    return config?.icon || '🏗️';
  };

  const formatConstructionTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  if (blueprints.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Blueprints Found</h3>
        <p className="text-gray-600">Start collecting blueprints to build your empire!</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {blueprints.map((blueprint) => {
          const isSelected = selectedBlueprintId === blueprint.id;
          const config = BUILDING_CONFIG[blueprint.buildingType as keyof typeof BUILDING_CONFIG];
          
          return (
            <div
              key={blueprint.id}
              className={`bg-white rounded-lg shadow-game border-2 transition-all cursor-pointer hover:shadow-lg ${
                isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onSelectBlueprint(blueprint.id)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  {/* Left Section */}
                  <div className="flex items-center space-x-4">
                    {/* Blueprint Icon */}
                    <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center text-2xl">
                      {getBuildingIcon(blueprint.buildingType)}
                    </div>

                    {/* Blueprint Info */}
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 capitalize">
                          {blueprint.buildingType} Blueprint
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRarityColor(blueprint.rarity)}`}>
                          {blueprint.rarity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {config?.description || blueprint.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatConstructionTime(blueprint.constructionTime)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4" />
                          <span>Max Level {blueprint.maxLevel}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Package className="w-4 h-4" />
                          <span>#{blueprint.tokenId}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="flex items-center space-x-6">
                    {/* Resource Requirements */}
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900 mb-1">Requirements</div>
                      <div className="flex flex-wrap gap-1">
                        {blueprint.resourceConsumption.slice(0, 3).map((resource, index) => {
                          const config = RESOURCE_CONFIG[resource.type];
                          return (
                            <span 
                              key={index}
                              className="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs"
                            >
                              <span className="mr-1">{config?.icon || '📦'}</span>
                              {resource.amount}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" leftIcon={<Eye />}>
                        View
                      </Button>
                      <Button variant="primary" size="sm" leftIcon={<Hammer />}>
                        Build
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
        })}
      </div>
    );
  }

  // Grid view
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blueprints.map((blueprint) => {
        const isSelected = selectedBlueprintId === blueprint.id;
        const config = BUILDING_CONFIG[blueprint.buildingType as keyof typeof BUILDING_CONFIG];
        
        return (
          <div
            key={blueprint.id}
            className={`bg-white rounded-lg shadow-game border-2 transition-all cursor-pointer hover:shadow-lg ${
              isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSelectBlueprint(blueprint.id)}
          >
            {/* Header */}
            <div className="bg-blue-50 h-32 rounded-t-lg flex items-center justify-center text-4xl relative">
              {getBuildingIcon(blueprint.buildingType)}
              
              {/* Rarity Badge */}
              <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium border ${getRarityColor(blueprint.rarity)}`}>
                {blueprint.rarity}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Title */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 capitalize">
                  {blueprint.buildingType}
                </h3>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">#{blueprint.tokenId}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {config?.description || blueprint.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <Clock className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                  <div className="text-sm font-medium">{formatConstructionTime(blueprint.constructionTime)}</div>
                  <div className="text-xs text-gray-500">Build Time</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <Building className="w-4 h-4 mx-auto mb-1 text-purple-500" />
                  <div className="text-sm font-medium">Level {blueprint.maxLevel}</div>
                  <div className="text-xs text-gray-500">Max Level</div>
                </div>
              </div>

              {/* Resource Requirements */}
              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-1">Requirements:</div>
                <div className="flex flex-wrap gap-1">
                  {blueprint.resourceConsumption.map((resource, index) => {
                    const config = RESOURCE_CONFIG[resource.type];
                    return (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs"
                      >
                        <span className="mr-1">{config?.icon || '📦'}</span>
                        {resource.amount}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Output Preview */}
              {blueprint.output.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">Produces:</div>
                  <div className="flex flex-wrap gap-1">
                    {blueprint.output.slice(0, 2).map((output, index) => {
                      const config = RESOURCE_CONFIG[output.type];
                      return (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-1 bg-green-100 rounded text-xs"
                        >
                          <span className="mr-1">{config?.icon || '📦'}</span>
                          {output.amount}/{output.interval}m
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" fullWidth leftIcon={<Eye />}>
                  View
                </Button>
                <Button variant="primary" size="sm" fullWidth leftIcon={<Hammer />}>
                  Build
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
