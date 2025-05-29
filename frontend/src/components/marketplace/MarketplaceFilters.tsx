'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

interface MarketplaceFiltersProps {
  activeTab: 'land' | 'blueprints' | 'all';
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedRarity: string;
  setSelectedRarity: (rarity: string) => void;
  selectedTerrain: string;
  setSelectedTerrain: (terrain: string) => void;
}

export function MarketplaceFilters({
  activeTab,
  priceRange,
  setPriceRange,
  selectedRarity,
  setSelectedRarity,
  selectedTerrain,
  setSelectedTerrain,
}: MarketplaceFiltersProps) {
  const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
  const terrains = ['plains', 'forest', 'mountain', 'desert', 'coastal', 'volcanic'];
  const buildingTypes = ['residential', 'commercial', 'industrial', 'decorative'];

  const handleReset = () => {
    setPriceRange([0, 1000]);
    setSelectedRarity('');
    setSelectedTerrain('');
  };

  return (
    <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range (STX)
          </label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Rarity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rarity
          </label>
          <select
            value={selectedRarity}
            onChange={(e) => setSelectedRarity(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Rarities</option>
            {rarities.map((rarity) => (
              <option key={rarity} value={rarity}>
                {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Terrain (for land) or Building Type (for blueprints) */}
        {(activeTab === 'land' || activeTab === 'all') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Terrain Type
            </label>
            <select
              value={selectedTerrain}
              onChange={(e) => setSelectedTerrain(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Terrains</option>
              {terrains.map((terrain) => (
                <option key={terrain} value={terrain}>
                  {terrain.charAt(0).toUpperCase() + terrain.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}

        {activeTab === 'blueprints' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Building Type
            </label>
            <select
              value={selectedTerrain} // Reusing for building type
              onChange={(e) => setSelectedTerrain(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Types</option>
              {buildingTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Additional Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">New listings only</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Auction only</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Buy now available</span>
            </label>
          </div>
        </div>
      </div>

      {/* Filter Actions */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Showing results for: 
          {selectedRarity && <span className="ml-1 font-medium">{selectedRarity}</span>}
          {selectedTerrain && <span className="ml-1 font-medium">{selectedTerrain}</span>}
          {priceRange[0] > 0 || priceRange[1] < 1000 ? (
            <span className="ml-1 font-medium">{priceRange[0]}-{priceRange[1]} STX</span>
          ) : null}
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            Reset Filters
          </Button>
          <Button variant="primary" size="sm">
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
