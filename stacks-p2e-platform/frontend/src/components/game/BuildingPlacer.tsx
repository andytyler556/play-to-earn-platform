'use client';

import React, { useState } from 'react';
import { 
  X, 
  Building, 
  Home, 
  Store, 
  Factory, 
  Palette,
  Star,
  Clock,
  Zap,
  Users,
  Shield,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LandPlot, Building as BuildingType, Blueprint } from '@/components/providers/GameProvider';
import { usePlayerAssets } from '@/components/providers/GameProvider';

interface BuildingPlacerProps {
  land: LandPlot;
  onClose: () => void;
  onPlaceBuilding: (building: BuildingType) => void;
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

export function BuildingPlacer({ land, onClose, onPlaceBuilding }: BuildingPlacerProps) {
  const { blueprints: ownedBlueprints } = usePlayerAssets();
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<{ x: number; y: number } | null>(null);

  // Filter blueprints that can be placed on this land
  const availableBlueprints = ownedBlueprints.filter(blueprint => {
    // Check if we have space for more buildings
    const currentBuildings = land.buildings?.length || 0;
    const maxBuildings = getMaxBuildings(land.terrain);
    return currentBuildings < maxBuildings;
  });

  // Get max buildings for terrain
  function getMaxBuildings(terrain: string): number {
    const terrainLimits: { [key: string]: number } = {
      plains: 10,
      forest: 8,
      mountain: 6,
      desert: 12,
      coastal: 9,
      volcanic: 4,
    };
    return terrainLimits[terrain] || 8;
  }

  // Generate building positions grid
  const generatePositions = () => {
    const positions = [];
    const gridSize = Math.ceil(Math.sqrt(getMaxBuildings(land.terrain)));
    
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const isOccupied = land.buildings?.some(
          building => building.position.x === x && building.position.y === y
        );
        
        if (!isOccupied && positions.length < getMaxBuildings(land.terrain)) {
          positions.push({ x, y });
        }
      }
    }
    
    return positions;
  };

  const availablePositions = generatePositions();

  const handlePlaceBuilding = () => {
    if (!selectedBlueprint || !selectedPosition) return;

    const newBuilding: BuildingType = {
      id: Date.now(), // Temporary ID
      blueprintId: selectedBlueprint.id,
      type: selectedBlueprint.buildingType,
      rarity: selectedBlueprint.rarity,
      position: selectedPosition,
      isBuilt: false,
      buildProgress: 0,
    };

    onPlaceBuilding(newBuilding);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Place Building</h2>
                <p className="text-primary-100">
                  Land ({land.x}, {land.y}) - {land.terrain}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Blueprint Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Select Blueprint ({availableBlueprints.length} available)
              </h3>
              
              {availableBlueprints.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {availableBlueprints.map((blueprint) => {
                    const Icon = BUILDING_ICONS[blueprint.buildingType as keyof typeof BUILDING_ICONS];
                    const isSelected = selectedBlueprint?.id === blueprint.id;
                    
                    return (
                      <div
                        key={blueprint.id}
                        onClick={() => setSelectedBlueprint(blueprint)}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-primary-500 bg-primary-50' 
                            : `${RARITY_COLORS[blueprint.rarity as keyof typeof RARITY_COLORS]} hover:border-gray-400`
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-gray-900">
                                {blueprint.buildingType.charAt(0).toUpperCase() + blueprint.buildingType.slice(1)}
                              </h4>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                blueprint.rarity === 'common' ? 'bg-gray-100 text-gray-800' :
                                blueprint.rarity === 'uncommon' ? 'bg-green-100 text-green-800' :
                                blueprint.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                                blueprint.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {blueprint.rarity}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{blueprint.buildTime}h</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Zap className="w-3 h-3" />
                                <span>{blueprint.output.resourceGeneration}/h</span>
                              </div>
                              {blueprint.output.populationCapacity > 0 && (
                                <div className="flex items-center space-x-1">
                                  <Users className="w-3 h-3" />
                                  <span>{blueprint.output.populationCapacity}</span>
                                </div>
                              )}
                              {blueprint.output.happinessBonus > 0 && (
                                <div className="flex items-center space-x-1">
                                  <Heart className="w-3 h-3" />
                                  <span>+{blueprint.output.happinessBonus}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Building className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No blueprints available</p>
                  <p className="text-sm">Visit the marketplace to acquire building blueprints</p>
                </div>
              )}
            </div>

            {/* Position Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Select Position
              </h3>
              
              {selectedBlueprint ? (
                <div>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="text-sm text-gray-600 mb-2">
                      Available positions: {availablePositions.length}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {availablePositions.map((position) => (
                        <button
                          key={`${position.x}-${position.y}`}
                          onClick={() => setSelectedPosition(position)}
                          className={`aspect-square border-2 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                            selectedPosition?.x === position.x && selectedPosition?.y === position.y
                              ? 'border-primary-500 bg-primary-100 text-primary-700'
                              : 'border-gray-300 bg-white hover:border-gray-400 text-gray-600'
                          }`}
                        >
                          {position.x},{position.y}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Building Preview */}
                  {selectedPosition && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Building Preview</h4>
                      <div className="text-sm text-blue-800">
                        <div>Type: {selectedBlueprint.buildingType}</div>
                        <div>Position: ({selectedPosition.x}, {selectedPosition.y})</div>
                        <div>Build Time: {selectedBlueprint.buildTime} hours</div>
                        <div>Resource Cost:</div>
                        <ul className="ml-4 mt-1">
                          <li>Wood: {selectedBlueprint.resourceConsumption.wood}</li>
                          <li>Stone: {selectedBlueprint.resourceConsumption.stone}</li>
                          <li>Metal: {selectedBlueprint.resourceConsumption.metal}</li>
                          <li>Energy: {selectedBlueprint.resourceConsumption.energy}</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <div className="w-12 h-12 mx-auto mb-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6" />
                  </div>
                  <p>Select a blueprint first</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {selectedBlueprint && selectedPosition ? (
                <span>Ready to place {selectedBlueprint.buildingType} at position ({selectedPosition.x}, {selectedPosition.y})</span>
              ) : (
                <span>Select a blueprint and position to continue</span>
              )}
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handlePlaceBuilding}
                disabled={!selectedBlueprint || !selectedPosition}
              >
                Place Building
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
