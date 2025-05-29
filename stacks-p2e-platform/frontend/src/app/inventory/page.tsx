'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Building, 
  Package, 
  Filter,
  Grid3X3,
  List,
  Search,
  SortAsc
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LandInventory } from '@/components/inventory/LandInventory';
import { BlueprintInventory } from '@/components/inventory/BlueprintInventory';
import { TokenInventory } from '@/components/inventory/TokenInventory';
import { InventoryStats } from '@/components/inventory/InventoryStats';
import { usePlayerAssets } from '@/components/providers/GameProvider';

type InventoryTab = 'land' | 'blueprints' | 'tokens';
type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'oldest' | 'rarity' | 'value';

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<InventoryTab>('land');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { land: ownedLand, blueprints: ownedBlueprints } = usePlayerAssets();

  const tabs = [
    { id: 'land' as const, label: 'Land', icon: MapPin, count: ownedLand.length },
    { id: 'blueprints' as const, label: 'Blueprints', icon: Building, count: ownedBlueprints.length },
    { id: 'tokens' as const, label: 'Tokens', icon: Package, count: 2 },
  ];

  const sortOptions = [
    { value: 'newest' as const, label: 'Newest First' },
    { value: 'oldest' as const, label: 'Oldest First' },
    { value: 'rarity' as const, label: 'Rarity' },
    { value: 'value' as const, label: 'Value' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory</h1>
          <p className="text-gray-600">Manage your land, blueprints, and digital assets</p>
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <InventoryStats />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      isActive
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isActive ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Controls */}
          <div className="bg-gray-50 border-b border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search assets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm"
                  />
                </div>

                {/* Filters */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className={showFilters ? 'bg-gray-100' : ''}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>

              <div className="flex items-center space-x-3">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* View Mode */}
                <div className="flex rounded-md shadow-sm">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 text-sm font-medium border ${
                      viewMode === 'grid'
                        ? 'bg-primary-50 border-primary-200 text-primary-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    } rounded-l-md`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 text-sm font-medium border border-l-0 ${
                      viewMode === 'list'
                        ? 'bg-primary-50 border-primary-200 text-primary-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    } rounded-r-md`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rarity
                    </label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                      <option value="">All Rarities</option>
                      <option value="common">Common</option>
                      <option value="uncommon">Uncommon</option>
                      <option value="rare">Rare</option>
                      <option value="epic">Epic</option>
                      <option value="legendary">Legendary</option>
                    </select>
                  </div>
                  
                  {activeTab === 'land' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Terrain
                      </label>
                      <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                        <option value="">All Terrains</option>
                        <option value="plains">Plains</option>
                        <option value="forest">Forest</option>
                        <option value="mountain">Mountain</option>
                        <option value="desert">Desert</option>
                        <option value="coastal">Coastal</option>
                        <option value="volcanic">Volcanic</option>
                      </select>
                    </div>
                  )}

                  {activeTab === 'blueprints' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Building Type
                      </label>
                      <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                        <option value="">All Types</option>
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="industrial">Industrial</option>
                        <option value="decorative">Decorative</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                      <option value="">All</option>
                      <option value="available">Available</option>
                      <option value="in-use">In Use</option>
                      <option value="listed">Listed for Sale</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'land' && (
              <LandInventory 
                viewMode={viewMode}
                sortBy={sortBy}
                searchQuery={searchQuery}
              />
            )}
            {activeTab === 'blueprints' && (
              <BlueprintInventory 
                viewMode={viewMode}
                sortBy={sortBy}
                searchQuery={searchQuery}
              />
            )}
            {activeTab === 'tokens' && (
              <TokenInventory 
                viewMode={viewMode}
                sortBy={sortBy}
                searchQuery={searchQuery}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
