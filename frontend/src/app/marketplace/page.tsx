'use client';

import React, { useState } from 'react';
import {
  ShoppingBag,
  MapPin,
  Building,
  Filter,
  Search,
  TrendingUp,
  Grid3X3,
  List,
  SortAsc
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MarketplaceStats } from '@/components/marketplace/MarketplaceStats';
import { LandListings } from '@/components/marketplace/LandListings';
import { BlueprintListings } from '@/components/marketplace/BlueprintListings';
import { MarketplaceFilters } from '@/components/marketplace/MarketplaceFilters';
import { useBlockchainData } from '@/hooks/useBlockchainData';

type MarketplaceTab = 'land' | 'blueprints' | 'all';
type ViewMode = 'grid' | 'list';
type SortOption = 'price-low' | 'price-high' | 'newest' | 'oldest' | 'rarity';

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<MarketplaceTab>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedRarity, setSelectedRarity] = useState<string>('');
  const [selectedTerrain, setSelectedTerrain] = useState<string>('');

  // Get blockchain data
  const { marketplaceListings, loading, errors, refresh } = useBlockchainData();

  // Calculate counts from real data
  const landCount = marketplaceListings.filter(item => item.type === 'land').length;
  const blueprintCount = marketplaceListings.filter(item => item.type === 'blueprint').length;
  const totalCount = marketplaceListings.length;

  const tabs = [
    { id: 'all' as const, label: 'All Items', icon: ShoppingBag, count: totalCount },
    { id: 'land' as const, label: 'Land', icon: MapPin, count: landCount },
    { id: 'blueprints' as const, label: 'Blueprints', icon: Building, count: blueprintCount },
  ];

  const sortOptions = [
    { value: 'newest' as const, label: 'Newest First' },
    { value: 'oldest' as const, label: 'Oldest First' },
    { value: 'price-low' as const, label: 'Price: Low to High' },
    { value: 'price-high' as const, label: 'Price: High to Low' },
    { value: 'rarity' as const, label: 'Rarity' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace</h1>
          <p className="text-gray-600">Buy and sell land, blueprints, and other digital assets</p>
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <MarketplaceStats />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Tabs */}
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
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search marketplace..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm w-64"
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

                {/* Quick Filters */}
                <div className="hidden lg:flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Quick:</span>
                  <button className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200">
                    Rare+
                  </button>
                  <button className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full hover:bg-green-200">
                    Under 10 STX
                  </button>
                  <button className="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded-full hover:bg-purple-200">
                    New Today
                  </button>
                </div>
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
              <MarketplaceFilters
                activeTab={activeTab}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedRarity={selectedRarity}
                setSelectedRarity={setSelectedRarity}
                selectedTerrain={selectedTerrain}
                setSelectedTerrain={setSelectedTerrain}
              />
            )}
          </div>

          {/* Listings */}
          <div className="p-6">
            {(activeTab === 'all' || activeTab === 'land') && (
              <div className="mb-8">
                {activeTab === 'all' && (
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Land Plots</h2>
                )}
                <LandListings
                  viewMode={viewMode}
                  sortBy={sortBy}
                  searchQuery={searchQuery}
                  priceRange={priceRange}
                  selectedRarity={selectedRarity}
                  selectedTerrain={selectedTerrain}
                  showAll={activeTab === 'land'}
                />
              </div>
            )}

            {(activeTab === 'all' || activeTab === 'blueprints') && (
              <div>
                {activeTab === 'all' && (
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Blueprints</h2>
                )}
                <BlueprintListings
                  viewMode={viewMode}
                  sortBy={sortBy}
                  searchQuery={searchQuery}
                  priceRange={priceRange}
                  selectedRarity={selectedRarity}
                  showAll={activeTab === 'blueprints'}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
