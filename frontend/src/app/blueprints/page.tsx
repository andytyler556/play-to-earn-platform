'use client';

import React, { useState } from 'react';
import { 
  Package, 
  Grid3X3, 
  List, 
  Filter,
  Search,
  Star,
  Plus,
  RefreshCw,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BlueprintGallery } from '@/components/game/BlueprintGallery';
import { BlueprintDetails } from '@/components/game/BlueprintDetails';
import { useBlockchainData } from '@/hooks/useBlockchainData';
import { useWallet } from '@/components/providers/WalletProvider';

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'residential' | 'commercial' | 'industrial' | 'military' | 'special';
type RarityFilter = 'all' | 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
type SortOption = 'newest' | 'oldest' | 'rarity' | 'building_type';

export default function BlueprintsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filter, setFilter] = useState<FilterType>('all');
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlueprint, setSelectedBlueprint] = useState<string | null>(null);

  const { isConnected } = useWallet();
  const { blueprints, loading, errors, refresh } = useBlockchainData();

  const filteredBlueprints = blueprints
    .filter(blueprint => {
      const matchesType = filter === 'all' || blueprint.buildingType === filter;
      const matchesRarity = rarityFilter === 'all' || blueprint.rarity === rarityFilter;
      const matchesSearch = searchTerm === '' || 
        blueprint.buildingType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blueprint.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesRarity && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.tokenId - a.tokenId;
        case 'oldest':
          return a.tokenId - b.tokenId;
        case 'rarity':
          const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
          return rarityOrder[b.rarity] - rarityOrder[a.rarity];
        case 'building_type':
          return a.buildingType.localeCompare(b.buildingType);
        default:
          return 0;
      }
    });

  const rarityStats = blueprints.reduce((acc, blueprint) => {
    acc[blueprint.rarity] = (acc[blueprint.rarity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-digital-oasis flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallet Not Connected</h2>
          <p className="text-gray-600 mb-4">Please connect your wallet to view your blueprints.</p>
          <Button onClick={() => window.location.href = '/'}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-digital-oasis">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Package className="w-8 h-8 mr-3 text-blue-500" />
                Blueprint Collection
              </h1>
              <p className="text-gray-600 mt-1">Manage your building blueprints and construction plans</p>
            </div>
            <div className="flex items-center space-x-2">
              {loading.blueprints && (
                <div className="flex items-center text-sm text-gray-600">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={refresh.blueprints}
                leftIcon={<RefreshCw className={loading.blueprints ? 'animate-spin' : ''} />}
                disabled={loading.blueprints}
              >
                Refresh
              </Button>
              <Button leftIcon={<Plus />} className="bg-blue-500 hover:bg-blue-600">
                Acquire Blueprint
              </Button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {errors.blueprints && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error Loading Blueprint Data</h3>
                <p className="text-sm text-red-700 mt-1">{errors.blueprints}</p>
                <p className="text-xs text-red-600 mt-2">
                  Using cached or mock data. Check your connection and try refreshing.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-game p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Blueprints</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading.blueprints ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    blueprints.length
                  )}
                </p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-game p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Legendary</p>
                <p className="text-2xl font-bold text-yellow-600">{rarityStats.legendary || 0}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-game p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Epic</p>
                <p className="text-2xl font-bold text-purple-600">{rarityStats.epic || 0}</p>
              </div>
              <Star className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-game p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rare</p>
                <p className="text-2xl font-bold text-blue-600">{rarityStats.rare || 0}</p>
              </div>
              <Star className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-game p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Common</p>
                <p className="text-2xl font-bold text-gray-600">{(rarityStats.common || 0) + (rarityStats.uncommon || 0)}</p>
              </div>
              <Star className="w-8 h-8 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-game border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search blueprints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterType)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
                <option value="military">Military</option>
                <option value="special">Special</option>
              </select>
              <select
                value={rarityFilter}
                onChange={(e) => setRarityFilter(e.target.value as RarityFilter)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Rarities</option>
                <option value="common">Common</option>
                <option value="uncommon">Uncommon</option>
                <option value="rare">Rare</option>
                <option value="epic">Epic</option>
                <option value="legendary">Legendary</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="rarity">By Rarity</option>
                <option value="building_type">By Type</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                leftIcon={<Grid3X3 />}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                leftIcon={<List />}
              >
                List
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <BlueprintGallery
              blueprints={filteredBlueprints}
              viewMode={viewMode}
              onSelectBlueprint={setSelectedBlueprint}
              selectedBlueprintId={selectedBlueprint}
            />

            {filteredBlueprints.length === 0 && !loading.blueprints && (
              <div className="bg-white rounded-lg shadow-game border border-gray-200 p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Blueprints Found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filter !== 'all' || rarityFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'You don\'t own any blueprints yet. Start collecting to build your empire!'
                  }
                </p>
                <Button leftIcon={<Plus />} className="bg-blue-500 hover:bg-blue-600">
                  Acquire Your First Blueprint
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {selectedBlueprint ? (
              <BlueprintDetails 
                blueprintId={selectedBlueprint} 
                onClose={() => setSelectedBlueprint(null)}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-game border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-blue-500" />
                  Blueprint Details
                </h3>
                <p className="text-gray-600 text-sm">
                  Select a blueprint to view detailed information, resource requirements, and construction options.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
